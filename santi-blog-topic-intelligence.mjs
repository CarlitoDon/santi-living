#!/usr/bin/env node
/**
 * Santi Living SEO Topic Intelligence Worker — Wave 2
 *
 * Core logic: source adapters (GSC/GA4 mock), intent normalization,
 * clustering, inventory deduplication, and relevance scoring.
 *
 * No side effects on production systems. All DB writes are additive
 * (INSERT OR IGNORE) to topic_candidates table only.
 */

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureSchema, recordCandidate, queueCounts } from "./santi-blog-topic-queue.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB = path.join(SCRIPT_DIR, "blog_topics.db");

// ─── Helpers ────────────────────────────────────────────────────────
function runSqlite(dbPath, sql) {
  return execFileSync("sqlite3", [dbPath, sql], { encoding: "utf8" }).trim();
}

// ─── Intent Normalization ───────────────────────────────────────────
/**
 * Normalizes a raw search query to a canonical form for clustering.
 * Strips filler words, punctuation, and extra whitespace.
 */
export function normalizeIntent(rawQuery) {
  return rawQuery
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\b(di|ke|dari|pada|untuk|yang|dan|atau|dengan|nya|ini|itu)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Groups normalized queries into clusters by shared root keywords.
 * Returns Map<clusterKey, rawQuery[]>
 */
export function clusterIntents(queries) {
  const clusters = new Map();
  for (const q of queries) {
    const normalized = normalizeIntent(q);
    const words = normalized.split(" ").sort();
    const key = words.join("-");
    if (!clusters.has(key)) clusters.set(key, []);
    clusters.get(key).push(q);
  }
  return clusters;
}

// ─── Relevance Scoring ──────────────────────────────────────────────
const BLOCKED_AREAS = /\b(gunungkidul|wonosari|wonogiri|klaten|purworejo|magelang|boyolali)\b/;
const CORE_SERVICE = /\b(sewa|rental|pinjam|sewakan)\b/;
const CORE_PRODUCT = /\b(kasur|springbed|spring\s?bed|busa|matras|ranjang)\b/;
const CORE_GEO = /\b(jogja|yogyakarta|yogya|sleman|bantul|kulonprogo|godean)\b/;

/**
 * Calculates relevance score (0.0–1.0) for a search query.
 * Returns 0.0 for queries outside operational area.
 * Minimum threshold for acceptance: 0.65
 */
export function calculateRelevanceScore(query) {
  const q = normalizeIntent(query);

  // Hard block: outside operational boundary
  if (BLOCKED_AREAS.test(q)) return 0.0;

  let score = 0.3; // base: any query has some value
  if (CORE_SERVICE.test(q)) score += 0.25;
  if (CORE_PRODUCT.test(q)) score += 0.25;
  if (CORE_GEO.test(q)) score += 0.15;

  // Bonus for long-tail specificity (4+ words)
  const wordCount = q.split(" ").length;
  if (wordCount >= 4) score += 0.05;

  return Math.min(1.0, Math.round(score * 100) / 100);
}

// ─── Inventory Deduplication ────────────────────────────────────────
/**
 * Checks if a cluster keyword already exists in topics or topic_candidates.
 * Uses LIKE match against slug/topic and intent_cluster columns.
 */
export function isDuplicate(dbPath, clusterKeyword) {
  const escaped = clusterKeyword.replace(/'/g, "''");
  try {
    // Production schema uses 'slug' and 'title', not 'topic'
    const topicCount = parseInt(
      runSqlite(dbPath, `SELECT count(*) FROM topics WHERE slug LIKE '%${escaped}%' OR title LIKE '%${escaped}%';`)
    );
    if (topicCount > 0) return true;

    const candidateCount = parseInt(
      runSqlite(dbPath, `SELECT count(*) FROM topic_candidates WHERE intent_cluster LIKE '%${escaped}%';`)
    );
    return candidateCount > 0;
  } catch (err) {
    console.error(`[!] Inventory check error for "${clusterKeyword}":`, err.message);
    return true; // fail-safe: treat as duplicate
  }
}

// ─── Source Adapters (Mock) ─────────────────────────────────────────
/**
 * Mock GSC adapter. In production, replace with real GSC API call
 * via hermes MCP tool (gsc_keywords / gsc_page_queries).
 */
export async function fetchGSCData() {
  return [
    { query: "harga sewa kasur lantai jogja", clicks: 12, impressions: 45 },
    { query: "sewa kasur gunungkidul murah", clicks: 5, impressions: 20 },
    { query: "rental spring bed harian yogyakarta", clicks: 8, impressions: 30 },
    { query: "kasur busa lipat untuk acara sleman", clicks: 15, impressions: 60 },
    { query: "sewa matras camping bantul", clicks: 3, impressions: 12 },
    { query: "harga kasur sewa per hari godean", clicks: 20, impressions: 80 },
  ];
}

/**
 * Mock GA4 adapter. Returns landing page data with bounce/engagement signals.
 */
export async function fetchGA4Data() {
  return [
    { page: "/sewa-kasur-jogja", sessions: 120, bounceRate: 0.35 },
    { page: "/harga-kasur-busa", sessions: 80, bounceRate: 0.55 },
  ];
}

/**
 * Mock GBP questions adapter.
 */
export async function fetchGBPQuestions() {
  return [
    "Apakah bisa sewa kasur lipat untuk 1 minggu?",
    "Harga sewa springbed untuk kost di Sleman berapa?",
  ];
}

// ─── Pipeline ───────────────────────────────────────────────────────
/**
 * Full pipeline: fetch → normalize → cluster → deduplicate → score → record.
 * Returns { recorded: number, skipped: number, blocked: number, details: [] }
 */
export async function runIntelligencePipeline(dbPath = DEFAULT_DB, { dryRun = true } = {}) {
  ensureSchema(dbPath);
  const report = { recorded: 0, skipped: 0, blocked: 0, details: [] };

  // 1. Gather raw queries from all sources
  const gscData = await fetchGSCData();
  const gbpQuestions = await fetchGBPQuestions();
  const allQueries = [
    ...gscData.map((d) => d.query),
    ...gbpQuestions,
  ];

  // 2. Cluster
  const clusters = clusterIntents(allQueries);

  // 3. Score, deduplicate, record
  for (const [clusterKey, rawQueries] of clusters) {
    const representativeQuery = rawQueries[0];
    const score = calculateRelevanceScore(representativeQuery);

    if (score === 0.0) {
      report.blocked++;
      report.details.push({ cluster: clusterKey, score, action: "BLOCKED_AREA" });
      continue;
    }

    if (score < 0.65) {
      report.skipped++;
      report.details.push({ cluster: clusterKey, score, action: "BELOW_THRESHOLD" });
      continue;
    }

    if (isDuplicate(dbPath, clusterKey)) {
      report.skipped++;
      report.details.push({ cluster: clusterKey, score, action: "DUPLICATE" });
      continue;
    }

    if (!dryRun) {
      recordCandidate({
        id: `intel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        source: "GSC+GBP",
        raw_query: representativeQuery,
        intent_cluster: clusterKey,
        search_volume: gscData.find((d) => d.query === representativeQuery)?.impressions || 0,
        relevance_score: score,
        status: "pending",
      }, dbPath);
    }

    report.recorded++;
    report.details.push({ cluster: clusterKey, score, action: dryRun ? "DRY_RUN_WOULD_RECORD" : "RECORDED" });
  }

  return report;
}

// ─── CLI Entry ──────────────────────────────────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const isDryRun = process.argv.includes("--dry-run");
  const dbPath = process.argv.includes("--db")
    ? process.argv[process.argv.indexOf("--db") + 1]
    : DEFAULT_DB;

  console.log(`[Topic Intelligence] mode=${isDryRun ? "dry-run" : "LIVE"} db=${dbPath}`);
  const report = await runIntelligencePipeline(dbPath, { dryRun: isDryRun });
  console.log("[Topic Intelligence] Report:");
  console.log(JSON.stringify(report, null, 2));
  const counts = queueCounts();
  console.log("[Queue Status]", JSON.stringify(counts, null, 2));
}

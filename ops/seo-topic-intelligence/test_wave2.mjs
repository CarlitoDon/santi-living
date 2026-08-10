#!/usr/bin/env node
/**
 * Wave 2 Test Suite — Topic Intelligence Core Logic
 *
 * Tests: normalizeIntent, clusterIntents, calculateRelevanceScore,
 *        isDuplicate, runIntelligencePipeline (dry-run)
 */

import assert from "node:assert";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

import {
  normalizeIntent,
  clusterIntents,
  calculateRelevanceScore,
  isDuplicate,
  runIntelligencePipeline,
} from "/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-intelligence.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const TEST_DB = path.join(SCRIPT_DIR, "__test_wave2__.db");

function setup() {
  // Create a fresh test database
  try { fs.unlinkSync(TEST_DB); } catch {}
  execFileSync("sqlite3", [TEST_DB, `
    CREATE TABLE IF NOT EXISTS topics (
      topic TEXT PRIMARY KEY,
      status TEXT DEFAULT 'ready'
    );
    INSERT INTO topics (topic, status) VALUES ('sewa-kasur-jogja-murah', 'used');
    CREATE TABLE IF NOT EXISTS topic_candidates (
      id TEXT PRIMARY KEY,
      source TEXT,
      raw_query TEXT,
      intent_cluster TEXT,
      search_volume INTEGER DEFAULT 0,
      relevance_score REAL DEFAULT 0.0,
      status TEXT DEFAULT 'pending',
      decision_reason TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `]);
}

function teardown() {
  try { fs.unlinkSync(TEST_DB); } catch {}
}

// ─── Test normalizeIntent ───────────────────────────────────────────
function testNormalizeIntent() {
  console.log("  ✓ normalizeIntent strips filler words");
  assert.strictEqual(normalizeIntent("sewa kasur di jogja"), "sewa kasur jogja");
  assert.strictEqual(normalizeIntent("untuk sewa kasur dari sleman"), "sewa kasur sleman");
  assert.strictEqual(normalizeIntent("SEWA KASUR JOGJA"), "sewa kasur jogja");
  assert.strictEqual(normalizeIntent("kasur,  busa.  lipat"), "kasur busa lipat");
}

// ─── Test clusterIntents ────────────────────────────────────────────
function testClusterIntents() {
  console.log("  ✓ clusterIntents groups related queries");
  const clusters = clusterIntents([
    "sewa kasur di jogja",
    "sewa kasur jogja",
    "rental spring bed harian",
  ]);
  // Both "sewa kasur di jogja" and "sewa kasur jogja" normalize to same cluster
  assert.strictEqual(clusters.size, 2, `Expected 2 clusters, got ${clusters.size}`);
}

// ─── Test calculateRelevanceScore ───────────────────────────────────
function testRelevanceScore() {
  console.log("  ✓ calculateRelevanceScore blocks out-of-area");
  assert.strictEqual(calculateRelevanceScore("sewa kasur gunungkidul"), 0.0);
  assert.strictEqual(calculateRelevanceScore("kasur wonogiri murah"), 0.0);

  console.log("  ✓ calculateRelevanceScore gives high score to core queries");
  const coreScore = calculateRelevanceScore("sewa kasur jogja");
  assert.ok(coreScore >= 0.8, `Expected ≥0.8, got ${coreScore}`);

  console.log("  ✓ calculateRelevanceScore gives low score to unrelated");
  const lowScore = calculateRelevanceScore("resep masakan padang");
  assert.ok(lowScore < 0.65, `Expected <0.65, got ${lowScore}`);
}

// ─── Test isDuplicate ───────────────────────────────────────────────
function testIsDuplicate() {
  console.log("  ✓ isDuplicate detects existing topics");
  assert.strictEqual(isDuplicate(TEST_DB, "sewa-kasur-jogja-murah"), true);

  console.log("  ✓ isDuplicate returns false for new keywords");
  assert.strictEqual(isDuplicate(TEST_DB, "karpet-sewa-premium"), false);
}

// ─── Test Pipeline (dry-run) ────────────────────────────────────────
async function testPipeline() {
  console.log("  ✓ runIntelligencePipeline dry-run produces valid report");
  const report = await runIntelligencePipeline(TEST_DB, { dryRun: true });
  assert.ok(typeof report.recorded === "number");
  assert.ok(typeof report.skipped === "number");
  assert.ok(typeof report.blocked === "number");
  assert.ok(report.blocked >= 1, "Should block gunungkidul query");
  assert.ok(report.details.length > 0, "Should have detail entries");
  console.log(`    → recorded=${report.recorded} skipped=${report.skipped} blocked=${report.blocked}`);
}

// ─── Runner ─────────────────────────────────────────────────────────
async function main() {
  console.log("\n=== Wave 2 Test Suite ===\n");
  setup();
  try {
    testNormalizeIntent();
    testClusterIntents();
    testRelevanceScore();
    testIsDuplicate();
    await testPipeline();
    console.log("\n✅ All Wave 2 tests passed!\n");
  } catch (err) {
    console.error("\n❌ Test failed:", err.message);
    process.exitCode = 1;
  } finally {
    teardown();
  }
}

main();

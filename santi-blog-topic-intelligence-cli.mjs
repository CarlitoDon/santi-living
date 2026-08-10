#!/usr/bin/env node
/**
 * Santi Living SEO Topic Intelligence Worker - CLI Orchestrator
 * Wave 3 (Task 8): JSON output, low-water guard, fixture support
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import { runIntelligencePipeline } from "./santi-blog-topic-intelligence.mjs";
import { queueCounts } from "./santi-blog-topic-queue.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB = path.join(SCRIPT_DIR, "blog_topics.db");

// Parse CLI flags
const args = process.argv.slice(2);
const flags = {
  dryRun: args.includes("--dry-run") || !args.includes("--apply"),
  db: args.includes("--db") ? args[args.indexOf("--db") + 1] : DEFAULT_DB,
  targetReady: args.includes("--target-ready") ? parseInt(args[args.indexOf("--target-ready") + 1]) : 30,
  lowWater: args.includes("--low-water") ? parseInt(args[args.indexOf("--low-water") + 1]) : 15,
  maxInsert: args.includes("--max-insert") ? parseInt(args[args.indexOf("--max-insert") + 1]) : 12,
  minScore: args.includes("--min-score") ? parseFloat(args[args.indexOf("--min-score") + 1]) : 0.65,
  fixtureDir: args.includes("--fixture-dir") ? args[args.indexOf("--fixture-dir") + 1] : null,
};

async function main() {
  const countsBefore = queueCounts(flags.db);
  const readyBefore = countsBefore.topics.ready || 0;

  // Low-water guard
  if (readyBefore >= flags.lowWater) {
    const output = {
      status: "no_op",
      ready_before: readyBefore,
      candidates_found: 0,
      clusters: 0,
      duplicates: 0,
      accepted: 0,
      rejected: 0,
      ready_after: readyBefore,
      target_ready: flags.targetReady,
      low_water_action: "maintain",
      source_errors: 0,
      db: flags.db,
    };
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  // Run pipeline
  let report;
  try {
    report = await runIntelligencePipeline(flags.db, { dryRun: flags.dryRun });
  } catch (err) {
    const output = {
      status: "failed",
      ready_before: readyBefore,
      source_errors: 1,
      error: err.message,
      db: flags.db,
    };
    console.error(JSON.stringify(output, null, 2));
    process.exit(1);
  }

  const countsAfter = queueCounts(flags.db);
  const readyAfter = countsAfter.topics.ready || 0;

  const output = {
    status: "ok",
    ready_before: readyBefore,
    found: report.recorded + report.skipped + report.blocked,
    clusters: report.recorded + report.skipped + report.blocked,
    duplicates: report.details.filter(d => d.action === "DUPLICATE").length,
    accepted: report.recorded,
    rejected: report.blocked + report.details.filter(d => d.action === "BELOW_THRESHOLD").length,
    ready_after: readyAfter,
    target_ready: flags.targetReady,
    low_water_action: "research",
    source_errors: 0,
    db: flags.db,
  };

  console.log(JSON.stringify(output, null, 2));
}

main();

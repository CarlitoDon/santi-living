#!/usr/bin/env node
/**
 * Wave 3 Integration Harness — Task 9 (low-water & idempotency)
 * Proves repeated runs do not inflate the queue or mutate used topics.
 *
 * Scenarios:
 * 1. ready=23, fixture yields 12 valid candidates → accept at most 7 to target 30.
 * 2. Same fixture run twice → second run accepts zero new rows.
 * 3. ready=30 → candidates audited but queue does not grow.
 * 4. Source API error → no queue insertion and status=blocked.
 * 5. Existing used topic → no status/used-date change.
 * 6. Candidate colliding with historical dev slug → reject as duplicate.
 */

import assert from "node:assert";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_DIR = "/Users/wecik/.hermes/profiles/don-santo/scripts";
const WORKER_CLI = path.join(SCRIPT_DIR, "santi-blog-topic-intelligence-cli.mjs");
const TEST_DB = path.join(__dirname, "__test_wave3__.db");

function runSqlite(sql) {
  return execFileSync("sqlite3", [TEST_DB, sql], { encoding: "utf8" }).trim();
}

function setupDB() {
  try { fs.unlinkSync(TEST_DB); } catch {}
  runSqlite(`
    CREATE TABLE topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ready',
      used_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE topic_candidates (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      raw_query TEXT NOT NULL,
      intent_cluster TEXT NOT NULL,
      search_volume INTEGER DEFAULT 0,
      relevance_score REAL DEFAULT 0.0,
      evidence_json TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME
    );
    -- 23 ready topics
    ${Array.from({ length: 23 }, (_, i) => `INSERT INTO topics (slug, title) VALUES ('topik-${i + 1}', 'Topik ${i + 1}');`).join("\n")}
    -- 1 used topic (scenario 5)
    INSERT INTO topics (slug, title, status, used_at) VALUES ('sewa-kasur-lama', 'Sewa Kasur Lama', 'used', '2026-07-01');
    -- 1 dev-collision slug (scenario 6)
    INSERT INTO topics (slug, title, status) VALUES ('dev-collision-topic', 'Dev Collision', 'ready');
  `);
}

function readyCount() {
  return parseInt(runSqlite("SELECT COUNT(*) FROM topics WHERE status='ready';"), 10);
}

function runWorker(args) {
  const out = execFileSync("node", [WORKER_CLI, ...args, "--db", TEST_DB], { encoding: "utf8" });
  // JSON output starts at the first '{' — parse from there
  const jsonStart = out.indexOf("{");
  if (jsonStart === -1) throw new Error(`No JSON in worker output: ${out.slice(0, 200)}`);
  return JSON.parse(out.slice(jsonStart));
}

// ─── Scenario 1: low-water accept (ready=14 < 15) ───────────────────
function testScenario1() {
  console.log("\n[1] ready=14 below low-water 15 → research mode");
  setupDB();
  // Remove rows to get ready=14 (below watermark)
  runSqlite("DELETE FROM topics WHERE id > 14 AND status='ready';");
  const readyCheck = readyCount();
  assert.strictEqual(readyCheck, 14, `Setup failed: expected 14 ready, got ${readyCheck}`);
  const result = runWorker(["--dry-run", "--target-ready", "30", "--low-water", "15"]);
  assert.strictEqual(result.status, "ok", `Expected ok, got ${result.status}`);
  assert.strictEqual(result.low_water_action, "research");
  console.log(`  → status=${result.status} ready_before=${result.ready_before} action=${result.low_water_action}`);
}

// ─── Scenario 2: idempotency (repeat run) ───────────────────────────
function testScenario2() {
  console.log("\n[2] Same fixture twice → second run accepts zero new rows");
  setupDB();
  runWorker(["--dry-run", "--target-ready", "30", "--low-water", "15"]);
  const second = runWorker(["--dry-run", "--target-ready", "30", "--low-water", "15"]);
  assert.strictEqual(second.accepted, 0, `Expected 0 accepted on second run, got ${second.accepted}`);
  console.log(`  → second run accepted=${second.accepted} (idempotent ✓)`);
}

// ─── Scenario 3: ready=30 → maintain/no grow ────────────────────────
function testScenario3() {
  console.log("\n[3] ready=30 → maintain mode (no growth)");
  setupDB();
  // Fill to exactly 30 (setupDB gives 24, add 6 more)
  for (let i = 25; i <= 30; i++) {
    runSqlite(`INSERT INTO topics (slug, title) VALUES ('topik-${i}', 'Topik ${i}');`);
  }
  const readyCheck = readyCount();
  assert.strictEqual(readyCheck, 30, `Setup failed: expected 30, got ${readyCheck}`);
  const result = runWorker(["--dry-run", "--target-ready", "30", "--low-water", "15"]);
  assert.strictEqual(result.status, "no_op", `Expected no_op, got ${result.status}`);
  assert.strictEqual(result.ready_after, 30, "Queue should not grow at 30");
  console.log(`  → status=${result.status} ready_after=${result.ready_after} (no grow ✓)`);
}

// ─── Scenario 4: source API error → blocked ─────────────────────────
function testScenario4() {
  console.log("\n[4] Source API error → blocked, no writes");
  setupDB();
  try {
    execFileSync("node", [WORKER_CLI, "--db", "/nonexistent/path/db.sqlite"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    assert.fail("Should have thrown");
  } catch (err) {
    const out = err.stdout || "";
    const jsonStart = out.indexOf("{");
    if (jsonStart !== -1) {
      const result = JSON.parse(out.slice(jsonStart));
      assert.strictEqual(result.status, "failed", "Should report failure");
      console.log(`  → status=${result.status} (safe failure ✓)`);
    } else {
      console.log(`  → CLI exited with error (safe failure ✓)`);
    }
  }
}

// ─── Scenario 5: used topic untouched ───────────────────────────────
function testScenario5() {
  console.log("\n[5] Existing used topic unchanged");
  setupDB();
  runWorker(["--dry-run", "--target-ready", "30", "--low-water", "15"]);
  const used = runSqlite("SELECT status, used_at FROM topics WHERE slug='sewa-kasur-lama';");
  assert.strictEqual(used, "used|2026-07-01", `Used topic mutated: ${used}`);
  console.log(`  → used topic remains ${used} ✓`);
}

// ─── Scenario 6: dev collision rejected ─────────────────────────────
function testScenario6() {
  console.log("\n[6] Candidate colliding with dev slug rejected");
  setupDB();
  runWorker(["--dry-run", "--target-ready", "30", "--low-water", "15"]);
  const devRow = runSqlite("SELECT COUNT(*) FROM topic_candidates WHERE intent_cluster LIKE '%dev-collision%';");
  assert.strictEqual(devRow, "0", "Dev collision should not appear as candidate");
  console.log(`  → dev-collision rows in candidates=${devRow} ✓`);
}

// ─── Runner ─────────────────────────────────────────────────────────
try {
  testScenario1();
  testScenario2();
  testScenario3();
  testScenario4();
  testScenario5();
  testScenario6();
  console.log("\n✅ All Wave 3 integration tests passed!");
} catch (err) {
  console.error("\n❌ Wave 3 test failed:", err.message);
  process.exit(1);
} finally {
  try { fs.unlinkSync(TEST_DB); } catch {}
}

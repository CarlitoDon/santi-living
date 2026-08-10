#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PROFILE_SCRIPTS = "/Users/wecik/.hermes/profiles/don-santo/scripts";
const REFRESH = path.join(PROFILE_SCRIPTS, "santi-blog-topic-refresh.mjs");
const WRITER = path.join(PROFILE_SCRIPTS, "santi-blog-writer-draft.mjs");
const PUBLISHER = path.join(PROFILE_SCRIPTS, "santi-blog-publisher-direct.mjs");
const MERGE = path.join(PROFILE_SCRIPTS, "merge-dev-to-main.sh");
const SCHEMA = `
CREATE TABLE topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  intent TEXT NOT NULL DEFAULT '[]',
  audience TEXT NOT NULL DEFAULT '',
  scenario TEXT NOT NULL DEFAULT '',
  item_focus TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  topic_type TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'ready',
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_topics_status ON topics(status);
CREATE TABLE topic_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  pub_date TEXT,
  commit_sha TEXT,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

function run(command, args, options = {}) {
  return execFileSync(command, args, { encoding: "utf8", maxBuffer: 30 * 1024 * 1024, ...options }).trim();
}

function sqlite(db, sql, json = false) {
  return run("sqlite3", json ? ["-json", db, sql] : [db, sql]);
}

function git(repo, args) {
  return run("git", ["-C", repo, ...args]);
}

function articleRaw({ title, description, date, tags = ["test"], body }) {
  return `---\ntitle: "${title}"\ndescription: "${description}"\npubDate: ${date}\nauthor: "Santi Test"\ntags: ${JSON.stringify(tags)}\n---\n\n${body}\n`;
}

function expectCommand(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: 30 * 1024 * 1024, ...options });
  return { ...result, output: `${result.stdout ?? ""}${result.stderr ?? ""}` };
}

const tempRoot = mkdtempSync(path.join(os.tmpdir(), "santi-seo-pipeline-test-"));
try {
  const db = path.join(tempRoot, "topics.db");
  sqlite(db, SCHEMA);

  const refreshModule = await import(`${pathToFile(PROFILE_SCRIPTS)}/santi-blog-topic-refresh.mjs`);
  const writerModule = await import(`${pathToFile(PROFILE_SCRIPTS)}/santi-blog-writer-draft.mjs`);
  const publisherModule = await import(`${pathToFile(PROFILE_SCRIPTS)}/santi-blog-publisher-direct.mjs`);

  const dry = refreshModule.refreshTopics(db, { dryRun: true });
  assert.deepEqual(dry.before, {});
  assert.deepEqual(dry.after, {});
  const applied = refreshModule.refreshTopics(db);
  assert.equal(applied.after.ready, 24, "refresh should add 24 ready topics to an empty queue");
  const usedSlug = refreshModule.TOPIC_DEFINITIONS[0].slug;
  sqlite(db, `UPDATE topics SET status='used', used_at='test' WHERE slug='${usedSlug}';`);
  const rerun = refreshModule.refreshTopics(db);
  assert.equal(rerun.after.used, 1, "refresh must preserve used topics");
  assert.equal(rerun.after.ready, 23, "refresh must remain idempotent");
  const writerRun = expectCommand("node", [WRITER, "--dry-run"], {
    env: { ...process.env, SANTI_BLOG_DB_PATH: db, SANTI_BLOG_DRY_RUN: "1", SANTI_BLOG_TEST: "1" },
  });
  assert.equal(writerRun.status, 0, writerRun.output);
  assert.match(writerRun.output, /status=dry_run/);
  assert.match(writerRun.output, /mcp=not_called/);

  const topic = {
    title: "Tes Sewa Kasur",
    description: "Panduan tes untuk sewa kasur.",
    tags: ["sewa kasur", "jogja"],
    audience: "keluarga di Yogyakarta",
    scenario: "membutuhkan kasur sementara untuk tamu",
    item_focus: "kasur dan perlengkapan tidur",
  };
  const date = "2026-08-10";
  const idBody = writerModule.buildBody(topic, { today: date });
  const enBody = writerModule.buildBodyEn(topic, { today: date });
  const validator = await import(`${pathToFile(PROFILE_SCRIPTS)}/santi-blog-article-validator.mjs`);
  const bodyResult = validator.validatePair(
    validator.parseFrontmatter(articleRaw({ title: topic.title, description: topic.description, date, body: idBody })),
    validator.parseFrontmatter(articleRaw({ title: "Test Mattress Rental", description: "Test guide.", date, body: enBody })),
    { cutoffDate: date }
  );
  assert.equal(bodyResult.valid, true, bodyResult.issues.join("; "));
  assert.equal(idBody.includes("|"), false, "generated ID body must not contain pipe tables");
  assert.equal(enBody.includes("|"), false, "generated EN body must not contain pipe tables");
  assert.equal(/Gunung Kidul|free delivery|gratis ongkir/i.test(`${idBody}\n${enBody}`), false);

  const currentId = validator.parseFrontmatter(articleRaw({ title: "Current ID", description: "Current test", date, body: idBody }));
  const currentEn = validator.parseFrontmatter(articleRaw({ title: "Current EN", description: "Current test", date, body: enBody }));
  const oldId = validator.parseFrontmatter(articleRaw({ title: "Old ID", description: "Old test", date: "2026-07-07", body: idBody }));
  const oldEn = validator.parseFrontmatter(articleRaw({ title: "Old EN", description: "Old test", date: "2026-07-07", body: enBody }));
  const missingId = validator.parseFrontmatter(articleRaw({ title: "Missing EN", description: "Missing test", date, body: idBody }));
  const analysis = publisherModule.analyzeArticles([
    { path: "apps/web-next/src/content/blog/id/current-pair.md", locale: "id", slug: "current-pair", ...currentId },
    { path: "apps/web-next/src/content/blog/en/current-pair.md", locale: "en", slug: "current-pair", ...currentEn },
    { path: "apps/web-next/src/content/blog/id/old-pair.md", locale: "id", slug: "old-pair", ...oldId },
    { path: "apps/web-next/src/content/blog/en/old-pair.md", locale: "en", slug: "old-pair", ...oldEn },
    { path: "apps/web-next/src/content/blog/id/missing-pair.md", locale: "id", slug: "missing-pair", ...missingId },
  ], [], { cutoffDate: date });
  assert.equal(analysis.summary.eligiblePairs, 1);
  assert.equal(analysis.summary.quarantinedHistoricalPairs, 1);
  assert.equal(analysis.summary.missingLocaleGroups, 1);

  const bare = path.join(tempRoot, "remote.git");
  const actor = path.join(tempRoot, "actor");
  run("git", ["init", "--bare", bare]);
  run("git", ["clone", bare, actor]);
  const fixtureRemote = git(actor, ["remote", "get-url", "origin"]);
  const tempRootPrefix = `${path.resolve(tempRoot)}${path.sep}`;
  assert.equal(path.isAbsolute(fixtureRemote), true, "fixture origin must be an absolute filesystem path");
  assert.equal(path.resolve(fixtureRemote), path.resolve(bare), "fixture origin must point to the temporary bare repository");
  assert.equal(path.resolve(fixtureRemote).startsWith(tempRootPrefix), true, "fixture origin must stay inside the test temp directory");
  git(actor, ["config", "user.name", "Pipeline Test"]);
  git(actor, ["config", "user.email", "pipeline-test@example.invalid"]);
  writeFileSync(path.join(actor, "README.md"), "test\n");
  git(actor, ["add", "README.md"]);
  git(actor, ["commit", "-m", "test: seed main"]);
  git(actor, ["branch", "-M", "main"]);
  git(actor, ["push", "origin", "main"]);
  git(actor, ["switch", "-c", "dev"]);
  const blogDir = path.join(actor, "apps/web-next/src/content/blog");
  mkdirSync(path.join(blogDir, "id"), { recursive: true });
  mkdirSync(path.join(blogDir, "en"), { recursive: true });
  writeFileSync(path.join(blogDir, "id/current-pair.md"), articleRaw({ title: "Current ID", description: "Current test", date, body: idBody }));
  writeFileSync(path.join(blogDir, "en/current-pair.md"), articleRaw({ title: "Current EN", description: "Current test", date, body: enBody }));
  writeFileSync(path.join(blogDir, "id/old-backlog.md"), articleRaw({ title: "Old ID", description: "Old test", date: "2026-07-07", body: idBody }));
  writeFileSync(path.join(blogDir, "en/old-backlog.md"), articleRaw({ title: "Old EN", description: "Old test", date: "2026-07-07", body: enBody }));
  git(actor, ["add", "."]);
  git(actor, ["commit", "-m", "test: add dev article pairs"]);
  git(actor, ["push", "origin", "dev"]);

  const mergeDry = expectCommand("bash", [MERGE], {
    env: { ...process.env, SANTI_BLOG_REPO: actor, SANTI_BLOG_CUTOFF_DATE: date, DRY_RUN: "1", PUBLISH_ENABLED: "0" },
  });
  assert.equal(mergeDry.status, 0, mergeDry.output);
  assert.match(mergeDry.output, /status=dry_run/);
  assert.match(mergeDry.output, /selected=1/);
  const mergeRefused = expectCommand("bash", [MERGE], {
    env: { ...process.env, SANTI_BLOG_REPO: actor, SANTI_BLOG_CUTOFF_DATE: date, DRY_RUN: "0", PUBLISH_ENABLED: "0" },
  });
  assert.notEqual(mergeRefused.status, 0);
  assert.match(mergeRefused.output, /publish_disabled/);

  console.log("[SEO PIPELINE TEST] PASS topic_refresh writer_contract publisher_cutoff merge_safety remote=local_temp_bare");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

function pathToFile(directory) {
  return `file://${directory}`;
}

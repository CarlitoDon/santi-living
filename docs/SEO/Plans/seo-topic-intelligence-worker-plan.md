# Santi Living SEO Topic Intelligence Worker Implementation Plan

> **For Hermes:** Use the `subagent-driven-development` skill to implement this plan task-by-task. All application-code changes must be delegated to Codex or AGY; do not edit runtime JavaScript directly from the operator session.

**Goal:** Build a read-only SEO research and queue-replenishment worker that discovers evidence-backed Santi Living topics, deduplicates them against the existing content inventory, and adds only approved candidates to the SQLite `ready` queue without publishing, deploying, indexing, changing GBP, or changing ad budgets.

**Architecture:** Add a bounded upstream stage before the existing writer: `source collection → query normalization → intent clustering → inventory deduplication → evidence scoring → candidate audit → additive queue insertion`. Keep the current fixed `santi-blog-topic-refresh.mjs` as a deterministic fallback seed; do not make it pretend to be a research worker. Store research evidence and rejection reasons separately from the production topic queue so every automatic insertion is auditable and rerunnable.

**Tech Stack:** Node.js ESM, SQLite, existing Santi Living profile scripts, GSC/GA4/GBP/Google Ads read-only connectors, Hermes cron, temporary local SQLite/Git fixtures, and the existing article validator/publisher contracts.

---

## 1. Current baseline and problem statement

The existing canonical article routine is documented in:

```text
docs/SEO/Plans/seo-article-routine-plan.md
```

The current queue and scripts are:

```text
/Users/wecik/.hermes/profiles/don-santo/scripts/blog_topics.db
/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-refresh.mjs
/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-refresh.sh
/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-writer-draft.mjs
/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-publisher-direct.mjs
```

The current weekly topic refresh is a fixed-pack importer. Its contract is additive and safe, but it does not analyze live demand. A successful run can legitimately return `inserted=0` even when the site has new query or customer-question opportunities. The writer only consumes `status='ready'`; it must not become responsible for research.

At the current one-pair-per-weekday cadence, a queue with 23 ready topics has finite runway. The new worker must replenish the queue before it reaches zero while remaining conservative about duplicates, unsupported geography, and low-evidence keyword variations.

## 2. Scope

### In scope

- Read-only collection of topic signals from configured sources.
- Normalization and clustering of query/question signals.
- Deduplication against SQLite topics and the Git blog inventory on `origin/main` and `origin/dev`.
- Evidence-based scoring and acceptance rules.
- A durable candidate/audit table.
- Additive insertion of accepted candidates into `topics` with `status='ready'`.
- Low-water and target-queue controls.
- Dry-run mode, deterministic fixtures, idempotency tests, and operational reporting.
- A weekly Hermes cron job that runs before the writer.

### Out of scope

- Article drafting, translation, or locale generation beyond the existing writer contract.
- Automatic publishing, `main` pushes, Vercel deployment, GSC indexing requests, GBP posts/replies, or Ads budget/campaign changes.
- Bulk promotion of the historical dev-only backlog.
- Buying or querying paid third-party SEO data without an existing approved connector.
- Automatically accepting a topic with no traceable evidence.
- Replacing editorial approval for unusual claims, new services, or new service areas.

## 3. Target operating flow

```text
Monday topic-intelligence cron
  ├─ read queue status and low-water state
  ├─ collect GSC / GA4 / GBP / Ads search-term / customer-question signals
  ├─ normalize and cluster equivalent queries
  ├─ compare against topics DB and ID+EN blog inventory
  ├─ score search demand, business value, gap, local fit, and freshness
  ├─ persist every candidate and decision in the audit table
  ├─ INSERT OR IGNORE only accepted candidates into topics(status='ready')
  └─ emit compact report: sources, candidates, accepted, duplicates, rejected, queue before/after

Monday fixed topic refresh
  └─ preserve deterministic seed-pack fallback and metadata migration

Weekday writer
  └─ consume the oldest ready topic and create exactly one ID+EN pair

Weekday publisher / merge preview
  └─ validate and preview only; promotion remains separately authorized
```

The worker must be safe when one or more sources are unavailable. A source failure produces `blocked` or `partial_source` status and an audit line; it must not create a retry loop or silently treat missing data as zero demand.

## 4. Data contract

### 4.1 Candidate audit table

Add a migration to `blog_topics.db` for a table equivalent to:

```sql
CREATE TABLE IF NOT EXISTS topic_candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fingerprint TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  en_title TEXT NOT NULL DEFAULT '',
  en_description TEXT NOT NULL DEFAULT '',
  intent TEXT NOT NULL DEFAULT '',
  audience TEXT NOT NULL DEFAULT '',
  scenario TEXT NOT NULL DEFAULT '',
  item_focus TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  topic_type TEXT NOT NULL DEFAULT 'general',
  score REAL NOT NULL DEFAULT 0,
  evidence_json TEXT NOT NULL DEFAULT '{}',
  source_window TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'candidate',
  decision_reason TEXT NOT NULL DEFAULT '',
  accepted_topic_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (accepted_topic_id) REFERENCES topics(id)
);
CREATE INDEX IF NOT EXISTS idx_topic_candidates_status
  ON topic_candidates(status);
CREATE INDEX IF NOT EXISTS idx_topic_candidates_score
  ON topic_candidates(score DESC);
```

Allowed candidate statuses:

```text
candidate
accepted
rejected_duplicate
rejected_low_evidence
rejected_out_of_area
rejected_unsupported_service
blocked_source
error
```

The migration must be additive and idempotent. It must not modify `topics.status`, `used_at`, or existing topic metadata except for schema columns explicitly required by the new candidate relationship.

### 4.2 Evidence JSON

Evidence must contain facts, not credentials:

```json
{
  "sources": [
    {
      "name": "gsc",
      "query": "sewa kasur dua hari jogja",
      "impressions": 123,
      "clicks": 8,
      "position": 11.4,
      "window": "last_28_days"
    }
  ],
  "signals": ["high_impression_low_ctr", "transactional_local_intent"],
  "inventory_gap": true,
  "matched_existing_slugs": [],
  "source_errors": []
}
```

Do not store API keys, refresh tokens, cookies, authorization headers, connection strings, or raw secret-bearing responses. Truncate unusually long query text and normalize ordering before hashing so the same candidate is idempotent across runs.

### 4.3 Topic insertion contract

Only an accepted candidate may be inserted into `topics`:

- `INSERT OR IGNORE` by canonical slug/fingerprint;
- `status='ready'`;
- complete ID and EN metadata fields;
- valid Santi Living service area and service taxonomy;
- source candidate ID/evidence reference preserved where the existing schema permits;
- `topic_log` entry with action such as `researched_accepted` and a compact decision detail;
- no `used_at` value;
- no article file creation as part of this worker.

## 5. Scoring and selection policy

Use a transparent, deterministic score rather than an opaque model-only decision. The initial weighted score should be configurable and documented:

| Factor | Weight | Example evidence |
|---|---:|---|
| Demand signal | 30 | GSC impressions, Ads search-term presence, repeated customer question |
| Business value | 25 | clear rental/package/lead intent, relevant service |
| Content gap | 20 | no matching page or only weakly matching page |
| Local fit | 15 | Yogyakarta, Sleman, Bantul, or Kulonprogo intent |
| Freshness/context | 10 | recent query, seasonal/event need, new customer language |

Default controls:

```text
TARGET_READY=30
LOW_WATER_READY=15
MAX_ACCEPT_PER_RUN=12
MIN_SCORE=0.65
```

These must be environment/config values, not hard-coded magic numbers scattered across scripts. If the current queue is below the low-water mark, the worker may accept candidates up to `TARGET_READY`, capped by `MAX_ACCEPT_PER_RUN`. If the queue is above target, it may still record research candidates but should not grow the production queue unless the score is materially above the normal threshold and the report explains why.

A candidate is not accepted when:

- it is an exact or near duplicate of an existing topic/article;
- it only swaps a location word while preserving the same intent already covered;
- it targets Gunung Kidul or another unsupported service area;
- it implies an unsupported service, price, guarantee, delivery promise, or inventory claim;
- it has no usable evidence after source normalization;
- it cannot produce a complete ID+EN metadata contract.

## 6. Source adapter policy

Implement source adapters behind a common interface so tests use fixtures and production runs use existing read-only connectors.

Required initial adapters:

1. **GSC adapter** — page/query data and low-CTR/high-impression opportunities.
2. **GA4 adapter** — relevant landing-page and engagement signals; do not infer a topic from traffic alone without intent evidence.
3. **GBP adapter** — recent review/question/service-language signals where the connected API exposes them.
4. **Google Ads search-term adapter** — read-only search terms; never mutate campaign state.
5. **Customer-question fixture adapter** — a local JSON/Markdown input for frontliner/CS questions when APIs do not expose the signal.

Each adapter must return a normalized list and an explicit error object. Do not make the clustering layer know provider-specific field names.

Recommended normalized signal shape:

```js
{
  source: "gsc",
  text: "sewa kasur dua hari jogja",
  area: "yogyakarta",
  service: "sewa kasur",
  intent: "transactional",
  metrics: { impressions: 123, clicks: 8, position: 11.4 },
  observedAt: "2026-08-10",
  window: "last_28_days"
}
```

## 7. Implementation tasks

Each task is intentionally small and should be committed separately. Tests must be written before implementation for code-producing tasks.

### Task 1: Freeze the worker contract and config surface

**Objective:** Define the CLI flags, environment variables, statuses, and report schema before source code is added.

**Files:**
- Create: `docs/SEO/Plans/seo-topic-intelligence-worker-plan.md` (this plan)
- Create: `docs/SEO/Plans/seo-topic-intelligence-worker-report-schema.md`
- Modify: `docs/SEO/Plans/seo-article-routine-plan.md` only to link to this upstream plan, if a link is not already present.

**Required config:**

```text
SANTI_BLOG_DB_PATH
SANTI_BLOG_REPO
SANTI_TOPIC_TARGET_READY
SANTI_TOPIC_LOW_WATER_READY
SANTI_TOPIC_MAX_ACCEPT
SANTI_TOPIC_MIN_SCORE
SANTI_TOPIC_CUTOFF_DATE
SANTI_TOPIC_DRY_RUN
```

**Acceptance:** A future implementer can run `--dry-run` without credentials or live writes and can identify every output field from the report schema.

### Task 2: Add candidate schema migration tests

**Objective:** Prove a legacy SQLite schema can receive `topic_candidates` without resetting existing topics.

**Files:**
- Modify: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-refresh.mjs` or extract shared migration into a new queue module.
- Test: `ops/seo-article-pipeline/verify.mjs` or a new `ops/seo-topic-intelligence/verify.mjs`.

**Test cases:**

- fresh legacy schema gets the candidate table;
- second migration is a no-op;
- `used` topic keeps its exact `status` and `used_at`;
- unrelated rows receive no candidate metadata;
- no secret-like values appear in serialized evidence.

**Verification:**

```bash
node ops/seo-topic-intelligence/verify.mjs
```

Expected: migration and preservation assertions pass against a temporary SQLite database.

### Task 3: Create a shared queue repository

**Objective:** Centralize candidate persistence, fingerprinting, additive insertion, and `topic_log` writes so the fixed seeder and intelligence worker cannot diverge.

**Files:**
- Create: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-queue.mjs`
- Modify: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-refresh.mjs`
- Test: `ops/seo-topic-intelligence/verify.mjs`

**Functions to define:**

```text
ensureSchema(db)
canonicalFingerprint(candidate)
findDuplicate(candidate, db, inventory)
recordCandidate(candidate, decision)
acceptCandidate(candidate, db)
queueCounts(db)
```

**Acceptance:** Existing fixed topic refresh behavior remains idempotent, and accepted candidates use the same queue contract as fixed definitions.

### Task 4: Implement fixture-backed source adapters

**Objective:** Normalize all initial research sources behind one provider-neutral interface.

**Files:**
- Create: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-sources.mjs`
- Create: `ops/seo-topic-intelligence/fixtures/gsc.json`
- Create: `ops/seo-topic-intelligence/fixtures/ga4.json`
- Create: `ops/seo-topic-intelligence/fixtures/gbp.json`
- Create: `ops/seo-topic-intelligence/fixtures/google-ads-search-terms.json`
- Create: `ops/seo-topic-intelligence/fixtures/customer-questions.json`
- Test: `ops/seo-topic-intelligence/verify.mjs`

**Acceptance:** Fixture mode produces deterministic normalized signals; a malformed or unavailable source produces an explicit error record and does not abort unrelated fixture sources.

### Task 5: Implement normalization and intent clustering

**Objective:** Collapse spelling, punctuation, locale, and equivalent phrase variants into a canonical research cluster.

**Files:**
- Create or modify: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-clustering.mjs`
- Test: `ops/seo-topic-intelligence/verify.mjs`

**Required cases:**

- `jogja`, `yogyakarta`, and `kota yogyakarta` normalize consistently while preserving customer-facing copy requirements;
- `sewa kasur`, `rental kasur`, and English equivalents map to one service family;
- duration and service-area signals remain separate dimensions;
- two distinct intents are not merged merely because they share `sewa kasur`;
- unsupported area signals are marked rather than silently rewritten.

### Task 6: Implement inventory deduplication

**Objective:** Prevent candidates from duplicating existing SQLite topics or ID+EN articles.

**Files:**
- Create or modify: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-inventory.mjs`
- Test: `ops/seo-topic-intelligence/verify.mjs`

**Inventory inputs:**

- SQLite `topics` rows in all statuses;
- `topic_candidates` already accepted/rejected;
- `origin/main` blog paths;
- `origin/dev` blog paths, excluding historical backlog as promotion candidates but still using it for duplication detection.

**Acceptance:** Exact fingerprints, same-intent location swaps, and existing locale pairs are classified as duplicates with a reason code. A legitimately new intent remains eligible.

### Task 7: Implement deterministic scoring and candidate decisions

**Objective:** Convert normalized signals and inventory results into an auditable accept/reject decision.

**Files:**
- Create or modify: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-scoring.mjs`
- Test: `ops/seo-topic-intelligence/verify.mjs`

**Acceptance:**

- weighted score is reproducible for the same fixture;
- score breakdown is stored in `evidence_json`;
- low-evidence candidates are recorded as rejected, not silently dropped;
- out-of-area/unsupported-service candidates are rejected with explicit reasons;
- accepted candidates contain complete ID+EN metadata fields.

### Task 8: Build the intelligence worker CLI

**Objective:** Orchestrate source collection, clustering, deduplication, scoring, candidate audit, and additive queue insertion.

**Files:**
- Create: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-intelligence.mjs`
- Create: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-intelligence.sh`
- Test: `ops/seo-topic-intelligence/verify.mjs`

**CLI contract:**

```bash
bash santi-blog-topic-intelligence.sh --dry-run
bash santi-blog-topic-intelligence.sh --fixture-dir /path/to/fixtures --dry-run
bash santi-blog-topic-intelligence.sh --apply
```

`--dry-run` must not write `topics`, `topic_candidates`, `topic_log`, Git refs, or external APIs. `--apply` may write only the local SQLite candidate/queue tables.

**Required report:**

```text
status=ok|no_op|partial_source|blocked|failed
ready_before=
candidates_found=
clusters=
duplicates=
accepted=
rejected=
ready_after=
target_ready=
low_water_action=research|maintain|blocked
source_errors=
db=
```

### Task 9: Add low-water and idempotency integration tests

**Objective:** Prove repeated runs do not inflate the queue or mutate used topics.

**Files:**
- Modify: `ops/seo-topic-intelligence/verify.mjs`
- Modify: `ops/seo-article-pipeline/verify.mjs` only if the shared harness is intentionally extended.

**Scenarios:**

1. `ready=23`, fixture yields 12 valid candidates: accept at most 7 to target 30.
2. Same fixture run twice: second run accepts zero new rows.
3. `ready=30`: candidates are audited but queue does not grow unless above-threshold override is explicitly configured.
4. Source API error: no queue insertion and `status=blocked` report.
5. Existing `used` topic: no status/used-date change.
6. Candidate colliding with historical dev slug: reject as duplicate.

### Task 10: Integrate with the writer without changing writer cadence

**Objective:** Confirm accepted queue rows are consumed by the existing deterministic writer contract.

**Files:**
- Modify only if necessary: `/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-writer-draft.mjs`
- Test: `ops/seo-topic-intelligence/verify.mjs`

**Acceptance:**

- writer still selects `status='ready' ORDER BY id ASC LIMIT 1`;
- one-pair-per-weekday guard remains unchanged;
- dry-run does not call MCP or mutate SQLite;
- accepted candidate metadata generates valid ID+EN copy;
- no writer-side research calls are introduced.

### Task 11: Add the bounded Hermes cron in dry-run mode

**Objective:** Schedule the worker before the fixed refresh and writer, initially without queue writes.

**Files:**
- Modify via `cronjob` tool: create `Santi SEO Topic Intelligence - weekly`.
- Create/update: `docs/SEO/Plans/seo-topic-intelligence-worker-runbook.md`.

**Initial schedule:**

```text
30 6 * * 1
```

**Initial contract:**

- run with `--dry-run` for two successful weekly cycles;
- `deliver=local`;
- no publishing, deployment, indexing, GBP, or Ads mutation;
- report source coverage, candidate counts, and queue recommendation;
- stop on authentication/API errors rather than retrying indefinitely.

The fixed topic refresh remains at 08:00, and writer/publisher/merge schedules remain unchanged.

### Task 12: Promote from dry-run to additive apply after evidence review

**Objective:** Enable local queue insertion only after the dry-run reports are reviewed and the acceptance rate is trustworthy.

**Files:**
- Modify via `cronjob` tool: update the worker prompt/command from dry-run to additive apply.
- Modify: `docs/SEO/Plans/seo-topic-intelligence-worker-runbook.md`.

**Promotion gate:**

- two dry-run reports show deterministic output;
- no secret leakage;
- duplicate rate and rejected reasons are explainable;
- fixture and local verification harness pass;
- explicit approval is recorded for enabling queue insertion.

This gate authorizes SQLite topic insertion only. It does not authorize article promotion or production deployment.

### Task 13: Add monitoring and rollback procedures

**Objective:** Make queue health and worker failures visible without creating a retry loop.

**Files:**
- Modify: `docs/SEO/Plans/seo-topic-intelligence-worker-runbook.md`
- Optional: add a low-water check to the existing weekly dashboard or a separate read-only report script.

**Required alerts/report states:**

```text
HEALTHY: accepted candidates or queue remains above low-water
NO_OP: no qualifying new topics; no action required
LOW_WATER: ready queue below threshold
BLOCKED: source/auth/API failure; no writes
QUARANTINED: candidate quality or evidence failure
```

Rollback means marking candidate rows rejected/archived with an audit reason and preventing future selection. Never delete used topics, reset statuses, force-push Git, or retroactively publish a batch.

## 8. Verification commands

The implementation must pass all of the following from the repository root:

```bash
node --check /Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-queue.mjs
node --check /Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-sources.mjs
node --check /Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-clustering.mjs
node --check /Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-inventory.mjs
node --check /Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-scoring.mjs
node --check /Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-intelligence.mjs
bash -n /Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-intelligence.sh
node ops/seo-topic-intelligence/verify.mjs
node ops/seo-article-pipeline/verify.mjs
git diff --check
```

The verification harness must use temporary SQLite files and a temporary local bare Git repository. It must assert that no real remote URL is contacted and that dry-run mode leaves the real database and refs untouched.

## 9. Definition of done

This plan is complete only when:

- a weekly worker analyzes at least the configured read-only sources;
- every candidate has a stored evidence and decision record;
- duplicate and unsupported candidates are rejected with reasons;
- accepted candidates enter `topics` additively and are visible to the existing writer;
- repeated runs are idempotent;
- low-water behavior is bounded by target and maximum-accept controls;
- dry-run and failure modes leave queue, Git, and production unchanged;
- the cron is enabled only after two dry-run cycles and explicit additive-apply approval;
- the existing writer → validator → merge-preview → separately approved promotion chain remains intact;
- no secret is present in source, fixtures, logs, cron prompts, or the audit table.

## 10. Handoff and implementation order

Implement in this order:

1. Tasks 1–3: contract, migration, shared queue repository.
2. Tasks 4–7: source adapters, clustering, deduplication, and scoring.
3. Tasks 8–10: worker CLI, tests, and writer integration.
4. Task 11: dry-run cron and runbook.
5. Task 12: explicit additive-apply approval.
6. Task 13: monitoring and operational hardening.

Use an isolated worktree/branch for code tasks. Do not run AGY and Codex against the same files simultaneously. After each coding task, inspect `git diff`, run the focused test, then run the aggregate pipeline harness before integration.

No article should be promoted to production as part of implementing this plan. Production promotion remains a separate explicit approval step under `santi-blog-writer-publisher-flow`.

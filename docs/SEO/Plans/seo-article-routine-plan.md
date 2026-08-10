# Santi Living SEO Article Routine

Status: durable operating plan for draft, validation, and controlled promotion.

## Objective and guardrails

The routine produces one Indonesian and one English article for the same topic, validates the pair on the `dev` branch, and leaves promotion to a separately controlled operator step. It does not publish the existing backlog automatically.

The existing 545 dev-only drafts are explicitly quarantined. They are historical work-in-progress, are excluded by the default current-date cutoff, and must not be auto-published or silently mixed into the new routine. A later backlog review may repair, archive, or explicitly promote selected pairs after separate approval.

No routine step changes GBP, advertising, secrets, production content, Google Search Console indexing requests, or the `main` branch by default.

## Cadence and ownership

- Target cadence: one complete ID+EN pair per weekday, during a single weekday writer window. The routine is not every 30 minutes.
- Writer owner: Don Santo / Santi Living content operations. The writer selects the oldest ready queue item deterministically and drafts both locales.
- Validation owner: Santi Living content operations. The publisher script validates dev-only pairs and reports a compact gate summary; it does not promote.
- Promotion owner: an explicitly authorized operator running `merge-dev-to-main.sh` with `PUBLISH_ENABLED=1`; the default is `DRY_RUN=1`, `MAX_PAIRS=1`.
- Live verification owner: site/release operator after a separately approved promotion.
- GSC follow-up owner: SEO operator, manually after live verification. GSC submission is not part of this routine.

The writer has a runtime weekday and one-pair-per-day guard, so a legacy high-frequency trigger cannot create more than the target pair. The existing Hermes cron definitions are intentionally not changed by this scoped change; before operational cleanup, the profile owner should update the writer schedule and retire the high-frequency publisher prompt, then verify the active cron state.

## Content pillars

The queue is refreshed additively across four pillars:

1. Pricing and duration: approximate daily ranges, short stays, weekly planning, package-vs-item decisions, and questions to confirm before ordering.
2. Local rental intent: Yogyakarta City, Sleman, Bantul, Kulonprogo, and specific legitimate local needs such as homes, kos, contracts, and temporary stays.
3. Events, carpet, and permadani: family events, pengajian, office events, gatherings, room layout, and choosing carpet or rug sizes.
4. Homestay and extra-bed: guest houses, homestays, villas, family guests, and temporary capacity planning.

Generated copy must use the canonical WhatsApp number `0895-1911-9092`, workshop `Jl. Godean KM 10, Sleman, Yogyakarta`, and service focus Yogyakarta/Sleman/Bantul/Kulonprogo. Mattress rental is described as roughly Rp30.000-Rp60.000/day and complete packages roughly Rp40.000-Rp70.000/day, with current availability, final pricing, schedule, and pickup/delivery costs confirmed via WhatsApp. Copy must not claim Gunung Kidul coverage, free delivery, guaranteed stock, or unsupported delivery times. Labeled lists are used instead of Markdown pipe tables.

## Queue states and pairing

The SQLite `topics.status` states are:

- `ready`: eligible for deterministic selection.
- `used`: a complete locale pair was created or safely resolved; used rows are never reset by refresh.
- `archived`: intentionally removed from future selection with an audit reason.

`topic_log` records the transition and detail. Topic refresh uses additive `INSERT OR IGNORE`, reports before/after status counts, supports dry-run, and preserves all existing rows.

Each selected slug is a pair: exactly one `id` file and one `en` file under `apps/web-next/src/content/blog/{id,en}/`. If one locale already exists, the writer creates only the missing locale. A topic remains `ready` after any partial or unverified result. It becomes `used` only when both exact locale paths are present and the pair is safely resolved.

## Validation gates

Every candidate pair must pass all of these gates before it is eligible for promotion:

- exact locale/path and matching slug;
- complete ID+EN pair, including a counterpart already on `main` only when explicitly treated as a resolved pair;
- frontmatter title, description, tags, and ISO `pubDate`;
- matching locale dates and the current-date cutoff;
- at least 300 body words per locale;
- the WhatsApp CTA `0895-1911-9092`;
- no placeholder text, pipe-table syntax, unsupported Gunung Kidul coverage, free-delivery claim, or unsupported delivery-time claim;
- no secrets in source, fixtures, output, or generated content.

The publisher summarizes counts for the full backlog instead of printing hundreds of article records. Historical and future/mixed-date pairs remain non-eligible. Invalid current-date pairs fail closed and require repair.

## Controlled promotion and quarantine

`merge-dev-to-main.sh` first fetches refs, creates a temporary worktree, confirms that `main` is an ancestor of `dev`, finds only newly added complete locale pairs whose dates equal the cutoff, and validates every candidate before any push. It copies at most `MAX_PAIRS` selected pairs onto a temporary worktree based on the captured `main` ref, so the old dev backlog is not included in the promotion commit.

The script refuses writes unless `DRY_RUN=0` and `PUBLISH_ENABLED=1`, defaults to `MAX_PAIRS=1`, refuses invalid content or remote `main` movement, and uses a normal non-force push only. No real promotion is part of this implementation task.

## Live verification and GSC follow-up

After a separately approved promotion, verify the new ID and EN URLs from the resulting commit, inspect HTTP status and rendered metadata/body, confirm the pair is reachable and canonical, and record the commit plus URLs. Only after those checks should the SEO operator decide whether a GSC inspection/indexing request is appropriate. A GSC request is a follow-up action, never an automatic pipeline side effect.

## Rollback

Before promotion, retain the source/dev SHA, captured remote-main SHA, selected slugs, validation output, and promotion commit. If validation or remote checks fail, leave branches unchanged. If a bad approved promotion is discovered, stop subsequent promotion, identify the exact promotion commit, revert that commit with a reviewed normal commit, verify the live URLs again, and document the decision. Never force-push, rewrite history, delete the quarantined backlog, or reset used topics as a rollback shortcut.

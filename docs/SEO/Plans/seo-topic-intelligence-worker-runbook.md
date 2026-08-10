# SEO Topic Intelligence Worker Runbook

## Monitoring
The worker is monitored via `ops/seo-topic-intelligence/report_status.mjs`.
It reports 5 health states:
- HEALTHY: Queue is operational, ready topics >= low-water (15), accepted topics exist.
- NO_OP: Queue operational, ready topics >= low-water, no recent accepted topics.
- LOW_WATER: ready < 15.
- BLOCKED: SQLite error or missing DB.
- QUARANTINED: rejected ratio > 0.5.

Run:
`node ops/seo-topic-intelligence/report_status.mjs [--db PATH] [--low-water N]`

## Rollback
Rollback is performed by marking candidate rows as 'rejected' or 'archived' with an audit reason.
NEVER delete used topics.
NEVER reset statuses.
NEVER force-push Git.
NEVER retroactively publish.

## Alerting
Alert on BLOCKED or QUARANTINED states only.

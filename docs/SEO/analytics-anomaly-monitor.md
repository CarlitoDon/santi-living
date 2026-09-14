# Analytics anomaly monitor

`scripts/analytics_anomaly_monitor.py` is a read-only daily monitor for acquisition and runtime signals. It writes aggregate JSON and Markdown artifacts and keeps notification delivery in `dry_run` mode.

## Sources

- GA4: Google OAuth refresh token plus the GA4 Data API; checks `whatsapp_click`, `santi_whatsapp_qualified`, `phone_click`, `form_submit`, and `purchase`.
- Neon: authenticated `GET /api/lead/metrics`; checks persisted lead volume, qualified WhatsApp volume, geocode failures, and unknown-city events.
- Google Ads: optional Google Ads API credentials; checks clicks, conversions, and cost micros.
- Vercel: optional read-only daily JSON report configured with `VERCEL_USAGE_REPORT_URL` or `VERCEL_USAGE_REPORT_FILE`; checks ISR Writes and Fluid Active CPU.

Unavailable providers remain `unavailable`; the monitor never reports unavailable data as zero.

## Lead event contract

- `whatsapp_click` is persisted before navigation; `santi_whatsapp_qualified` and the Google Ads conversion are emitted only after Neon confirms a service-area city.
- Public tracking never trusts a client-supplied city for WhatsApp qualification: requests with coordinates use the server reverse geocoder, while missing or failed geocoding remains `unknown`. The tracked `/api/wa` redirect replay strips client city data so it cannot downgrade or create a falsely qualified row.
- Direct `/api/wa` requests without a client-generated `event_id` still redirect, but are intentionally excluded from the lead ledger so crawlers and link prefetchers cannot inflate conversion counts.
- Requests whose user-agent identifies common automation clients (`bot`, `crawler`, `spider`, headless clients, and scripted HTTP clients) are filtered before Neon persistence and delivery-quote calls. The WhatsApp redirect remains available, but these requests cannot qualify as conversions.
- `phone_click` sends the same attribution fields to GA4 and Neon, including `cta_source`, `cta_location`, `product_category`, `page_type`, and `intent` when available.
- A successful checkout emits `form_submit` in GA4 with the `event_id` returned by `/api/submit-order`; Neon stores the same ID, so the two sources can be reconciled without relying on timestamps alone.
- Microsoft Clarity receives only the funnel milestone names `whatsapp_click`, `santi_whatsapp_qualified`, `phone_click`, and `form_submit`. The client-side bridge queues events until Clarity is ready and sends no UTM values, click IDs, coordinates, phone numbers, or other lead payloads.
- Register event-scoped GA4 custom dimensions for `cta_source`, `cta_location`, `product_category`, `page_type`, and `intent`. The weekly dashboard records both the request result and whether event counts are actually populated; HTTP `200` with only `(not set)` is treated as empty, not as successful attribution. Its custom-dimension probe starts at the first complete UTC date after the `2026-09-12` rollout (`2026-09-13`), so earlier windows are reported as `not_ready` rather than empty. Until dimensions are populated, use the authenticated Neon lead metrics/export endpoints as the attribution source of truth.
- Qualified WhatsApp parity is deferred until `2026-09-13`, the first complete UTC day after the production rollout at `2026-09-12T17:09Z`; the partial rollout day and earlier history are reported as `not_ready`, not as conversion loss.
- Reverse geocoding is cached at the CDN/data-fetch layer and returns a retryable `503` for upstream Nominatim rate limits; the frontend can fall back to manual location entry without creating a runtime exception.
- The article route pre-renders a bounded set of the newest repository and Notion articles, while older known articles remain available on demand. Keep this budget bounded to avoid deployment-time ISR churn; unknown slugs are still resolved through the route and should be monitored separately from valid article traffic.
- The GBP snapshot compares the API location title with the owner-profile title and marks a conflict as a blocker; profile edits remain paused until the account/location identity is reconciled.
- Specialist subdomains are permanent aliases to the main domain. The weekly dashboard probes those aliases for redirect health, but compares canonical, Open Graph, sitemap, and indexing evidence against the corresponding `/id/...` URL on `santiliving.com`.

### Google Ads configuration

If OAuth can access more than one customer, set the intended client account explicitly:

```bash
GOOGLE_ADS_CUSTOMER_ID=1234567890
```

Set `GOOGLE_ADS_LOGIN_CUSTOMER_ID` only when the request must be made through a manager account that actually owns or links the selected client. Direct access to the selected customer should leave it unset; an invalid manager ID produces a Google Ads `403 USER_PERMISSION_DENIED` response.

## Local run

```bash
python3 scripts/analytics_anomaly_monitor.py \
  --env-file /Users/wecik/.hermes/profiles/don-santo/.env.mcp \
  --output-dir /tmp/santi-analytics-anomaly
```

The existing Hermes-friendly wrapper is `scripts/run_analytics_anomaly_monitor.sh`. It does not send notifications, change campaigns, modify budgets, deploy code, or mutate the database.

## Scheduled GitHub Actions run

`.github/workflows/analytics-anomaly-monitor.yml` runs daily at `02:17 UTC` (`09:17` WIB), and can also be started manually. Each run publishes the JSON/Markdown snapshot as a 30-day artifact and keeps the alert fingerprint state in a GitHub Actions cache so repeated observations are not treated as new alerts.

Configure these repository secrets for the corresponding source to become available:

- `GBP_CLIENT_ID`, `GBP_CLIENT_SECRET`, and `GBP_REFRESH_TOKEN` for the Google OAuth refresh flow used by GA4 and Google Ads.
- `LEAD_EVENTS_ADMIN_TOKEN` for the authenticated production Neon metrics endpoint.
- `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID`, and optional `GOOGLE_ADS_LOGIN_CUSTOMER_ID` for Google Ads.
- Optional `VERCEL_USAGE_REPORT_URL` and `VERCEL_USAGE_TOKEN` for a read-only daily Vercel usage report. The monitor leaves Vercel `unavailable` when no report source is configured.

The workflow never writes to GA4, Google Ads, Neon, or Vercel. Missing credentials are reported as unavailable rather than interpreted as zero.

The weekly dashboard also reports offline-conversion readiness for qualified WhatsApp rows using aggregate click-ID presence (`gclid`, `gbraid`, and `wbraid`) only. It never stores the identifiers, coordinates, or customer-level rows in the report and never uploads conversions; `candidate_data_present` still requires business mapping and explicit Ads authorization.

## Vercel report shape

The configured Vercel source must return either a JSON array or an object with a `daily` array. Each row needs `date` plus one or both of:

```json
{
  "date": "2026-09-11",
  "isr_writes": 123,
  "fluid_active_cpu_ms": 456789
}
```

## Alert logic

The target is yesterday UTC by default. For dates before the `2026-09-13` tracking-filter rollout, the baseline is the trailing 28 days, preferring matching weekdays when at least three observations exist. From `2026-09-13` onward, only post-rollout observations may enter the baseline; until three valid observations exist, the result is `insufficient_history` rather than a false alert caused by pre-filter bot traffic. Missing provider dates stay `not_ready` rather than being inferred as zero; the report exposes expected/observed coverage. A minimum-volume guard, robust median/MAD or IQR scale, and alert-state fingerprint prevent low-volume noise and duplicate notifications.

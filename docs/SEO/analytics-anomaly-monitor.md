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
- Direct `/api/wa` requests without a client-generated `event_id` still redirect, but are intentionally excluded from the lead ledger so crawlers and link prefetchers cannot inflate conversion counts.
- `phone_click` sends the same attribution fields to GA4 and Neon, including `cta_source`, `cta_location`, `product_category`, `page_type`, and `intent` when available.
- A successful checkout emits `form_submit` in GA4 with the `event_id` returned by `/api/submit-order`; Neon stores the same ID, so the two sources can be reconciled without relying on timestamps alone.
- Register event-scoped GA4 custom dimensions for `cta_source`, `cta_location`, `product_category`, `page_type`, and `intent`. Until they are queryable, use the authenticated Neon lead metrics/export endpoints as the attribution source of truth.

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

The target is yesterday UTC by default. The baseline is the trailing 28 days, preferring matching weekdays when at least three observations exist. A minimum-volume guard, robust median/MAD or IQR scale, and alert-state fingerprint prevent low-volume noise and duplicate notifications.

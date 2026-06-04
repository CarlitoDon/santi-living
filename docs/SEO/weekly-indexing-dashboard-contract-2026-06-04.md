# Weekly indexing, rank tracking, and dashboard contract — Santi Living

Generated: 2026-06-04 12:20 WIB
Scope: Implementasi Massive SEO Plan sections 9, 11, and 12.
Reference: `/Users/wecik/.hermes/kanban/references/implementasi-massive-seo-plan-2026-06-04/massive-seo-plan-fixed.pdf`

## DONE

### 1. GSC property and OAuth source verified

- Operational GSC property: `sc-domain:santiliving.com`.
- API access verified with owner permission via Search Console API.
- OAuth scopes available for this setup: Search Console, URL Indexing, GA4 readonly, GBP business management, and Google Ads.
- Primary setup artifact: `docs/SEO/Reports/seo-indexing-dashboard-setup-2026-06-04.json`.

### 2. Exact sitemap submissions completed

Submitted through Search Console Sitemaps API (`webmasters.v3.sitemaps.submit`) against `sc-domain:santiliving.com`.

| Sitemap | Purpose | API status | Current GSC state after submit |
| --- | --- | ---: | --- |
| `https://santiliving.com/sitemap.xml` | Master sitemap index from robots | `204` | Downloaded, `errors=0`, `warnings=0` |
| `https://santiliving.com/sitemap-0.xml` | Master URL-set, contains all generated URLs | `204` | Downloaded, `errors=0`, `warnings=0`, 189 submitted URLs |
| `https://karpet.santiliving.com/sitemap-0.xml` | Host-fetchable URL-set for karpet tracking | `204` | Pending after fresh submit, `errors=0`, `warnings=0` |
| `https://permadani.santiliving.com/sitemap-0.xml` | Host-fetchable URL-set for permadani tracking | `204` | Pending after fresh submit, `errors=0`, `warnings=0` |
| `https://acara.santiliving.com/sitemap-0.xml` | Host-fetchable URL-set for acara tracking | `204` | Pending after fresh submit, `errors=0`, `warnings=0` |

Operational note: the public `*/sitemap.xml` endpoint is a shared sitemap index in this single Vercel app. For host-level GSC submissions this setup uses the non-recursive `*/sitemap-0.xml` URL-set, while keeping `https://santiliving.com/sitemap.xml` as the master index declared in robots.

### 3. Money-page indexing notifications submitted

Submitted through Google Indexing API (`indexing.v3.urlNotifications.publish`) as `URL_UPDATED`.

| Cluster | Canonical money URL | API status | Metadata URL returned |
| --- | --- | ---: | --- |
| Karpet | `https://karpet.santiliving.com/sewa-karpet-jogja` | `200` | same URL |
| Permadani | `https://permadani.santiliving.com/sewa-karpet-permadani-jogja` | `200` | same URL |
| Acara | `https://acara.santiliving.com/sewa-perlengkapan-event` | `200` | same URL |

Do not report these as indexed yet. The correct status is: submitted to Google for recrawl/update.

### 4. URL Inspection baseline captured

Read-back used Search Console URL Inspection API (`urlInspection.index.inspect`).

| URL | Inspection kind | Current GSC coverage state | Google canonical |
| --- | --- | --- | --- |
| `https://karpet.santiliving.com/sewa-karpet-jogja` | canonical money page | `Ditemukan - saat ini tidak diindeks` | n/a |
| `https://permadani.santiliving.com/sewa-karpet-permadani-jogja` | canonical money page | `Ditemukan - saat ini tidak diindeks` | n/a |
| `https://acara.santiliving.com/sewa-perlengkapan-event` | canonical money page | `Ditemukan - saat ini tidak diindeks` | n/a |
| `https://karpet.santiliving.com/` | root entry probe | `URL tidak dikenali oleh Google` | n/a |
| `https://permadani.santiliving.com/` | root entry probe | `URL tidak dikenali oleh Google` | n/a |
| `https://acara.santiliving.com/` | root entry probe | `Halaman alternatif dengan tag kanonis yang tepat` | `https://santiliving.com/` |

Interpretation: the three canonical money pages have been discovered but are not indexed yet. Root-entry probes are intentionally monitored separately because the public root subdomains rewrite to canonical paths.

### 5. Live technical and CTA tracking verification completed

Live HTTP checks completed for the three money pages.

| Host | URL | HTTP | Matched path | Canonical | `og:url` | Required CTA source |
| --- | --- | ---: | --- | --- | --- | --- |
| `karpet.santiliving.com` | `/sewa-karpet-jogja` | `200` | `/sewa-karpet-jogja` | exact host/path | exact host/path | `sewa_karpet_jogja_page` present in rendered HTML |
| `permadani.santiliving.com` | `/sewa-karpet-permadani-jogja` | `200` | `/sewa-karpet-permadani-jogja` | exact host/path | exact host/path | `permadani_page` present in rendered HTML |
| `acara.santiliving.com` | `/sewa-perlengkapan-event` | `200` | `/sewa-perlengkapan-event` | exact host/path | exact host/path | `acara_santiliving_page` present in rendered HTML |

Code evidence:

- `apps/web-next/src/components/landing/LandingPage.tsx` renders `data-wa-source`, `data-wa-location`, `data-product-category`, `data-page-type`, and `data-wa-intent` on hero/landing WhatsApp CTAs.
- `apps/web-next/src/components/tracking/GtagScript.tsx` sends GA4 `whatsapp_click` event params: `cta_source`, `cta_location`, `product_category`, `page_type`, `intent`, `page_location`, and attribution fields.
- `apps/web-next/src/components/tracking/GtagScript.tsx` also enriches `/api/wa` and `/api/lead/track` payloads with the same `cta_source` contract.
- `apps/web-next/src/lib/lead-db.ts` stores `cta_source`, `cta_location`, `product_category`, `page_type`, `intent`, `landing_page`, city classification, and attribution fields in `lead_events` when `DATABASE_URL` is configured.

Decision: no additional website code decision is needed for `cta_source`; the website implementation is present and live. The remaining reporting gap is GA4 admin/custom-dimension configuration, not page code.

### 6. Weekly dashboard script and cron loop added

Repo script added:

```bash
python3 scripts/seo_weekly_dashboard.py --env-file /Users/wecik/.hermes/profiles/don-santo/.env.mcp --output-dir docs/SEO/Reports/weekly
```

Cron wrapper added under the active Don Santo profile:

- `/Users/wecik/.hermes/profiles/don-santo/scripts/run-santi-seo-weekly-dashboard.sh`
- Cron job: `97ff908c2a7b` — `Santi Weekly SEO Indexing Dashboard`
- Schedule: every Monday 09:00 Asia/Jakarta (`0 9 * * 1`)
- Delivery: `telegram:8215203590`
- Next run: 2026-06-08 09:00 WIB

The cron wrapper writes recurring report artifacts outside the git repo to avoid dirtying `main` every week:

- `/Users/wecik/.hermes/profiles/don-santo/reports/santi-living/seo-weekly/`

Manual setup artifacts generated in this repo:

- JSON snapshot: `docs/SEO/Reports/weekly/seo-weekly-dashboard-2026-06-04.json`
- Markdown snapshot: `docs/SEO/Reports/weekly/seo-weekly-dashboard-2026-06-04.md`

The script is read-only by default and covers:

- live HTTP/canonical/CTA/sitemap evidence,
- GSC sitemap list,
- GSC Search Analytics rank/query rows grouped into karpet, permadani, and acara clusters,
- URL Inspection canonical/indexing state for canonical money pages and root entry probes,
- GA4 landing-page sessions and WhatsApp event aggregates with query identifiers redacted to path-level URLs,
- GBP location/review/post aggregate coverage without reviewer names/comments,
- supporting blog-content inventory by cluster.

Controlled write flags exist only for launch/update days and should not be used in the weekly read-only run unless there was a real technical/content change:

```bash
python3 scripts/seo_weekly_dashboard.py --submit-sitemaps --submit-indexing
```

## Weekly dashboard contract

### A. GSC / rank tracking

Window: rolling last 28 complete days (`28daysAgo` through `yesterday`).

Dimensions:

- `query`
- `page`

Metrics:

- clicks,
- impressions,
- CTR,
- average position weighted by impressions,
- top queries per cluster.

Clusters:

| Cluster | Query examples | Canonical page |
| --- | --- | --- |
| Permadani | `sewa permadani jogja`, `sewa karpet permadani jogja`, `karpet pengajian jogja`, `karpet tahlilan jogja`, `permadani tamu jogja` | `https://permadani.santiliving.com/sewa-karpet-permadani-jogja` |
| Karpet | `sewa karpet jogja`, `rental karpet jogja`, `sewa karpet acara jogja`, `sewa karpet pameran jogja`, `sewa karpet merah jogja` | `https://karpet.santiliving.com/sewa-karpet-jogja` |
| Acara | `sewa perlengkapan event jogja`, `sewa perlengkapan acara jogja`, `sewa alat event jogja`, `sewa perlengkapan EO jogja`, `sewa rest area event jogja` | `https://acara.santiliving.com/sewa-perlengkapan-event` |

### B. Indexing and canonical chosen

Track every week:

- GSC sitemap errors/warnings for the five submitted sitemap URLs.
- URL Inspection coverage state for all three canonical money pages.
- URL Inspection coverage state for root-entry probes: `karpet/`, `permadani/`, `acara/`.
- `googleCanonical` and `userCanonical` where GSC exposes them.
- Last crawl time and page fetch state when available.

Status labels:

- `submitted`: sitemap/API notification accepted but not indexed yet.
- `indexed/recognized`: GSC reports indexed or Google-selected canonical matches intended canonical.
- `not_found_yet`: URL not recognized or discovered but not indexed.
- `canonical_mismatch`: Google canonical differs from intended canonical after propagation window.
- `technical_blocker`: HTTP, robots, noindex, canonical, sitemap, or fetch error found.

### C. GA4 and lead attribution

GA4 property: `properties/519253158`.

Required weekly metrics:

- sessions and engaged sessions by `landingPagePlusQueryString` and `sessionSourceMedium`, redacted to path-level when exported,
- `whatsapp_click` event count by page path and channel,
- phone clicks if present,
- WA click rate = `whatsapp_click / landing page sessions`,
- out-of-service city review from `/api/lead/export` or MCP if admin token/source is available.

`cta_source` contract:

| Host | Required cta_source | Product category | Page type | Intent |
| --- | --- | --- | --- | --- |
| `permadani.santiliving.com` | `permadani_page` | `karpet` | `subcategory_page` | `sewa_karpet_permadani` |
| `karpet.santiliving.com` | `sewa_karpet_jogja_page` | `karpet` | `money_page` | `sewa_karpet_jogja` |
| `acara.santiliving.com` | `acara_santiliving_page` | `event` | `money_page` | `sewa_perlengkapan_event_jogja` |

Current GA4 reporting gap: Data API returned `400` for `customEvent:cta_source`, meaning `cta_source` is not registered/queryable as a GA4 custom dimension yet. Until GA4 Admin write access or manual GA4 admin setup is completed, use `/api/lead/export`/lead DB as the `cta_source` source of truth, and use GA4 page-path/event counts as a fallback.

### D. Content and internal linking

Track weekly:

- money pages changed this week,
- supporting blog articles published/updated by cluster,
- internal donor links pointing to the three canonical money pages,
- sitemap inclusion for new content,
- GSC impressions/clicks by content URL when data starts appearing.

### E. GBP coverage

Track weekly with GBP API/MCP/direct API:

- location title/website/phone sanity check,
- latest posts count and live status,
- post coverage for permadani, karpet acara, and paket event,
- review count returned and reply coverage,
- Q&A/photo coverage when available from GBP tooling,
- gaps requiring manual GBP UI if API surface does not expose a field.

Latest direct API aggregate snapshot from the weekly script:

- Reviews returned: 50; without reply: 0.
- Local posts returned: 100; live: 100.
- Latest post activity observed on 2026-06-04 UTC.

## Repeatable weekly checklist

1. Run the weekly script from repo root:

   ```bash
   cd /Users/wecik/Documents/Offline/Professional/Coding/santi-living
   python3 scripts/seo_weekly_dashboard.py --env-file /Users/wecik/.hermes/profiles/don-santo/.env.mcp --output-dir docs/SEO/Reports/weekly
   ```

2. Open the generated markdown and JSON under `docs/SEO/Reports/weekly/`.
3. Check `PENDING` and `BLOCKED` sections in the markdown snapshot.
4. If a page still reports `Ditemukan - saat ini tidak diindeks`, do not resubmit repeatedly unless content/technical state changed; inspect canonical, sitemap, internal links, and crawl state first.
5. If `googleCanonical` mismatches intended canonical after H+3/H+7, create a technical SEO fix task instead of hiding it in the dashboard.
6. Compare GSC cluster impressions/clicks against the previous weekly snapshot.
7. Compare GA4 sessions and WhatsApp clicks by landing page/channel.
8. Compare GBP review/post coverage and prepare at most one relevant follow-up GBP post when a cluster needs reinforcement.
9. Keep customer-facing copy safe: no final stock/price overclaim, no `se-DIY` if Gunungkidul is excluded, and use `cek ketersediaan via WA` language.
10. Commit only the weekly snapshot/report if it contains durable decisions; do not commit raw secrets, tokens, cookies, reviewer PII, or raw click IDs.

## Manual Search Console fallback actions

Use this only if API access fails.

1. Open property overview: `https://search.google.com/search-console?authuser=1&resource_id=sc-domain%3Asantiliving.com`.
2. Submit/read these sitemaps:
   - `https://santiliving.com/sitemap.xml`
   - `https://santiliving.com/sitemap-0.xml`
   - `https://karpet.santiliving.com/sitemap-0.xml`
   - `https://permadani.santiliving.com/sitemap-0.xml`
   - `https://acara.santiliving.com/sitemap-0.xml`
3. Inspect canonical money pages:
   - `https://karpet.santiliving.com/sewa-karpet-jogja`
   - `https://permadani.santiliving.com/sewa-karpet-permadani-jogja`
   - `https://acara.santiliving.com/sewa-perlengkapan-event`
4. Inspect root-entry probes:
   - `https://karpet.santiliving.com/`
   - `https://permadani.santiliving.com/`
   - `https://acara.santiliving.com/`
5. Record coverage state, Google-selected canonical, last crawl time, and whether request indexing confirmation was shown.

## PENDING

- GSC currently reports all three canonical money pages as `Ditemukan - saat ini tidak diindeks`. This is expected immediately after submission and must be checked at H+3/H+7.
- `https://karpet.santiliving.com/` and `https://permadani.santiliving.com/` root probes are still `URL tidak dikenali oleh Google`.
- `https://acara.santiliving.com/` root probe still shows stale Google/user canonical `https://santiliving.com/`; monitor after Google recrawls the new exact-host canonical path.
- Host sitemap URL-sets submitted on subdomains are currently pending in GSC; re-check after Google downloads them.

## BLOCKED

- GA4 `customEvent:cta_source` is not queryable via GA4 Data API yet. Required next action: register event-scoped GA4 custom dimensions for `cta_source`, `cta_location`, `product_category`, `page_type`, and `intent`, or use `/api/lead/export` as the canonical cta_source report source until GA4 Admin write access is available.

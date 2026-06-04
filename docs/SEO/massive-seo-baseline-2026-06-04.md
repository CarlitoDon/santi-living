# Massive SEO baseline tracking and evidence — 2026-06-04

Generated: 2026-06-04 11:09:01 WIB
Reference: `/Users/wecik/.hermes/kanban/references/implementasi-massive-seo-plan-2026-06-04/massive-seo-plan-fixed.pdf`, sections 1, 12, and 13.
Scope: `permadani.santiliving.com`, `karpet.santiliving.com`, `acara.santiliving.com`.

## Live evidence snapshot before implementation changes

Command family used:

```bash
python3 - <<'PY'
# urllib fetch of each host root, title, canonical, robots meta, JSON-LD @type, robots.txt, sitemap.xml, sitemap-0.xml
PY
```

### permadani.santiliving.com

- Probe URL: `https://permadani.santiliving.com/`
- HTTP: `200`, server `Vercel`
- Matched path: `/sewa-karpet-permadani-jogja`
- Title: `Sewa Karpet Permadani Jogja untuk Pengajian & Tamu | Santi Living`
- H1: `Sewa Karpet Permadani Jogja`
- Robots meta: `index, follow`
- Canonical: `https://karpet.santiliving.com/sewa-karpet-permadani-jogja`
- Schema types: `WebSite`, `Organization`, `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`
- Sitemap evidence: canonical URL `https://karpet.santiliving.com/sewa-karpet-permadani-jogja` appears in `https://santiliving.com/sitemap-0.xml` and in the same sitemap served from subdomain `/sitemap-0.xml`.
- Gap: root URL `https://permadani.santiliving.com/` is not listed as a sitemap loc; robots.txt does not expose a permadani-specific sitemap. This is acceptable only if canonical strategy intentionally consolidates permadani to the karpet path; otherwise this is a P0 canonical/sitemap decision.

### karpet.santiliving.com

- Probe URL: `https://karpet.santiliving.com/`
- HTTP: `200`, server `Vercel`
- Matched path: `/sewa-karpet-jogja`
- Title: `Sewa Karpet Jogja untuk Acara, Hajatan & Event | Santi Living`
- H1: `Sewa Karpet Jogja`
- Robots meta: `index, follow`
- Canonical: `https://karpet.santiliving.com/sewa-karpet-jogja`
- Schema types: `WebSite`, `Organization`, `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`
- Sitemap evidence: canonical URL `https://karpet.santiliving.com/sewa-karpet-jogja` and root URL `https://karpet.santiliving.com/` appear in `https://santiliving.com/sitemap-0.xml` and in the same sitemap served from subdomain `/sitemap-0.xml`.
- Gap: `https://karpet.santiliving.com/sitemap.xml` currently resolves to the generic sitemap index pointing at `https://santiliving.com/sitemap-0.xml`, not a dedicated karpet-only sitemap index.

### acara.santiliving.com

- Probe URL: `https://acara.santiliving.com/`
- HTTP: `200`, server `Vercel`
- Matched path: `/sewa-perlengkapan-event`
- Title: `Sewa Perlengkapan Event & EO Jogja | Santi Living | Santi Living`
- H1: `Sewa Perlengkapan Event & EO Jogja`
- Robots meta: `index, follow`
- Canonical: `https://santiliving.com/sewa-perlengkapan-event`
- Schema types: `WebSite`, `Organization`, `LocalBusiness`
- Sitemap evidence: canonical URL `https://santiliving.com/sewa-perlengkapan-event` appears in `https://santiliving.com/sitemap-0.xml` and in the same sitemap served from subdomain `/sitemap-0.xml`.
- Gap: root URL `https://acara.santiliving.com/` is not listed as a sitemap loc; robots.txt does not expose an acara-specific sitemap. Acara also lacks `Service`, `FAQPage`, and `BreadcrumbList` schema parity.

## GSC property and submission plan

Primary property:

- Use/verify `sc-domain:santiliving.com` as the master property because it covers the apex and subdomains.
- Submit/read sitemap: `https://santiliving.com/sitemap.xml`.
- URL Inspection targets for weekly evidence:
  - `https://karpet.santiliving.com/sewa-karpet-jogja`
  - `https://karpet.santiliving.com/sewa-karpet-permadani-jogja`
  - `https://santiliving.com/sewa-perlengkapan-event`
  - root entry probes: `https://karpet.santiliving.com/`, `https://permadani.santiliving.com/`, `https://acara.santiliving.com/` to confirm Google-selected canonical.

Optional URL-prefix properties for cleaner host reports:

- `https://karpet.santiliving.com/`
- `https://permadani.santiliving.com/`
- `https://acara.santiliving.com/`

Before treating URL-prefix properties as operationally complete, fix or explicitly accept the sitemap behavior:

- `karpet.santiliving.com/sitemap.xml`, `permadani.santiliving.com/sitemap.xml`, and `acara.santiliving.com/sitemap.xml` currently serve the generic sitemap index; they do not expose host-only indexes.
- If host-specific GSC dashboards are required, create explicit host sitemap outputs or keep dashboard segmentation by page host inside the domain property.

Query clusters to track in GSC:

- Permadani: `sewa permadani jogja`, `sewa karpet permadani jogja`, `karpet pengajian jogja`, `karpet tahlilan jogja`, `permadani tamu jogja`.
- Karpet: `sewa karpet jogja`, `rental karpet jogja`, `sewa karpet acara jogja`, `sewa karpet pameran jogja`, `sewa karpet merah jogja`.
- Acara: `sewa perlengkapan event jogja`, `sewa perlengkapan acara jogja`, `sewa alat event jogja`, `sewa perlengkapan EO jogja`, `sewa rest area event jogja`.

## GA4 / lead cta_source contract

Canonical GA4 event name for WhatsApp intent: `whatsapp_click`.

Minimum dimensions that must be present on the event and the `/api/wa` redirect log:

- `cta_source`
- `cta_location`
- `product_category`
- `page_type`
- `intent`
- `landing_page`
- `page_location`
- attribution fields: `source`, `medium`, `campaign`, `gclid`, `gbraid`, `wbraid`, `fbclid`
- location fields where consent exists: `location_permission`, `city`

Stable money-page `cta_source` values:

| Host | Landing route | Required `cta_source` | Expected dimensions |
| --- | --- | --- | --- |
| `permadani.santiliving.com` | `/sewa-karpet-permadani-jogja` | `permadani_page` | `product_category=karpet`, `page_type=subcategory_page`, `intent=sewa_karpet_permadani` |
| `karpet.santiliving.com` | `/sewa-karpet-jogja` | `sewa_karpet_jogja_page` | `product_category=karpet`, `page_type=money_page`, `intent=sewa_karpet_jogja` |
| `acara.santiliving.com` | `/sewa-perlengkapan-event` | `acara_santiliving_page` | `product_category=event`, `page_type=money_page`, `intent=sewa_perlengkapan_event_jogja` |

Implementation note:

- `apps/web-next/src/components/landing/LandingPage.tsx` renders `data-wa-source`, `data-product-category`, `data-page-type`, and `data-wa-intent` on hero/landing WhatsApp CTAs.
- `apps/web-next/src/components/tracking/GtagScript.tsx` emits GA4 `whatsapp_click` and enriches `/api/wa` query params with the same fields.
- This baseline updated permadani CTAs from the legacy `sewa_karpet_permadani_page` to the measurement contract value `permadani_page` and added acara tracking dimensions for `event` money-page filtering.

## Weekly dashboard shape

### GSC

Group by host and query cluster:

- clicks
- impressions
- CTR
- average position
- top landing URL
- Google-selected canonical status when available from URL Inspection

### GA4 / lead events

Group by `cta_source`, `landing_page`, and channel:

- sessions by landing page
- engaged sessions / engagement rate
- `whatsapp_click` count
- phone clicks if available
- WA click rate = `whatsapp_click / landing page sessions`
- city/location_permission breakdown for out-of-service lead review

### Indexing

Track each money page/root entry as:

- live HTTP status
- submitted to GSC/Indexing API
- indexed/recognized
- Google-selected canonical
- sitemap loc source

### Content and local authority

- money pages updated
- supporting URLs published/updated
- internal donor links added
- GBP posts/photos/Q&A/review coverage

## Implemented in this change

- Added a durable baseline note for live evidence, GSC property/submission plan, GA4/lead `cta_source` contract, and weekly dashboard shape.
- Normalized permadani money-page CTA source from `sewa_karpet_permadani_page` to `permadani_page`.
- Added acara tracking dimensions: `product_category=event`, `page_type=money_page`, `intent=sewa_perlengkapan_event_jogja`.
- Added host-aware global CTA copy so karpet/permadani/acara journeys no longer inherit the default kasur WhatsApp text in header, mobile nav, and sticky CTA.
- Removed global preload for `/images/stok-kasur.webp` so non-kasur hosts do not prioritize a kasur visual asset.
- Added contextual secondary CTA labels/targets for karpet, permadani, and acara landing CTAs.
- Regenerated `sitemap.xml` so the host sitemap declarations from `next-sitemap.config.js` are reflected in the tracked public sitemap index.
- Updated sitemap routing so `/sewa-karpet-jogja`, `/sewa-karpet-merah-jogja`, `/sewa-karpet-permadani-jogja`, and `/sewa-perlengkapan-event` emit their intended host URLs.
- Moved permadani metadata/schema/breadcrumb canonical generation to `https://permadani.santiliving.com/sewa-karpet-permadani-jogja`.
- Added acara metadata/schema parity: exact-host canonical, `Service`, `FAQPage`, and `BreadcrumbList` JSON-LD.
- Cleaned acara public copy to remove duplicate brand title, `terlengkap`, fixed-price certainty for consultative items, and “se-DIY” overclaim.

## Current baseline risks to hand to follow-up tasks

- Root subdomain entry URLs (`https://permadani.santiliving.com/`, `https://acara.santiliving.com/`) still rewrite to canonical paths; weekly GSC inspection must confirm Google-selected canonical matches the intended path.
- Host-specific sitemap files are produced from one shared Next/Vercel app; verify after deploy that robots and sitemap responses expose karpet, permadani, and acara URLs as intended.
- Global header/sticky WA CTAs now use host-aware copy, but their `cta_source` remains positional (`header_desktop`, `header_mobile`, `sticky_button`). Segment global CTA clicks by `landing_page`, `intent`, and host in addition to `cta_source`.

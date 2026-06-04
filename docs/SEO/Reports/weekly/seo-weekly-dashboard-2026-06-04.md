# Santi Living Weekly SEO Dashboard Snapshot

Generated UTC: `2026-06-04T05:24:18.318254+00:00`
Window: `2026-05-07` to `2026-06-03`
GSC property: `sc-domain:santiliving.com`

## DONE
- Live technical checks executed for karpet, permadani, and acara money pages.
- GSC sitemap list, Search Analytics, and URL Inspection API checks executed when OAuth succeeded.
- GA4 landing/session and WhatsApp event aggregates queried when OAuth succeeded.
- GBP location/review/post coverage queried without storing reviewer names or comments.

## GSC query clusters
- karpet: clicks=0, impressions=0, ctr=0.00%, avg_position=n/a
- permadani: clicks=0, impressions=0, ctr=0.00%, avg_position=n/a
- acara: clicks=0, impressions=0, ctr=0.00%, avg_position=n/a

## Indexing and canonical
- karpet canonical_money_page: `https://karpet.santiliving.com/sewa-karpet-jogja` -> Ditemukan - saat ini tidak diindeks; googleCanonical=n/a
- permadani canonical_money_page: `https://permadani.santiliving.com/sewa-karpet-permadani-jogja` -> Ditemukan - saat ini tidak diindeks; googleCanonical=n/a
- acara canonical_money_page: `https://acara.santiliving.com/sewa-perlengkapan-event` -> Ditemukan - saat ini tidak diindeks; googleCanonical=n/a
- karpet root_entry_probe: `https://karpet.santiliving.com/` -> URL tidak dikenali oleh Google; googleCanonical=n/a
- permadani root_entry_probe: `https://permadani.santiliving.com/` -> URL tidak dikenali oleh Google; googleCanonical=n/a
- acara root_entry_probe: `https://acara.santiliving.com/` -> Halaman alternatif dengan tag kanonis yang tepat; googleCanonical=https://santiliving.com/

## GA4 and lead attribution
- GA4 custom dimension probe for `customEvent:cta_source`: ok=False status=400
- GA4 page URLs in this markdown are redacted to path only; full JSON also avoids raw gclid/gbraid/wbraid values.

## GBP coverage
- Reviews returned: 50; without reply: 0
- Local posts returned: 100; live: 100

## PENDING
- `https://karpet.santiliving.com/sewa-karpet-jogja` still reports `Ditemukan - saat ini tidak diindeks`
- `https://permadani.santiliving.com/sewa-karpet-permadani-jogja` still reports `Ditemukan - saat ini tidak diindeks`
- `https://acara.santiliving.com/sewa-perlengkapan-event` still reports `Ditemukan - saat ini tidak diindeks`
- `https://karpet.santiliving.com/` still reports `URL tidak dikenali oleh Google`
- `https://permadani.santiliving.com/` still reports `URL tidak dikenali oleh Google`

## BLOCKED
- GA4 `customEvent:cta_source` is not queryable yet; register event-scoped custom dimensions for cta_source, cta_location, product_category, page_type, and intent, or use `/api/lead/export` as the cta_source source of truth.


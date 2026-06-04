# Santi Living Site Architecture, Internal Links, and URL Governance

Source: Massive SEO Plan PDF sections 7 and 9 (`massive-seo-plan-fixed.pdf`).
Last implemented: 2026-06-04.

## Pillar and Money Page Map

| Cluster | Preferred URL | Host role | Primary intent | Safe copy boundary |
| --- | --- | --- | --- | --- |
| Karpet pillar | `https://karpet.santiliving.com/sewa-karpet-jogja` | Pillar and money page | Payung besar sewa karpet Jogja: pernikahan, seminar, pameran, booth, hajatan, pengajian, paket karpet acara | Jangan mengaburkan runner, permadani, dan paket event. Arahkan user memilih jenis karpet dulu. |
| Permadani | `https://permadani.santiliving.com/sewa-karpet-permadani-jogja` | Money page | Permadani merah/emas untuk pengajian, tahlilan, syukuran, tamu keluarga, ruang tamu sementara, dan lesehan | Bukan runner/jalur tamu. Jangan klaim semua motif ready. |
| Perlengkapan event | `https://acara.santiliving.com/sewa-perlengkapan-event` | Money page | Bundle konsultatif perlengkapan event: kasur rest area, pendingin, TV, karpet by request, item panitia by request | Jangan klaim semua alat acara ready/terlengkap. Pisahkan item inti vs by-request. |
| Karpet merah | `https://karpet.santiliving.com/sewa-karpet-merah-jogja` | Money page sub-intent | Karpet merah/permadani merah untuk jalur tamu atau kebutuhan merah yang perlu diklarifikasi | Jika yang dimaksud alas lesehan motif, arahkan ke permadani; jika bundle banyak item, arahkan ke acara. |

## Content Cluster Intent Map

| Intent group | Example queries | Primary target | Sibling links |
| --- | --- | --- | --- |
| Harga | harga sewa karpet jogja 2026, harga sewa permadani jogja, biaya sewa karpet pengajian, paket perlengkapan acara jogja | Karpet pillar for karpet pricing; event page for bundle estimates | Permadani, karpet merah, event bundle, pricing article |
| Acara | sewa karpet pengajian, sewa karpet tahlilan, sewa karpet pernikahan, sewa karpet seminar, sewa perlengkapan event kampus | Choose by event type: permadani for pengajian/tahlilan, karpet merah for ceremony, acara for multi-item event | Karpet pillar and relevant blog sibling |
| Lokasi | sewa karpet Sleman, Godean, Bantul, Depok Jogja, perlengkapan event Kota Jogja | Main money page + local Santi Living route article as supporting evidence | Local service articles; keep address at Jl. Godean KM 10, Sleman, Yogyakarta |
| Problem | cara hitung luas karpet acara, berapa karpet untuk 50 tamu lesehan, karpet merah vs permadani, checklist perlengkapan pengajian rumah | Problem article -> appropriate money page | Sibling explainer article + WA/service page |

## Internal Linking Rule

Every new article in the karpet/permadani/event cluster must include these three outbound internal link types where natural:

1. One link to the preferred money page for the article's dominant intent.
2. One link to a sibling article that answers a supporting question.
3. One link to the relevant product/CTA page or WhatsApp flow when the reader is ready to request availability.

Every money page must keep at least six donor links from relevant articles. Donor links should use natural anchors and the canonical host URL, not same-path main-domain duplicates.

## Current Donor Link Matrix

Implemented donor links as of this update:

| Money page | Minimum required | Current article donors | Status |
| --- | ---: | ---: | --- |
| `https://karpet.santiliving.com/sewa-karpet-jogja` | 6 | 18 | Met |
| `https://permadani.santiliving.com/sewa-karpet-permadani-jogja` | 6 | 11 | Met |
| `https://acara.santiliving.com/sewa-perlengkapan-event` | 6 | 10 | Met |
| `https://karpet.santiliving.com/sewa-karpet-merah-jogja` | 6 | 6 | Met |

## URL and Canonical Governance

- Canonical URLs for money pages must use the preferred host above.
- Blog donor links should link to canonical host URLs directly.
- Avoid publishing the same money page as a main-domain canonical duplicate.
- Root subdomain entry points may rewrite to the canonical route path, but canonical, OG URL, schema URL, and sitemap loc must agree with the preferred host.
- The workshop address must remain `Jl. Godean KM 10, Sleman, Yogyakarta`.
- Area language must stay safe: Sleman, Kota Yogyakarta, Bantul, Kulon Progo/Godean priority; area jauh konfirmasi dulu; Gunungkidul not promised.

## Sitemap Host Governance

- `apps/web-next/next-sitemap.config.js` maps money-page route paths to preferred subdomain hosts.
- `robots.txt` must advertise all relevant sitemap indexes:
  - `https://santiliving.com/sitemap.xml`
  - `https://karpet.santiliving.com/sitemap.xml`
  - `https://permadani.santiliving.com/sitemap.xml`
  - `https://acara.santiliving.com/sitemap.xml`
- `sitemap-0.xml` should include preferred subdomain locs for all four money pages and should not include main-domain duplicates for those same money paths.

## Crawl Budget Hygiene

- Nav/footer may keep global Santi Living service links, but anchor text must be contextual and not make karpet/permadani/acara pages read as generic kasur pages.
- On-page cross-links should point readers from broad intent to narrow intent: karpet pillar -> permadani/karpet merah/event bundle; event bundle -> karpet/permadani when alas area is the main need.
- Avoid overloading every article with all money pages. Use the dominant intent first, then one or two sibling links when it helps the customer decide.
- Do not add final price, ready-stock, or se-DIY claims unless verified from the relevant source of truth.

## Verification Checklist for Future Changes

1. Count donor links per money page after any bulk article update.
2. Run lint, typecheck, and build.
3. Confirm generated sitemap contains preferred host locs and excludes main-domain duplicates for money pages.
4. Verify live HTTP 200, title, canonical, rendered body markers, and schema for the affected pages after deployment.
5. If GSC indexing is requested later, submit preferred URLs only and treat ranking/indexing propagation as pending.

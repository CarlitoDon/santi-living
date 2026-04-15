# SEO & Google Ads Analysis Report

Date: 2026-03-16
Scope: Deep crawl using first-seo-mcp tools + direct Google Ads API (GAQL) + GA4 Data API
Property/Accounts:
- GA4: properties/519253158
- GSC: sc-domain:santiliving.com
- Google Ads Client: 340-551-3499
- Google Ads MCC: 220-546-3017

## 1) Executive Summary

Current paid setup is generating measurable Google Ads conversions, but attribution into GA4 Paid Search is still under-reported.

Key findings:
- Google Ads is active and healthy at campaign level (clicks, spend, conversions present).
- GA4 shows only 2 sessions from `google / cpc` in the same period, while Ads clicks are far higher.
- Conversion mix is dominated by Google-hosted/local actions (directions, engagement, calls), not web purchase events.
- Smart Campaign structure limits query transparency (search terms and keywords exposed as 0 in MCP tools).

Priority:
1. Fix measurement/attribution first.
2. Rebalance budget and campaign status.
3. Add a non-Smart Search campaign for controllable query-level optimization.

## 2) Data Crawl Coverage

### A. first-seo-mcp (Ads)
- gads_campaigns
- gads_campaign_controls
- gads_devices
- gads_ad_groups
- gads_keywords
- gads_search_terms
- gads_preview_changes

### B. first-seo-mcp (Context)
- ga4_channels
- ga4_devices
- ga4_traffic
- gsc_keywords
- gsc_pages
- gsc_devices
- generate_business_health_snapshot (current and previous range)

### C. Direct API (complex)
- Google Ads API `searchStream` (GAQL):
  - daily trend by campaign
  - hour of day
  - day of week
  - ad network type
  - country geo
  - conversion action breakdown
  - search term view
- GA4 Data API (`run_report`):
  - date x source/medium
  - landing page x source/medium

## 3) Core Metrics Snapshot

Period: 2026-02-15 to 2026-03-15

### Google Ads
- Impressions: 1,553
- Clicks: 98
- Spend: 90,091
- Conversions: 76
- Approx CPC: 919
- Approx CPA: 1,185

Campaigns:
1. Sewa Kasur disini aja! (PAUSED)
- Impressions: 868
- Clicks: 57
- Spend: 53,302
- Conversions: 48.5

2. Sewa Kasur Tercepat (ENABLED)
- Impressions: 685
- Clicks: 41
- Spend: 36,789
- Conversions: 27.5

### GA4 Acquisition Mix
- Total sessions: 150
- Direct: 82 (54.7%)
- Organic Search: 44 (29.3%)
- Paid Search: 2 (1.3%)

## 4) Advanced Findings (API-Driven)

### 4.1 Attribution Gap (Critical)
- Ads clicks and conversions are meaningful.
- GA4 `google / cpc` is very low (2 sessions in period).
- Strong indication of tagging or attribution loss between Ads and GA4 pipeline.

### 4.2 Conversion Action Mix
Top conversion actions are mostly local/Google-hosted:
- Local action - Directions: 62
- Local action - Other engagement: 14
- Click to call: 5
- Website visits (local action): 3

Web conversion actions (purchase/begin_checkout-based) are near zero.

### 4.3 Time-Based Performance
Hour aggregation (30-day API sample) shows strongest windows around:
- 09:00-11:00 -> strong volume + conversions
- 15:00-16:00 -> strong volume
- 19:00-20:00 -> low-mid volume but efficient conversion behavior

Low-value windows:
- 00:00-06:00 mostly non-productive

Day-of-week sample from API:
- Thursday: highest volume + conversions
- Saturday: strong efficiency
- Friday: high volume, weaker efficiency than Thursday/Saturday

### 4.4 Network and Geo
- Dominant network: SEARCH
- Minor volume on CONTENT network
- Geo concentrated in country criterion 2360 (Indonesia), as expected

### 4.5 Smart Campaign Visibility Limitation
- `keywords` and `search_terms` from MCP returned 0.
- Direct GAQL `search_term_view` check also returned 0 for this account setup, so this is not a parser bug.
- This is expected/consistent with Smart Campaign constraints and limited transparency in query-level reporting.

## 5) Improvement Plan

## P0 - Measurement & Attribution (Do First)
1. Ensure Google Ads auto-tagging is ON.
2. Ensure final URLs and redirects preserve `gclid`, `gbraid`, `wbraid`, UTM params.
3. Ensure GA4 purchase and begin_checkout events are mapped as active conversion actions in Ads.
4. Validate Ads->GA4 link and timezone/currency alignment.
5. Re-run same report 7 days after fix to confirm `google / cpc` sessions rise materially.

Expected outcome:
- Attribution quality improves.
- Budget and bid decisions become trustworthy.

## P1 - Budget and Status Rebalance (Preview Ready)
Prepared previews:
1. Enable campaign `23550094948` (currently PAUSED).
2. Increase budget `15281444868` from 6,500 -> 9,000 (+38.46%).
3. Decrease budget `15349980155` from 20,400 -> 8,000 (-60.78%).

Rationale:
- Re-activate high-conversion campaign while reducing budget concentration risk.
- Bring spending closer to controlled test distribution.

## P2 - Structure Upgrade
Launch one non-Smart Search campaign for query control:
- High-intent seed set:
  - sewa kasur jogja
  - sewa kasur
  - sewa kasur terdekat
- Add exact/phrase variants.
- Start a negative keyword framework.

Rationale:
- Smart campaigns hide query-level levers.
- Standard Search gives transparent search terms and better optimization control.

## P3 - Scheduling Optimizations
After attribution fix and 7-14 days of stable data:
1. Weight budget toward 09:00-11:00 and 15:00-20:00.
2. De-prioritize 00:00-06:00.
3. Validate by conversion quality, not only clicks.

## 6) Suggested 14-Day Execution Sequence

Day 1-2:
- Complete P0 measurement fixes.
- Keep budget stable for short baseline.

Day 3:
- Apply P1 status+budget rebalance.

Day 4-7:
- Monitor daily:
  - Ads clicks/conversions
  - GA4 paid sessions
  - Conversion action composition

Day 8-10:
- Launch P2 non-Smart Search test campaign.

Day 11-14:
- Apply P3 scheduling shifts from observed hourly performance.

## 7) Risks and Controls

Risks:
- Attribution remains broken, causing misleading optimization.
- Over-reliance on local actions without web conversion quality.
- Smart-only setup limits search-term-level control.

Controls:
- Mandatory attribution validation checkpoint before scaling spend.
- Weekly conversion action audit (local vs web actions).
- Parallel test in non-Smart Search for transparent intent data.

## 8) Current Status

Completed:
- Deep API crawl completed.
- MCC + developer token setup completed.
- Complex Ads API queries executed successfully.
- Optimization previews prepared safely (no unintended writes).

Pending decision:
- Approve apply for P1 changes (enable + budget rebalance).
- Continue P0 instrumentation hardening for attribution recovery.

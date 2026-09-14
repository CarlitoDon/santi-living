import datetime as dt
import unittest
from unittest.mock import patch

from scripts.seo_weekly_dashboard import (
    GA4_CUSTOM_EVENT_DIMENSIONS,
    MONEY_PAGES,
    SITEMAPS_TO_SUBMIT,
    build_offline_conversion_readiness,
    click_id_presence_summary,
    fetch_lead_export_rows,
    ga4_custom_dimension_probe_summary,
    ga4_snapshot,
    gbp_snapshot,
    inclusive_end_as_export_boundary,
    live_http_snapshot,
)


class SeoWeeklyDashboardTest(unittest.TestCase):
    def test_ga4_snapshot_does_not_probe_before_the_effective_date(self) -> None:
        response = {"ok": True, "status": 200, "body": {"rows": []}}

        with patch("scripts.seo_weekly_dashboard.ga4_run_report", return_value=response) as run_report:
            snapshot = ga4_snapshot("test-token", dt.date(2026, 8, 16), dt.date(2026, 9, 11))

        self.assertEqual(run_report.call_count, 2)
        self.assertEqual(
            snapshot["cta_source_custom_dimension_probe"]["data_state"],
            "not_ready",
        )
        self.assertIsNone(snapshot["cta_source_custom_dimension_probe"]["total_event_count"])

    def test_ga4_snapshot_uses_post_rollout_window_for_custom_dimensions(self) -> None:
        response = {"ok": True, "status": 200, "body": {"rows": []}}

        with patch("scripts.seo_weekly_dashboard.ga4_run_report", return_value=response) as run_report:
            snapshot = ga4_snapshot("test-token", dt.date(2026, 8, 16), dt.date(2026, 9, 13))

        self.assertEqual(run_report.call_count, 3)
        custom_probe_body = run_report.call_args_list[2].args[1]
        self.assertEqual(
            custom_probe_body["dateRanges"],
            [{"startDate": "2026-09-13", "endDate": "2026-09-13"}],
        )
        self.assertEqual(
            [item["name"] for item in custom_probe_body["dimensions"]],
            [f"customEvent:{dimension}" for dimension in GA4_CUSTOM_EVENT_DIMENSIONS],
        )
        self.assertEqual(
            snapshot["cta_source_custom_dimension_probe"]["data_state"],
            "available_empty",
        )

    def test_ga4_probe_distinguishes_http_success_from_empty_dimensions(self) -> None:
        result = ga4_custom_dimension_probe_summary({
            "ok": True,
            "status": 200,
            "body": {
                "rows": [
                    {
                        "dimensionValues": [{"value": "(not set)"}] * len(GA4_CUSTOM_EVENT_DIMENSIONS),
                        "metricValues": [{"value": "7"}],
                    }
                ]
            },
        })

        self.assertEqual(result["data_state"], "available_empty")
        self.assertEqual(result["total_event_count"], 7)
        self.assertEqual(result["populated_event_count"]["cta_source"], 0)
        self.assertEqual(result["not_set_event_count"]["page_type"], 7)

    def test_ga4_probe_accepts_valid_zero_row_response_without_rows_array(self) -> None:
        result = ga4_custom_dimension_probe_summary({
            "ok": True,
            "status": 200,
            "body": {
                "dimensionHeaders": [{"name": "customEvent:cta_source"}],
                "metricHeaders": [{"name": "eventCount", "type": "TYPE_INTEGER"}],
                "rowCount": 0,
            },
        })

        self.assertEqual(result["data_state"], "available_empty")
        self.assertEqual(result["total_event_count"], 0)

    def test_ga4_probe_reports_populated_dimensions(self) -> None:
        result = ga4_custom_dimension_probe_summary({
            "ok": True,
            "status": 200,
            "body": {
                "rows": [
                    {
                        "dimensionValues": [
                            {"value": "hero"},
                            {"value": "homepage"},
                            {"value": "karpet"},
                            {"value": "(not set)"},
                            {"value": "rental"},
                        ],
                        "metricValues": [{"value": "3"}],
                    }
                ]
            },
        })

        self.assertEqual(result["data_state"], "available_populated")
        self.assertEqual(result["total_event_count"], 3)
        self.assertEqual(result["populated_event_count"]["cta_source"], 3)
        self.assertEqual(result["populated_event_count"]["intent"], 3)
        self.assertEqual(result["not_set_event_count"]["page_type"], 3)

    def test_inclusive_dashboard_end_becomes_exclusive_export_boundary(self) -> None:
        self.assertEqual(inclusive_end_as_export_boundary("2026-09-11"), "2026-09-12")

    def test_click_id_summary_keeps_only_presence_counts(self) -> None:
        summary = click_id_presence_summary([
            {"gclid": "raw-gclid", "gbraid": None, "wbraid": ""},
            {"gclid": None, "gbraid": "raw-gbraid", "wbraid": None},
            {"gclid": None, "gbraid": None, "wbraid": None},
        ])

        self.assertEqual(summary, {
            "qualified_whatsapp_events": 3,
            "gclid_present": 1,
            "gbraid_present": 1,
            "wbraid_present": 0,
            "any_google_click_id_present": 2,
            "any_google_click_id_rate": 0.667,
        })
        self.assertNotIn("raw-gclid", summary.values())
        self.assertNotIn("raw-gbraid", summary.values())

    def test_readiness_requires_complete_qualified_data_and_click_id(self) -> None:
        result = build_offline_conversion_readiness({
            "ok": True,
            "rows": [{"gclid": "raw-gclid", "gbraid": None, "wbraid": None}],
            "rows_returned": 1,
            "pages": 1,
            "complete": True,
        })

        self.assertEqual(result["status"], "candidate_data_present")
        self.assertEqual(result["any_google_click_id_present"], 1)
        self.assertFalse(result["upload_performed"])
        self.assertNotIn("raw-gclid", result.values())

    def test_readiness_does_not_claim_ready_when_export_is_truncated(self) -> None:
        result = build_offline_conversion_readiness({
            "ok": True,
            "rows": [{"gclid": "raw-gclid"}],
            "rows_returned": 1000,
            "pages": 1,
            "complete": False,
        })

        self.assertEqual(result["status"], "incomplete")
        self.assertFalse(result["complete"])

    def test_export_paginates_until_a_short_page(self) -> None:
        responses = [
            {
                "ok": True,
                "status": 200,
                "body": {"rows": [{"gclid": "raw-first-page"}] * 1000},
            },
            {
                "ok": True,
                "status": 200,
                "body": {"rows": [{"gclid": "raw-last-page"}]},
            },
        ]

        with patch.dict("os.environ", {"LEAD_EVENTS_ADMIN_TOKEN": "test-token"}), patch(
            "scripts.seo_weekly_dashboard.request_json",
            side_effect=responses,
        ) as request:
            result = fetch_lead_export_rows(
                "2026-09-01",
                "2026-09-12",
                event_type="whatsapp_click",
                city_classification="service_area",
            )

        self.assertTrue(result["ok"])
        self.assertTrue(result["complete"])
        self.assertEqual(result["rows_returned"], 1001)
        self.assertEqual(result["pages"], 2)
        self.assertEqual(request.call_count, 2)
        self.assertIn("offset=1000", request.call_args_list[1].args[1])
        self.assertIn("city_classification=service_area", request.call_args_list[0].args[1])

    def test_export_rejects_malformed_payload_instead_of_treating_it_as_empty(self) -> None:
        with patch.dict("os.environ", {"LEAD_EVENTS_ADMIN_TOKEN": "test-token"}), patch(
            "scripts.seo_weekly_dashboard.request_json",
            return_value={"ok": True, "status": 200, "body": {"rows": "not-an-array"}},
        ):
            result = fetch_lead_export_rows(
                "2026-09-01",
                "2026-09-12",
                event_type="whatsapp_click",
            )

        self.assertFalse(result["ok"])
        self.assertIn("rows must be an array", result["reason"])

    def test_gbp_snapshot_selects_configured_location_instead_of_first_result(self) -> None:
        responses = [
            {
                "ok": True,
                "status": 200,
                "body": {
                    "locations": [
                        {"name": "locations/other", "title": "Wrong location"},
                        {
                            "name": "locations/10488080858214395605",
                            "title": "Target location",
                            "websiteUri": "https://target.example",
                            "phoneNumbers": {"primaryPhone": "+62000"},
                            "categories": {"primaryCategory": {"displayName": "Target category"}},
                        },
                    ]
                },
            },
            {"ok": True, "status": 200, "body": {"reviews": []}},
            {"ok": True, "status": 200, "body": {"localPosts": []}},
        ]

        with patch("scripts.seo_weekly_dashboard.request_json", side_effect=responses):
            snapshot = gbp_snapshot("test-token")

        location = snapshot["location"]
        self.assertTrue(location["target_location_found"])
        self.assertEqual(location["name"], "locations/10488080858214395605")
        self.assertEqual(location["title"], "Target location")
        self.assertEqual(location["primary_category"], "Target category")

    def test_gbp_snapshot_fails_closed_when_configured_location_is_missing(self) -> None:
        responses = [
            {"ok": True, "status": 200, "body": {"locations": [{"name": "locations/other"}]}},
            {"ok": True, "status": 200, "body": {"reviews": []}},
            {"ok": True, "status": 200, "body": {"localPosts": []}},
        ]

        with patch("scripts.seo_weekly_dashboard.request_json", side_effect=responses):
            snapshot = gbp_snapshot("test-token")

        location = snapshot["location"]
        self.assertFalse(location["target_location_found"])
        self.assertNotIn("title", location)
        self.assertIn("not returned", location["reason"])

    def test_live_snapshot_checks_aliases_against_main_canonical_urls(self) -> None:
        pages_by_url = {page["url"]: page for page in MONEY_PAGES}

        def fake_fetch_text(url: str) -> dict[str, object]:
            page = pages_by_url.get(url)
            if page:
                marker = "carpet_page_hero" if page["cluster"] == "karpet" else page["cta_source"]
                return {
                    "ok": True,
                    "status": 200,
                    "server": "Vercel",
                    "text": (
                        f'<link rel="canonical" href="{page["canonical"]}">'
                        f'<meta property="og:url" content="{page["canonical"]}">'
                        f'<a data-wa-source="{marker}">'
                    ),
                }
            if url in SITEMAPS_TO_SUBMIT:
                canonical_urls = "".join(page["canonical"] for page in MONEY_PAGES)
                return {"ok": True, "status": 200, "server": "Vercel", "text": f"<urlset>{canonical_urls}</urlset>"}
            return {"ok": True, "status": 200, "server": "Vercel", "text": "Sitemap: https://santiliving.com/sitemap.xml"}

        with patch("scripts.seo_weekly_dashboard.fetch_text", side_effect=fake_fetch_text):
            snapshot = live_http_snapshot()

        pages = {page["host"]: page for page in snapshot["pages"]}
        karpet = pages["karpet.santiliving.com"]
        self.assertEqual(karpet["expected_canonical"], "https://santiliving.com/id/sewa-karpet-jogja")
        self.assertTrue(karpet["canonical_matches"])
        self.assertTrue(karpet["og_url_matches"])
        self.assertTrue(karpet["cta_source_present"])
        self.assertEqual(karpet["matched_cta_sources"], ["carpet_page_hero"])
        self.assertEqual(len(snapshot["sitemaps"]), 1)
        self.assertTrue(all(item["is_urlset"] for item in snapshot["sitemaps"]))


if __name__ == "__main__":
    unittest.main()

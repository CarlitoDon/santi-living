from __future__ import annotations

import datetime as dt
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

try:
    from analytics_anomaly_monitor import (
        anomaly_check,
        apply_alert_deduplication,
        build_cross_source_checks,
        collect_google_ads,
        filled_series,
        safe_error_message,
    )
    MONITOR_MODULE = "analytics_anomaly_monitor"
except ModuleNotFoundError:
    from scripts.analytics_anomaly_monitor import (
        anomaly_check,
        apply_alert_deduplication,
        build_cross_source_checks,
        collect_google_ads,
        filled_series,
        safe_error_message,
    )
    MONITOR_MODULE = "scripts.analytics_anomaly_monitor"


class AnalyticsAnomalyMonitorTest(unittest.TestCase):
    def test_stable_series_is_not_an_anomaly(self) -> None:
        start = dt.date(2026, 8, 1)
        end = dt.date(2026, 8, 29)
        daily = [{"date": day, "value": 10} for day in (start + dt.timedelta(days=index) for index in range(29))]

        result = anomaly_check("ga4", "event.whatsapp_click", daily, end.isoformat(), min_volume=5)

        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["baseline_count"], 4)
        self.assertEqual(result["baseline_method"], "same_weekday_28d")

    def test_drop_from_nonzero_baseline_is_anomaly(self) -> None:
        start = dt.date(2026, 8, 1)
        end = dt.date(2026, 8, 29)
        daily = [{"date": day, "value": 10} for day in (start + dt.timedelta(days=index) for index in range(28))]
        daily.append({"date": end.isoformat(), "value": 0})

        result = anomaly_check("neon", "persisted_events", daily, end.isoformat(), min_volume=5)

        self.assertEqual(result["status"], "anomaly")
        self.assertEqual(result["direction"], "drop")

    def test_zero_baseline_spike_is_anomaly(self) -> None:
        start = dt.date(2026, 8, 1)
        end = dt.date(2026, 8, 29)
        daily = [{"date": day, "value": 0} for day in (start + dt.timedelta(days=index) for index in range(28))]
        daily.append({"date": end.isoformat(), "value": 2})

        result = anomaly_check("neon", "geocode_failures", daily, end.isoformat(), min_volume=1)

        self.assertEqual(result["status"], "anomaly")
        self.assertEqual(result["direction"], "spike")

    def test_filled_series_makes_missing_provider_days_explicit_zero(self) -> None:
        start = dt.date(2026, 9, 1)
        end = dt.date(2026, 9, 3)

        result = filled_series([{"date": "2026-09-01", "total_events": 4}], "total_events", start, end)

        self.assertEqual(result, [
            {"date": "2026-09-01", "value": 4.0},
            {"date": "2026-09-02", "value": 0.0},
            {"date": "2026-09-03", "value": 0.0},
        ])

    def test_alert_deduplication_only_marks_first_observation_new(self) -> None:
        alert = {
            "source": "ga4",
            "metric": "event.whatsapp_click",
            "target_date": "2026-09-11",
            "direction": "drop",
            "current": 0,
        }
        with tempfile.TemporaryDirectory() as directory:
            state_path = Path(directory) / "alert-state.json"

            first = apply_alert_deduplication([alert], state_path, "2026-09-12T00:00:00Z")
            second = apply_alert_deduplication([alert], state_path, "2026-09-12T01:00:00Z")

            self.assertEqual(first, [alert])
            self.assertEqual(second, [])
            self.assertEqual(json.loads(state_path.read_text())["alerts"].keys().__len__(), 1)

    def test_cross_source_check_defers_missing_ga4_qualified_event_before_rollout(self) -> None:
        sources = {
            "ga4": {"status": "available", "daily": [{"date": "2026-09-11"}]},
            "neon": {
                "status": "available",
                "daily": [{"date": "2026-09-11", "qualified_whatsapp_clicks": 6}],
            },
        }

        checks = build_cross_source_checks(sources, "2026-09-11")

        qualified = next(check for check in checks if check["metric"] == "qualified_whatsapp_ga4_vs_neon")
        self.assertEqual(qualified["status"], "not_ready")
        self.assertEqual(qualified["effective_date"], "2026-09-13")

    def test_cross_source_check_flags_missing_ga4_qualified_event_after_rollout(self) -> None:
        sources = {
            "ga4": {"status": "available", "daily": [{"date": "2026-09-13"}]},
            "neon": {
                "status": "available",
                "daily": [{"date": "2026-09-13", "qualified_whatsapp_clicks": 6}],
            },
        }

        checks = build_cross_source_checks(sources, "2026-09-13")

        qualified = next(check for check in checks if check["metric"] == "qualified_whatsapp_ga4_vs_neon")
        self.assertEqual(qualified["status"], "anomaly")
        self.assertEqual(qualified["direction"], "drop")
        self.assertEqual(qualified["ga4_value"], 0)
        self.assertEqual(qualified["neon_value"], 6)

    def test_google_ads_uses_google_ads_service_search_stream_endpoint(self) -> None:
        response = {
            "ok": True,
            "status": 200,
            "body": [
                {
                    "results": [
                        {
                            "segments": {"date": "2026-09-11"},
                            "metrics": {"clicks": "4", "conversions": 1.0, "costMicros": "2500000"},
                        }
                    ]
                }
            ],
        }
        with patch.dict(
            os.environ,
            {
                "GOOGLE_ADS_DEVELOPER_TOKEN": "developer-token",
                "GOOGLE_ADS_CUSTOMER_ID": "340-551-3499",
                "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "220-546-3017",
                "GOOGLE_ADS_API_VERSION": "v25",
            },
            clear=False,
        ), patch(
            f"{MONITOR_MODULE}.request_json_with_headers",
            return_value=response,
        ) as request:
            result = collect_google_ads(
                "oauth-token",
                dt.date(2026, 9, 11),
                dt.date(2026, 9, 11),
            )

        self.assertEqual(result["status"], "available")
        self.assertEqual(result["daily"][0]["clicks"], 4.0)
        self.assertEqual(
            request.call_args.args[1],
            "https://googleads.googleapis.com/v25/customers/3405513499/googleAds:searchStream",
        )
        self.assertEqual(request.call_args.args[4]["login-customer-id"], "2205463017")

    def test_provider_error_message_reads_nested_google_ads_reason(self) -> None:
        response = {
            "status": 403,
            "body": [
                {
                    "error": {
                        "message": "The caller does not have permission",
                        "details": [
                            {
                                "errors": [
                                    {"message": "Customer is not linked to the manager"}
                                ]
                            }
                        ],
                    }
                }
            ],
        }

        self.assertEqual(safe_error_message(response), "Customer is not linked to the manager")


if __name__ == "__main__":
    unittest.main()

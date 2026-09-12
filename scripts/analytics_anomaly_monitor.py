#!/usr/bin/env python3
"""Generate a daily anomaly snapshot for Santi Living acquisition and runtime metrics.

The monitor is read-only and deliberately keeps notification delivery in dry-run mode.
It never treats an unavailable provider as zero and only writes aggregate metrics to the
JSON/Markdown artifacts.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import statistics
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

try:
    from seo_weekly_dashboard import GA4_PROPERTY, load_env_file, refresh_access_token, request_json
except ImportError:  # pragma: no cover - exercised when imported as scripts.*
    from scripts.seo_weekly_dashboard import GA4_PROPERTY, load_env_file, refresh_access_token, request_json


DEFAULT_LEAD_METRICS_URL = "https://santiliving.com/api/lead/metrics"
DEFAULT_GA4_EVENTS = (
    "whatsapp_click",
    "santi_whatsapp_qualified",
    "phone_click",
    "form_submit",
    "purchase",
)
DEFAULT_LOOKBACK_DAYS = 28
DEFAULT_SCORE_THRESHOLD = 3.0
DEFAULT_RELATIVE_THRESHOLD = 0.5
QUALIFIED_WHATSAPP_EFFECTIVE_DATE = dt.date(2026, 9, 13)


def parse_date(value: str | dt.date) -> dt.date:
    if isinstance(value, dt.datetime):
        return value.date()
    if isinstance(value, dt.date):
        return value
    return dt.date.fromisoformat(str(value)[:10])


def date_range(start: dt.date, end: dt.date) -> list[str]:
    return [
        (start + dt.timedelta(days=offset)).isoformat()
        for offset in range((end - start).days + 1)
    ]


def safe_error_message(response: dict[str, Any]) -> str:
    def find_message(value: Any) -> str | None:
        if isinstance(value, list):
            for item in value:
                message = find_message(item)
                if message:
                    return message
            return None
        if not isinstance(value, dict):
            return None

        for key in ("details", "errors", "error"):
            message = find_message(value.get(key))
            if message:
                return message
        for key in ("message", "reason"):
            message = value.get(key)
            if message:
                return str(message)
        return None

    body = response.get("body")
    if isinstance(body, (dict, list)):
        message = find_message(body)
        if message:
            return str(message)[:300]
    if isinstance(body, str):
        if "<html" in body.lower() or "<!doctype" in body.lower():
            return f"HTTP {response.get('status') or 'error'} response body was HTML"
        return body[:300]
    return str(response.get("error") or f"HTTP {response.get('status') or 'unknown'}")[:300]


def request_json_with_headers(
    method: str,
    url: str,
    token: str | None = None,
    body: Any | None = None,
    extra_headers: dict[str, str] | None = None,
) -> dict[str, Any]:
    headers = {"User-Agent": "Santi Living analytics anomaly monitor/1.0"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if extra_headers:
        headers.update(extra_headers)
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            raw = response.read().decode("utf-8", "ignore")
            parsed = json.loads(raw) if raw else None
            return {"ok": True, "status": response.status, "body": parsed}
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8", "ignore")
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = raw[:1500]
        return {"ok": False, "status": error.code, "body": parsed}
    except Exception as error:  # noqa: BLE001 - a monitor records provider failure
        return {"ok": False, "status": None, "error": repr(error), "body": None}


def number(value: Any) -> float:
    if isinstance(value, bool) or value is None:
        return 0.0
    try:
        result = float(value)
    except (TypeError, ValueError):
        return 0.0
    return result if math.isfinite(result) else 0.0


def numeric_value(row: dict[str, Any], *keys: str) -> float | None:
    for key in keys:
        if key in row and row[key] not in (None, ""):
            value = number(row[key])
            return value
    return None


def source_unavailable(name: str, reason: str, status: int | None = None) -> dict[str, Any]:
    return {
        "name": name,
        "status": "unavailable",
        "reason": reason[:300],
        "provider_status": status,
        "daily": [],
    }


def source_available(name: str, daily: list[dict[str, Any]]) -> dict[str, Any]:
    return {"name": name, "status": "available", "daily": daily}


def coverage_summary(daily: list[dict[str, Any]], start: dt.date, end: dt.date) -> dict[str, Any]:
    expected_dates = date_range(start, end)
    expected_set = set(expected_dates)
    date_counts: dict[str, int] = {}
    for row in daily:
        if not isinstance(row, dict):
            continue
        try:
            day = parse_date(str(row.get("date") or "")).isoformat()
        except ValueError:
            continue
        date_counts[day] = date_counts.get(day, 0) + 1

    observed_dates = sorted(day for day in date_counts if day in expected_set)
    missing_dates = [day for day in expected_dates if day not in date_counts]
    unexpected_dates = sorted(day for day in date_counts if day not in expected_set)
    duplicate_dates = sorted(day for day, count in date_counts.items() if count > 1)
    return {
        "expected_days": len(expected_dates),
        "observed_days": len(observed_dates),
        "missing_days": len(missing_dates),
        "missing_dates": missing_dates,
        "unexpected_dates": unexpected_dates,
        "duplicate_dates": duplicate_dates,
        "complete": not missing_dates,
    }


def parse_ga4_date(value: str) -> str | None:
    try:
        return dt.datetime.strptime(value, "%Y%m%d").date().isoformat()
    except (TypeError, ValueError):
        return None


def collect_ga4(token: str | None, start: dt.date, end: dt.date) -> dict[str, Any]:
    if not token:
        return source_unavailable("ga4", "Google OAuth token unavailable")

    expressions = [
        {
            "filter": {
                "fieldName": "eventName",
                "stringFilter": {"matchType": "EXACT", "value": event_name},
            }
        }
        for event_name in DEFAULT_GA4_EVENTS
    ]
    response = request_json(
        "POST",
        f"https://analyticsdata.googleapis.com/v1beta/{GA4_PROPERTY}:runReport",
        token,
        {
            "dateRanges": [{"startDate": start.isoformat(), "endDate": end.isoformat()}],
            "dimensions": [{"name": "date"}, {"name": "eventName"}],
            "metrics": [{"name": "eventCount"}],
            "dimensionFilter": {"orGroup": {"expressions": expressions}},
            "limit": 5000,
        },
    )
    if not response.get("ok"):
        return source_unavailable("ga4", safe_error_message(response), response.get("status"))

    daily: dict[str, dict[str, Any]] = {}
    for row in ((response.get("body") or {}).get("rows", []) if isinstance(response.get("body"), dict) else []):
        dimensions = [item.get("value", "") for item in row.get("dimensionValues", [])]
        metrics = [item.get("value", "0") for item in row.get("metricValues", [])]
        day = parse_ga4_date(dimensions[0] if dimensions else "")
        event_name = dimensions[1] if len(dimensions) > 1 else ""
        if not day or event_name not in DEFAULT_GA4_EVENTS:
            continue
        daily.setdefault(day, {})[event_name] = int(number(metrics[0] if metrics else 0))

    return source_available("ga4", [{"date": day, **values} for day, values in sorted(daily.items())])


def collect_neon(start: dt.date, end: dt.date, url: str) -> dict[str, Any]:
    token = os.environ.get("LEAD_EVENTS_ADMIN_TOKEN")
    if not token:
        return source_unavailable("neon", "missing LEAD_EVENTS_ADMIN_TOKEN")

    query = urllib.parse.urlencode(
        {
            "from": f"{start.isoformat()}T00:00:00Z",
            "to": f"{(end + dt.timedelta(days=1)).isoformat()}T00:00:00Z",
        }
    )
    response = request_json("GET", f"{url}?{query}", token)
    if not response.get("ok"):
        return source_unavailable("neon", safe_error_message(response), response.get("status"))

    body = response.get("body")
    metrics = body.get("metrics") if isinstance(body, dict) else None
    if not isinstance(metrics, dict):
        return source_unavailable("neon", "metrics endpoint returned an invalid payload", response.get("status"))
    daily = metrics.get("daily")
    if not isinstance(daily, list):
        return source_unavailable("neon", "metrics endpoint did not return daily aggregates", response.get("status"))
    return source_available("neon", [row for row in daily if isinstance(row, dict)])


def discover_google_ads_customer(token: str, developer_token: str, api_version: str) -> tuple[str | None, str | None]:
    response = request_json_with_headers(
        "GET",
        f"https://googleads.googleapis.com/{api_version}/customers:listAccessibleCustomers",
        token,
        extra_headers={"developer-token": developer_token},
    )
    if not response.get("ok"):
        return None, safe_error_message(response)

    body = response.get("body")
    names = body.get("resourceNames") if isinstance(body, dict) else None
    customer_ids = sorted({str(name).rsplit("/", 1)[-1] for name in names or [] if "/" in str(name)})
    if len(customer_ids) == 1:
        return customer_ids[0], None
    if not customer_ids:
        return None, "Google Ads API returned no accessible customers"
    return None, f"Google Ads API returned {len(customer_ids)} accessible customers; set GOOGLE_ADS_CUSTOMER_ID"


def collect_google_ads(token: str | None, start: dt.date, end: dt.date) -> dict[str, Any]:
    developer_token = os.environ.get("GOOGLE_ADS_DEVELOPER_TOKEN")
    customer_id = (
        os.environ.get("GOOGLE_ADS_CUSTOMER_ID")
        or os.environ.get("GOOGLE_ADS_CLIENT_CUSTOMER_ID")
        or os.environ.get("GOOGLE_ADS_ACCOUNT_ID")
        or os.environ.get("ADS_CUSTOMER_ID")
    )
    if not developer_token:
        return source_unavailable("google_ads", "missing GOOGLE_ADS_DEVELOPER_TOKEN")
    if not token:
        return source_unavailable("google_ads", "Google OAuth token unavailable")

    api_version = os.environ.get("GOOGLE_ADS_API_VERSION", "v25")
    if not customer_id:
        customer_id, discovery_error = discover_google_ads_customer(token, developer_token, api_version)
        if not customer_id:
            return source_unavailable("google_ads", discovery_error or "Google Ads customer discovery failed")
    customer_id = customer_id.replace("-", "")
    login_customer_id = os.environ.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID", "").replace("-", "")
    endpoint = f"https://googleads.googleapis.com/{api_version}/customers/{customer_id}/googleAds:searchStream"
    headers = {"developer-token": developer_token}
    if login_customer_id:
        headers["login-customer-id"] = login_customer_id
    response = request_json_with_headers(
        "POST",
        endpoint,
        token,
        {
            "query": " ".join(
                [
                    "SELECT segments.date, metrics.clicks, metrics.conversions, metrics.cost_micros",
                    "FROM customer",
                    f"WHERE segments.date BETWEEN '{start.isoformat()}' AND '{end.isoformat()}'",
                ]
            )
        },
        headers,
    )
    if not response.get("ok"):
        return source_unavailable("google_ads", safe_error_message(response), response.get("status"))

    raw_batches = response.get("body")
    batches = raw_batches if isinstance(raw_batches, list) else [raw_batches]
    daily: dict[str, dict[str, Any]] = {}
    for batch in batches:
        if not isinstance(batch, dict):
            continue
        for result in batch.get("results", []):
            if not isinstance(result, dict):
                continue
            segments = result.get("segments") or {}
            metrics = result.get("metrics") or {}
            day = str(segments.get("date") or "")
            if not day:
                continue
            daily[day] = {
                "date": day,
                "clicks": number(metrics.get("clicks")),
                "conversions": number(metrics.get("conversions")),
                "cost_micros": number(metrics.get("costMicros")),
            }
    if not daily:
        return source_unavailable("google_ads", "Google Ads API returned no daily rows", response.get("status"))
    return source_available("google_ads", [daily[day] for day in sorted(daily)])


def load_vercel_usage_payload(start: dt.date, end: dt.date, url: str | None, file_path: str | None) -> tuple[Any | None, str | None, int | None]:
    if file_path:
        try:
            return json.loads(Path(file_path).expanduser().read_text()), None, None
        except (OSError, json.JSONDecodeError) as error:
            return None, f"unable to read Vercel usage file: {error}", None
    if not url:
        return None, "no Vercel usage source configured; set VERCEL_USAGE_REPORT_URL or VERCEL_USAGE_REPORT_FILE", None

    separator = "&" if "?" in url else "?"
    query = urllib.parse.urlencode({"from": start.isoformat(), "to": end.isoformat()})
    token = os.environ.get("VERCEL_USAGE_TOKEN") or os.environ.get("VERCEL_TOKEN")
    response = request_json("GET", f"{url}{separator}{query}", token)
    if not response.get("ok"):
        return None, safe_error_message(response), response.get("status")
    return response.get("body"), None, response.get("status")


def collect_vercel(start: dt.date, end: dt.date, url: str | None, file_path: str | None) -> dict[str, Any]:
    payload, error, status = load_vercel_usage_payload(start, end, url, file_path)
    if error:
        return source_unavailable("vercel", error, status)

    if isinstance(payload, dict) and payload.get("error"):
        provider_error = payload.get("error")
        code = provider_error.get("code") if isinstance(provider_error, dict) else None
        message = safe_error_message({"body": provider_error})
        reason = f"{code}: {message}" if code and message else str(code or message)
        return source_unavailable("vercel", reason or "Vercel usage provider returned an error", status)

    rows = payload.get("daily") if isinstance(payload, dict) else payload
    if not isinstance(rows, list):
        return source_unavailable("vercel", "Vercel usage source did not return a daily array", status)

    daily: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        day = row.get("date") or row.get("day")
        if not day:
            continue
        isr_writes = numeric_value(row, "isr_writes", "isrWrites", "ISR Writes", "isr_write_count")
        fluid_cpu = numeric_value(
            row,
            "fluid_active_cpu_ms",
            "fluidActiveCpuMs",
            "fluid_active_cpu",
            "fluidActiveCpu",
            "Fluid Active CPU",
        )
        if isr_writes is None and fluid_cpu is None:
            continue
        daily.append({
            "date": str(day)[:10],
            "isr_writes": isr_writes if isr_writes is not None else 0,
            "fluid_active_cpu_ms": fluid_cpu if fluid_cpu is not None else 0,
        })
    if not daily:
        return source_unavailable("vercel", "Vercel usage source had no recognized ISR/Fluid metrics", status)
    return source_available("vercel", sorted(daily, key=lambda row: row["date"]))


def filled_series(daily: list[dict[str, Any]], key: str, start: dt.date, end: dt.date) -> list[dict[str, Any]]:
    values = {str(row.get("date"))[:10]: number(row.get(key)) for row in daily}
    return [{"date": day, "value": values[day] if day in values else None} for day in date_range(start, end)]


def percentile(values: list[float], fraction: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    position = (len(ordered) - 1) * fraction
    lower = math.floor(position)
    upper = math.ceil(position)
    if lower == upper:
        return ordered[lower]
    return ordered[lower] + (ordered[upper] - ordered[lower]) * (position - lower)


def anomaly_check(
    source: str,
    metric: str,
    series: list[dict[str, Any]],
    target_date: str,
    *,
    min_volume: float,
    score_threshold: float = DEFAULT_SCORE_THRESHOLD,
    relative_threshold: float = DEFAULT_RELATIVE_THRESHOLD,
) -> dict[str, Any]:
    target_day = parse_date(target_date)
    target = next((point for point in series if parse_date(point["date"]) == target_day), None)
    if target is None or target.get("value") is None:
        return {
            "source": source,
            "metric": metric,
            "status": "not_ready",
            "target_date": target_date,
            "reason": f"target date {target_date} is missing from the provider response; no zero was inferred",
        }

    baseline_candidates = [
        point
        for point in series
        if target_day - dt.timedelta(days=28) <= parse_date(point["date"]) < target_day
    ]
    same_weekday = [point for point in baseline_candidates if parse_date(point["date"]).weekday() == target_day.weekday()]
    if len(same_weekday) >= 3:
        baseline_candidates = same_weekday
        baseline_method = "same_weekday_28d"
    else:
        baseline_method = "trailing_28d"
    baseline_points = [point for point in baseline_candidates if point.get("value") is not None]
    missing_baseline_count = len(baseline_candidates) - len(baseline_points)

    if len(baseline_points) < 3:
        return {
            "source": source,
            "metric": metric,
            "status": "insufficient_history",
            "target_date": target_date,
            "current": number(target["value"]),
            "baseline_count": len(baseline_points),
            "missing_baseline_count": missing_baseline_count,
            "baseline_method": baseline_method,
        }

    values = [number(point["value"]) for point in baseline_points]
    current = number(target["value"])
    median = statistics.median(values)
    mad = statistics.median([abs(value - median) for value in values])
    q1 = percentile(values, 0.25)
    q3 = percentile(values, 0.75)
    scale = 1.4826 * mad
    if scale <= 0:
        scale = (q3 - q1) / 1.349
    delta = current - median
    relative_delta = abs(delta) / max(abs(median), 1.0)
    score = abs(delta) / scale if scale > 0 else (math.inf if delta else 0.0)
    volume_guard = max(current, median) >= min_volume
    is_anomaly = volume_guard and (
        (median == 0 and current >= min_volume)
        or score >= score_threshold
        or relative_delta >= relative_threshold
    )
    return {
        "source": source,
        "metric": metric,
        "status": "anomaly" if is_anomaly else "ok",
        "target_date": target_date,
        "current": current,
        "baseline_median": median,
        "baseline_count": len(values),
        "baseline_method": baseline_method,
        "score": None if math.isinf(score) else round(score, 3),
        "relative_delta": round(relative_delta, 3),
        "direction": "spike" if delta > 0 else "drop" if delta < 0 else "flat",
        "min_volume": min_volume,
    }


def metric_definitions() -> dict[str, dict[str, Any]]:
    return {
        "ga4": {
            "event.whatsapp_click": ("whatsapp_click", 5),
            "event.santi_whatsapp_qualified": ("santi_whatsapp_qualified", 1),
            "event.phone_click": ("phone_click", 1),
            "event.form_submit": ("form_submit", 1),
            "event.purchase": ("purchase", 1),
        },
        "neon": {
            "persisted_events": ("total_events", 5),
            "qualified_whatsapp_clicks": ("qualified_whatsapp_clicks", 1),
            "geocode_failures": ("geocode_failures", 1),
            "unknown_city_events": ("unknown_city_events", 1),
        },
        "google_ads": {
            "clicks": ("clicks", 5),
            "conversions": ("conversions", 1),
            "cost_micros": ("cost_micros", 1000),
        },
        "vercel": {
            "isr_writes": ("isr_writes", 1),
            "fluid_active_cpu_ms": ("fluid_active_cpu_ms", 1),
        },
    }


def build_cross_source_checks(sources: dict[str, Any], target_date: str) -> list[dict[str, Any]]:
    ga4 = sources.get("ga4", {})
    neon = sources.get("neon", {})
    if ga4.get("status") != "available" or neon.get("status") != "available":
        return []

    target_day = parse_date(target_date)
    ga4_row = next((row for row in ga4.get("daily", []) if row.get("date") == target_date), {})
    neon_row = next((row for row in neon.get("daily", []) if row.get("date") == target_date), {})
    pairs = (
        ("qualified_whatsapp", "santi_whatsapp_qualified", "qualified_whatsapp_clicks"),
        ("phone_click", "phone_click", "phone_clicks"),
        ("form_submit", "form_submit", "form_submits"),
    )
    checks: list[dict[str, Any]] = []
    for label, ga4_field, neon_field in pairs:
        if label == "qualified_whatsapp" and target_day < QUALIFIED_WHATSAPP_EFFECTIVE_DATE:
            checks.append({
                "source": "parity",
                "metric": f"{label}_ga4_vs_neon",
                "status": "not_ready",
                "target_date": target_date,
                "reason": "qualified WhatsApp parity is deferred until the first complete UTC day after rollout",
                "effective_date": QUALIFIED_WHATSAPP_EFFECTIVE_DATE.isoformat(),
            })
            continue

        ga4_has_target = any(row.get("date") == target_date for row in ga4.get("daily", []))
        neon_has_target = any(row.get("date") == target_date for row in neon.get("daily", []))
        if not ga4_has_target or not neon_has_target:
            missing_sources = []
            if not ga4_has_target:
                missing_sources.append("ga4")
            if not neon_has_target:
                missing_sources.append("neon")
            checks.append({
                "source": "parity",
                "metric": f"{label}_ga4_vs_neon",
                "status": "not_ready",
                "target_date": target_date,
                "reason": "same-day parity requires a target-date row from both providers; missing rows are not treated as zero",
                "missing_sources": missing_sources,
            })
            continue

        ga4_value = number(ga4_row.get(ga4_field))
        neon_value = number(neon_row.get(neon_field))
        delta = ga4_value - neon_value
        relative_delta = abs(delta) / max(abs(neon_value), 1.0)
        is_anomaly = (
            (neon_value > 0 and ga4_value == 0)
            or (ga4_value > 0 and neon_value == 0)
            or (max(ga4_value, neon_value) >= 2 and relative_delta >= DEFAULT_RELATIVE_THRESHOLD)
        )
        checks.append({
            "source": "parity",
            "metric": f"{label}_ga4_vs_neon",
            "status": "anomaly" if is_anomaly else "ok",
            "target_date": target_date,
            "current": ga4_value,
            "baseline_median": neon_value,
            "baseline_count": 1,
            "baseline_method": "same-day cross-source",
            "score": None,
            "relative_delta": round(relative_delta, 3),
            "direction": "spike" if delta > 0 else "drop" if delta < 0 else "flat",
            "min_volume": 1,
            "ga4_value": ga4_value,
            "neon_value": neon_value,
            "detail": f"GA4={ga4_value:g}; Neon={neon_value:g}",
        })
    return checks


def build_alert_fingerprint(alert: dict[str, Any]) -> str:
    return "|".join([
        str(alert.get("source")),
        str(alert.get("metric")),
        str(alert.get("target_date")),
        str(alert.get("direction")),
    ])


def load_alert_state(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text())
        return value if isinstance(value, dict) else {"alerts": {}}
    except (OSError, json.JSONDecodeError):
        return {"alerts": {}}


def apply_alert_deduplication(alerts: list[dict[str, Any]], path: Path, generated_at: str) -> list[dict[str, Any]]:
    state = load_alert_state(path)
    previous = state.get("alerts") if isinstance(state.get("alerts"), dict) else {}
    new_alerts: list[dict[str, Any]] = []
    current = {}
    for alert in alerts:
        fingerprint = build_alert_fingerprint(alert)
        current[fingerprint] = {"last_seen": generated_at}
        if fingerprint not in previous:
            new_alerts.append(alert)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"alerts": current}, ensure_ascii=False, indent=2) + "\n")
    return new_alerts


def build_markdown(snapshot: dict[str, Any]) -> str:
    lines = [
        "# Santi Living Analytics Anomaly Monitor",
        "",
        f"Generated UTC: `{snapshot['generated_at_utc']}`",
        f"Target date: `{snapshot['target_date']}`",
        f"Baseline: trailing `{snapshot['lookback_days']}` days with same-weekday preference",
        "",
        "## Source status",
    ]
    for name, source in snapshot["sources"].items():
        suffix = "" if source["status"] == "available" else f" — {source.get('reason', 'unavailable')}"
        coverage = source.get("coverage")
        if coverage:
            suffix += (
                f"; coverage={coverage['observed_days']}/{coverage['expected_days']} days"
                f" (missing={coverage['missing_days']})"
            )
        lines.append(f"- `{name}`: {source['status']}{suffix}")
    lines.extend(["", "## Alerts"])
    if snapshot["alerts"]:
        for alert in snapshot["alerts"]:
            lines.append(
                f"- `{alert['source']}.{alert['metric']}` {alert['direction']} on `{alert['target_date']}`: "
                f"current={alert['current']} baseline={alert.get('baseline_median')} "
                f"relative_delta={alert.get('relative_delta')} score={alert.get('score')}"
            )
    else:
        lines.append("- None")
    lines.extend([
        "",
        "## Notification",
        f"- Mode: `{snapshot['notification']['mode']}`",
        f"- New alerts: `{len(snapshot['new_alerts'])}`",
        "- No message or campaign changes are performed by this monitor.",
        "",
        "## Limitations",
        "- Provider failures and missing provider dates are reported explicitly and are never converted to zero.",
        "- Same-day GA4/Neon parity checks flag missing or materially divergent form, phone, and qualified WhatsApp events.",
        "- Vercel ISR/Fluid metrics require a configured read-only usage report source.",
        "- Google Ads metrics require a developer token, customer ID, and OAuth scope accepted by the API.",
    ])
    return "\n".join(lines) + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a daily Santi Living analytics anomaly snapshot")
    parser.add_argument("--env-file", default=os.environ.get("SANTI_OAUTH_ENV", "/Users/wecik/.hermes/profiles/don-santo/.env.mcp"))
    parser.add_argument("--output-dir", default="docs/seo/reports/anomaly")
    parser.add_argument("--target-date", default=None, help="YYYY-MM-DD; defaults to yesterday UTC")
    parser.add_argument("--lookback-days", type=int, default=DEFAULT_LOOKBACK_DAYS)
    parser.add_argument("--lead-metrics-url", default=os.environ.get("LEAD_METRICS_URL", DEFAULT_LEAD_METRICS_URL))
    parser.add_argument("--vercel-usage-url", default=os.environ.get("VERCEL_USAGE_REPORT_URL"))
    parser.add_argument("--vercel-usage-file", default=os.environ.get("VERCEL_USAGE_REPORT_FILE"))
    parser.add_argument("--alert-state-file", default=None)
    parser.add_argument("--fail-on-anomaly", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.lookback_days < 7:
        raise SystemExit("--lookback-days must be at least 7")
    repo_root = Path.cwd()
    load_env_file(Path(args.env_file).expanduser())
    load_env_file(repo_root / "apps/web-next/.env.local")

    today = dt.datetime.now(dt.timezone.utc).date()
    target = parse_date(args.target_date) if args.target_date else today - dt.timedelta(days=1)
    start = target - dt.timedelta(days=args.lookback_days)
    generated_at = dt.datetime.now(dt.timezone.utc).isoformat()

    token, oauth_meta = refresh_access_token()
    sources = {
        "ga4": collect_ga4(token, start, target),
        "neon": collect_neon(start, target, args.lead_metrics_url),
        "google_ads": collect_google_ads(token, start, target),
        "vercel": collect_vercel(start, target, args.vercel_usage_url, args.vercel_usage_file),
    }
    for source in sources.values():
        if source["status"] == "available":
            source["coverage"] = coverage_summary(source["daily"], start, target)

    checks: list[dict[str, Any]] = []
    definitions = metric_definitions()
    for source_name, metrics in definitions.items():
        source = sources[source_name]
        if source["status"] != "available":
            continue
        for metric_name, (field_name, min_volume) in metrics.items():
            checks.append(
                anomaly_check(
                    source_name,
                    metric_name,
                    filled_series(source["daily"], field_name, start, target),
                    target.isoformat(),
                    min_volume=min_volume,
                )
            )

    checks.extend(build_cross_source_checks(sources, target.isoformat()))

    alerts = [check for check in checks if check.get("status") == "anomaly"]
    output_dir = Path(args.output_dir).expanduser()
    output_dir.mkdir(parents=True, exist_ok=True)
    state_path = Path(args.alert_state_file).expanduser() if args.alert_state_file else output_dir / "alert-state.json"
    new_alerts = apply_alert_deduplication(alerts, state_path, generated_at)
    snapshot = {
        "ok": True,
        "generated_at_utc": generated_at,
        "target_date": target.isoformat(),
        "date_range": {"start": start.isoformat(), "end": target.isoformat()},
        "lookback_days": args.lookback_days,
        "oauth": {"ok": bool(token), "status": oauth_meta.get("status"), "error": oauth_meta.get("error")},
        "sources": sources,
        "checks": checks,
        "alerts": alerts,
        "new_alerts": new_alerts,
        "notification": {"mode": "dry_run", "sent": False},
    }
    stamp = target.isoformat()
    json_path = output_dir / f"analytics-anomaly-{stamp}.json"
    markdown_path = output_dir / f"analytics-anomaly-{stamp}.md"
    json_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n")
    markdown_path.write_text(build_markdown(snapshot))

    print(json.dumps({
        "ok": True,
        "json": str(json_path),
        "markdown": str(markdown_path),
        "target_date": target.isoformat(),
        "alerts": len(alerts),
        "new_alerts": len(new_alerts),
        "sources": {name: source["status"] for name, source in sources.items()},
    }, ensure_ascii=False, indent=2))
    return 2 if args.fail_on_anomaly and alerts else 0


if __name__ == "__main__":
    raise SystemExit(main())

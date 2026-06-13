#!/usr/bin/env python3
"""Generate Santi Living weekly SEO measurement snapshots.

Default mode is read-only: live HTTP checks + GSC Search Analytics + URL Inspection
+ GA4 landing/event aggregates + GBP coverage aggregates + content inventory.

Optional write flags exist for controlled launch days:
  --submit-sitemaps    submit the configured sitemap URLs to GSC
  --submit-indexing    publish URL_UPDATED notifications for canonical money pages

The script never prints OAuth tokens and avoids storing raw click identifiers from GA4.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

PROPERTY = "sc-domain:santiliving.com"
GA4_PROPERTY = "properties/519253158"
GBP_ACCOUNT = "accounts/116188520419140679581"
GBP_LOCATION = "locations/10488080858214395605"
LEAD_EXPORT_URL = "https://santiliving.com/api/lead/export"

MONEY_PAGES = [
    {
        "host": "karpet.santiliving.com",
        "cluster": "karpet",
        "url": "https://karpet.santiliving.com/sewa-karpet-jogja",
        "root_url": "https://karpet.santiliving.com/",
        "canonical": "https://karpet.santiliving.com/sewa-karpet-jogja",
        "cta_source": "sewa_karpet_jogja_page",
        "query_terms": [
            "sewa karpet jogja",
            "rental karpet jogja",
            "sewa karpet acara jogja",
            "sewa karpet pameran jogja",
            "sewa karpet merah jogja",
        ],
    },
    {
        "host": "permadani.santiliving.com",
        "cluster": "permadani",
        "url": "https://permadani.santiliving.com/sewa-karpet-permadani-jogja",
        "root_url": "https://permadani.santiliving.com/",
        "canonical": "https://permadani.santiliving.com/sewa-karpet-permadani-jogja",
        "cta_source": "permadani_page",
        "query_terms": [
            "sewa permadani jogja",
            "sewa karpet permadani jogja",
            "karpet pengajian jogja",
            "karpet tahlilan jogja",
            "permadani tamu jogja",
        ],
    },
    {
        "host": "acara.santiliving.com",
        "cluster": "acara",
        "url": "https://acara.santiliving.com/sewa-perlengkapan-event",
        "root_url": "https://acara.santiliving.com/",
        "canonical": "https://acara.santiliving.com/sewa-perlengkapan-event",
        "cta_source": "acara_santiliving_page",
        "query_terms": [
            "sewa perlengkapan event jogja",
            "sewa perlengkapan acara jogja",
            "sewa alat event jogja",
            "sewa perlengkapan eo jogja",
            "sewa rest area event jogja",
        ],
    },
]

SITEMAPS_TO_SUBMIT = [
    "https://santiliving.com/sitemap.xml",
    "https://santiliving.com/sitemap-0.xml",
    "https://karpet.santiliving.com/sitemap-0.xml",
    "https://permadani.santiliving.com/sitemap-0.xml",
    "https://acara.santiliving.com/sitemap-0.xml",
]

SUPPORTING_CONTENT_PATTERNS = {
    "karpet": ["karpet"],
    "permadani": ["permadani", "pengajian", "tahlilan"],
    "acara": ["event", "acara", "perlengkapan", "pameran", "seminar"],
}


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(errors="ignore").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def request_json(method: str, url: str, token: str | None = None, body: Any | None = None) -> dict[str, Any]:
    headers: dict[str, str] = {"User-Agent": "DonSanto SEO weekly dashboard/1.0"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            raw = resp.read().decode("utf-8", "ignore")
            parsed = json.loads(raw) if raw else None
            return {"ok": True, "status": resp.status, "body": parsed}
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", "ignore")
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = raw[:1500]
        return {"ok": False, "status": exc.code, "body": parsed}
    except Exception as exc:  # noqa: BLE001 - operational script records the exact failure
        return {"ok": False, "status": None, "body": repr(exc)}


def fetch_text(url: str) -> dict[str, Any]:
    req = urllib.request.Request(url, headers={"User-Agent": "DonSanto SEO weekly dashboard/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            text = resp.read().decode("utf-8", "ignore")
            return {
                "ok": True,
                "status": resp.status,
                "server": resp.headers.get("server"),
                "x_matched_path": resp.headers.get("x-matched-path"),
                "text": text,
            }
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "status": None, "error": repr(exc), "text": ""}


def refresh_access_token() -> tuple[str | None, dict[str, Any]]:
    required = ["GBP_CLIENT_ID", "GBP_CLIENT_SECRET", "GBP_REFRESH_TOKEN"]
    missing = [key for key in required if not os.environ.get(key)]
    if missing:
        return None, {"ok": False, "error": f"missing env: {', '.join(missing)}"}

    data = urllib.parse.urlencode(
        {
            "client_id": os.environ["GBP_CLIENT_ID"],
            "client_secret": os.environ["GBP_CLIENT_SECRET"],
            "refresh_token": os.environ["GBP_REFRESH_TOKEN"],
            "grant_type": "refresh_token",
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            token = json.load(resp)
        return token.get("access_token"), {
            "ok": bool(token.get("access_token")),
            "scope": token.get("scope", ""),
            "expires_in": token.get("expires_in"),
        }
    except urllib.error.HTTPError as exc:
        return None, {"ok": False, "status": exc.code, "body": exc.read().decode("utf-8", "ignore")[:1200]}
    except Exception as exc:  # noqa: BLE001
        return None, {"ok": False, "error": repr(exc)}


def extract_html_evidence(html: str) -> dict[str, Any]:
    def match(pattern: str) -> str | None:
        m = re.search(pattern, html, re.I | re.S)
        if not m:
            return None
        return re.sub(r"\s+", " ", m.group(1)).strip()

    h1_raw = match(r"<h1[^>]*>(.*?)</h1>")
    h1 = re.sub(r"<[^>]+>", " ", h1_raw).strip() if h1_raw else None
    return {
        "title": match(r"<title>(.*?)</title>"),
        "canonical": match(r"<link[^>]+rel=[\"']canonical[\"'][^>]+href=[\"']([^\"']+)")
        or match(r"<link[^>]+href=[\"']([^\"']+)[\"'][^>]+rel=[\"']canonical[\"']"),
        "og_url": match(r"<meta[^>]+property=[\"']og:url[\"'][^>]+content=[\"']([^\"']+)")
        or match(r"<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+property=[\"']og:url[\"']"),
        "h1": h1,
    }


def live_http_snapshot() -> dict[str, Any]:
    snapshot: dict[str, Any] = {"pages": [], "sitemaps": [], "robots": []}
    for page in MONEY_PAGES:
        fetched = fetch_text(page["url"])
        html = fetched.pop("text", "")
        evidence = extract_html_evidence(html)
        snapshot["pages"].append(
            {
                "host": page["host"],
                "url": page["url"],
                "expected_canonical": page["canonical"],
                "expected_cta_source": page["cta_source"],
                **fetched,
                **evidence,
                "canonical_matches": evidence.get("canonical") == page["canonical"],
                "og_url_matches": evidence.get("og_url") == page["canonical"],
                "cta_source_present": f'data-wa-source="{page["cta_source"]}"' in html,
            }
        )
    for url in SITEMAPS_TO_SUBMIT:
        fetched = fetch_text(url)
        text = fetched.pop("text", "")
        snapshot["sitemaps"].append(
            {
                "url": url,
                **fetched,
                "contains_money_pages": {
                    page["canonical"]: page["canonical"] in text for page in MONEY_PAGES
                },
                "is_sitemap_index": "<sitemapindex" in text[:1000].lower(),
                "is_urlset": "<urlset" in text[:1000].lower(),
            }
        )
    for host in ["santiliving.com", "karpet.santiliving.com", "permadani.santiliving.com", "acara.santiliving.com"]:
        url = f"https://{host}/robots.txt"
        fetched = fetch_text(url)
        text = fetched.pop("text", "")
        snapshot["robots"].append(
            {
                "url": url,
                **fetched,
                "sitemap_lines": [line.strip() for line in text.splitlines() if line.lower().startswith("sitemap:")],
            }
        )
    return snapshot


def gsc_endpoint(path: str) -> str:
    return f"https://searchconsole.googleapis.com/webmasters/v3/sites/{urllib.parse.quote(PROPERTY, safe='')}/{path}"


def gsc_sitemap_list(token: str) -> dict[str, Any]:
    return request_json("GET", gsc_endpoint("sitemaps"), token)


def submit_sitemaps(token: str) -> list[dict[str, Any]]:
    submissions = []
    for sitemap in SITEMAPS_TO_SUBMIT:
        endpoint = gsc_endpoint(f"sitemaps/{urllib.parse.quote(sitemap, safe='')}")
        response = request_json("PUT", endpoint, token)
        submissions.append({"sitemap": sitemap, **response})
    return submissions


def submit_indexing(token: str) -> list[dict[str, Any]]:
    submissions = []
    for page in MONEY_PAGES:
        response = request_json(
            "POST",
            "https://indexing.googleapis.com/v3/urlNotifications:publish",
            token,
            {"url": page["url"], "type": "URL_UPDATED"},
        )
        body = response.get("body") if isinstance(response.get("body"), dict) else {}
        metadata = (body or {}).get("urlNotificationMetadata", {})
        submissions.append(
            {
                "url": page["url"],
                "type": "URL_UPDATED",
                "metadata_url": metadata.get("url"),
                **response,
            }
        )
    return submissions


def url_inspections(token: str) -> list[dict[str, Any]]:
    inspected = []
    urls = []
    for page in MONEY_PAGES:
        urls.append((page["cluster"], page["url"], "canonical_money_page"))
    for page in MONEY_PAGES:
        urls.append((page["cluster"], page["root_url"], "root_entry_probe"))
    for cluster, url, kind in urls:
        response = request_json(
            "POST",
            "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
            token,
            {"inspectionUrl": url, "siteUrl": PROPERTY, "languageCode": "id-ID"},
        )
        body = response.get("body") if isinstance(response.get("body"), dict) else {}
        status = (((body or {}).get("inspectionResult") or {}).get("indexStatusResult") or {})
        inspected.append(
            {
                "cluster": cluster,
                "kind": kind,
                "url": url,
                "ok": response.get("ok"),
                "status": response.get("status"),
                "coverage_state": status.get("coverageState"),
                "verdict": status.get("verdict"),
                "robots_txt_state": status.get("robotsTxtState"),
                "indexing_state": status.get("indexingState"),
                "page_fetch_state": status.get("pageFetchState"),
                "google_canonical": status.get("googleCanonical"),
                "user_canonical": status.get("userCanonical"),
                "last_crawl_time": status.get("lastCrawlTime"),
                "inspection_result_link": (((body or {}).get("inspectionResult") or {}).get("inspectionResultLink")),
            }
        )
    return inspected


def gsc_query_rows(token: str, start_date: str, end_date: str) -> dict[str, Any]:
    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["query", "page"],
        "rowLimit": 1000,
        "startRow": 0,
    }
    return request_json("POST", gsc_endpoint("searchAnalytics/query"), token, body)


def classify_query(query: str, page_url: str) -> str | None:
    q = query.lower()
    p = page_url.lower()
    for page in MONEY_PAGES:
        if page["canonical"].lower() in p or page["host"].lower() in p:
            return page["cluster"]
        if any(term in q for term in page["query_terms"]):
            return page["cluster"]
    return None


def summarize_gsc_clusters(rows: list[dict[str, Any]]) -> dict[str, Any]:
    clusters: dict[str, dict[str, Any]] = {
        page["cluster"]: {"clicks": 0.0, "impressions": 0.0, "weighted_position_sum": 0.0, "queries": {}}
        for page in MONEY_PAGES
    }
    for row in rows:
        keys = row.get("keys", [])
        query = keys[0] if len(keys) > 0 else ""
        page_url = keys[1] if len(keys) > 1 else ""
        cluster = classify_query(query, page_url)
        if not cluster:
            continue
        clicks = float(row.get("clicks", 0) or 0)
        impressions = float(row.get("impressions", 0) or 0)
        position = float(row.get("position", 0) or 0)
        bucket = clusters[cluster]
        bucket["clicks"] += clicks
        bucket["impressions"] += impressions
        bucket["weighted_position_sum"] += position * impressions
        qstats = bucket["queries"].setdefault(query, {"clicks": 0.0, "impressions": 0.0, "weighted_position_sum": 0.0})
        qstats["clicks"] += clicks
        qstats["impressions"] += impressions
        qstats["weighted_position_sum"] += position * impressions
    out: dict[str, Any] = {}
    for cluster, stats in clusters.items():
        impressions = stats["impressions"]
        top_queries = []
        for query, qstats in stats["queries"].items():
            qi = qstats["impressions"]
            top_queries.append(
                {
                    "query": query,
                    "clicks": qstats["clicks"],
                    "impressions": qi,
                    "ctr": (qstats["clicks"] / qi) if qi else 0,
                    "avg_position": (qstats["weighted_position_sum"] / qi) if qi else None,
                }
            )
        top_queries.sort(key=lambda item: (item["impressions"], item["clicks"]), reverse=True)
        out[cluster] = {
            "clicks": stats["clicks"],
            "impressions": impressions,
            "ctr": (stats["clicks"] / impressions) if impressions else 0,
            "avg_position": (stats["weighted_position_sum"] / impressions) if impressions else None,
            "top_queries": top_queries[:10],
        }
    return out


def ga4_run_report(token: str, body: dict[str, Any]) -> dict[str, Any]:
    return request_json(
        "POST",
        f"https://analyticsdata.googleapis.com/v1beta/{GA4_PROPERTY}:runReport",
        token,
        body,
    )


def redact_url_to_path(url: str) -> str:
    try:
        parsed = urllib.parse.urlparse(url)
        return parsed.path or "/"
    except Exception:  # noqa: BLE001
        return url.split("?", 1)[0]


def ga4_snapshot(token: str) -> dict[str, Any]:
    landing_response = ga4_run_report(
        token,
        {
            "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
            "dimensions": [{"name": "landingPagePlusQueryString"}, {"name": "sessionSourceMedium"}],
            "metrics": [{"name": "sessions"}, {"name": "engagedSessions"}],
            "dimensionFilter": {
                "filter": {
                    "fieldName": "landingPagePlusQueryString",
                    "stringFilter": {"matchType": "PARTIAL_REGEXP", "value": "sewa-karpet|sewa-perlengkapan-event|^/$"},
                }
            },
            "limit": 100,
        },
    )
    event_response = ga4_run_report(
        token,
        {
            "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
            "dimensions": [{"name": "eventName"}, {"name": "pageLocation"}, {"name": "sessionSourceMedium"}],
            "metrics": [{"name": "eventCount"}],
            "dimensionFilter": {
                "filter": {
                    "fieldName": "eventName",
                    "stringFilter": {"matchType": "EXACT", "value": "whatsapp_click"},
                }
            },
            "limit": 100,
        },
    )
    cta_dimension_probe = ga4_run_report(
        token,
        {
            "dateRanges": [{"startDate": "28daysAgo", "endDate": "yesterday"}],
            "dimensions": [{"name": "eventName"}, {"name": "customEvent:cta_source"}],
            "metrics": [{"name": "eventCount"}],
            "dimensionFilter": {
                "filter": {
                    "fieldName": "eventName",
                    "stringFilter": {"matchType": "EXACT", "value": "whatsapp_click"},
                }
            },
            "limit": 10,
        },
    )

    landing_rows = []
    if landing_response.get("ok"):
        for row in (landing_response.get("body") or {}).get("rows", []):
            dims = [d.get("value") for d in row.get("dimensionValues", [])]
            metrics = [m.get("value") for m in row.get("metricValues", [])]
            landing_rows.append(
                {
                    "landing_page": redact_url_to_path(dims[0] if len(dims) > 0 else ""),
                    "source_medium": dims[1] if len(dims) > 1 else "",
                    "sessions": int(float(metrics[0])) if len(metrics) > 0 else 0,
                    "engaged_sessions": int(float(metrics[1])) if len(metrics) > 1 else 0,
                }
            )
    event_rows = []
    if event_response.get("ok"):
        for row in (event_response.get("body") or {}).get("rows", []):
            dims = [d.get("value") for d in row.get("dimensionValues", [])]
            metrics = [m.get("value") for m in row.get("metricValues", [])]
            event_rows.append(
                {
                    "event_name": dims[0] if len(dims) > 0 else "",
                    "page_path": redact_url_to_path(dims[1] if len(dims) > 1 else ""),
                    "source_medium": dims[2] if len(dims) > 2 else "",
                    "event_count": int(float(metrics[0])) if metrics else 0,
                }
            )
    return {
        "landing_sessions_28d": landing_rows,
        "whatsapp_clicks_28d_by_page": event_rows,
        "cta_source_custom_dimension_probe": {
            "ok": cta_dimension_probe.get("ok"),
            "status": cta_dimension_probe.get("status"),
            "message": ((cta_dimension_probe.get("body") or {}).get("error") or {}).get("message")
            if isinstance(cta_dimension_probe.get("body"), dict)
            else cta_dimension_probe.get("body"),
        },
    }


def top_counts(rows: list[dict[str, Any]], field: str, *, limit: int = 12) -> list[dict[str, Any]]:
    counts: dict[str, int] = {}
    for row in rows:
        value = row.get(field)
        key = str(value).strip() if value not in (None, "") else "(not set)"
        if field == "landing_page":
            key = redact_url_to_path(key)
        counts[key] = counts.get(key, 0) + 1
    return [
        {field: key, "event_count": count}
        for key, count in sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:limit]
    ]


def source_medium_counts(rows: list[dict[str, Any]], *, limit: int = 12) -> list[dict[str, Any]]:
    counts: dict[tuple[str, str], int] = {}
    for row in rows:
        source = str(row.get("source") or "(not set)").strip() or "(not set)"
        medium = str(row.get("medium") or "(not set)").strip() or "(not set)"
        key = (source, medium)
        counts[key] = counts.get(key, 0) + 1
    return [
        {"source": source, "medium": medium, "event_count": count}
        for (source, medium), count in sorted(counts.items(), key=lambda item: (-item[1], item[0][0], item[0][1]))[:limit]
    ]


def lead_export_snapshot(start_date: str, end_date: str) -> dict[str, Any]:
    """Read sanitized lead attribution aggregates from the website export endpoint.

    The endpoint returns row-level lead data; this function deliberately stores only
    aggregate counts so cron artifacts never contain event IDs, coordinates, raw click
    IDs, user agents, referrers, or other customer-level data.
    """
    token = os.environ.get("LEAD_EVENTS_ADMIN_TOKEN")
    if not token:
        return {"ok": False, "reason": "missing LEAD_EVENTS_ADMIN_TOKEN"}

    query = urllib.parse.urlencode(
        {
            "from": start_date,
            "to": end_date,
            "event_type": "whatsapp_click",
            "limit": "1000",
            "format": "json",
        }
    )
    response = request_json("GET", f"{LEAD_EXPORT_URL}?{query}", token)
    if not response.get("ok"):
        body = response.get("body")
        message = ((body or {}).get("error") or {}).get("message") if isinstance(body, dict) else body
        return {"ok": False, "status": response.get("status"), "message": message}

    body_obj = response.get("body")
    body: dict[str, Any] = {}
    if isinstance(body_obj, dict):
        body = body_obj
    rows = [row for row in body.get("rows", []) if isinstance(row, dict)]
    return {
        "ok": True,
        "status": response.get("status"),
        "event_name": "whatsapp_click",
        "rows_returned": len(rows),
        "reported_count": body.get("count"),
        "by_cta_source": top_counts(rows, "cta_source"),
        "by_landing_page": top_counts(rows, "landing_page"),
        "by_city_classification": top_counts(rows, "city_classification"),
        "by_product_category": top_counts(rows, "product_category"),
        "by_page_type": top_counts(rows, "page_type"),
        "by_source_medium": source_medium_counts(rows),
    }


def gbp_snapshot(token: str) -> dict[str, Any]:
    location_url = (
        f"https://mybusinessbusinessinformation.googleapis.com/v1/{GBP_ACCOUNT}/locations"
        "?readMask=name,title,storefrontAddress,websiteUri,phoneNumbers,categories,metadata"
    )
    location = request_json("GET", location_url, token)
    reviews = request_json(
        "GET",
        f"https://mybusiness.googleapis.com/v4/{GBP_ACCOUNT}/{GBP_LOCATION}/reviews?pageSize=50",
        token,
    )
    posts = request_json(
        "GET",
        f"https://mybusiness.googleapis.com/v4/{GBP_ACCOUNT}/{GBP_LOCATION}/localPosts?pageSize=100",
        token,
    )
    review_summary: dict[str, Any] = {"ok": reviews.get("ok"), "status": reviews.get("status")}
    if reviews.get("ok"):
        rows = (reviews.get("body") or {}).get("reviews", [])
        review_summary.update(
            {
                "returned": len(rows),
                "with_reply": sum(1 for item in rows if item.get("reviewReply")),
                "without_reply": sum(1 for item in rows if not item.get("reviewReply")),
                "latest_create_time": max([item.get("createTime", "") for item in rows] or [""]),
            }
        )
    post_summary: dict[str, Any] = {"ok": posts.get("ok"), "status": posts.get("status")}
    if posts.get("ok"):
        rows = (posts.get("body") or {}).get("localPosts", [])
        post_summary.update(
            {
                "returned": len(rows),
                "live": sum(1 for item in rows if item.get("state") == "LIVE"),
                "latest_create_time": max([item.get("createTime", "") for item in rows] or [""]),
                "latest_post_ids": [item.get("name", "").rsplit("/", 1)[-1] for item in rows[:5]],
            }
        )
    location_summary: dict[str, Any] = {"ok": location.get("ok"), "status": location.get("status")}
    if location.get("ok"):
        locs = (location.get("body") or {}).get("locations", [])
        if locs:
            first = locs[0]
            location_summary.update(
                {
                    "name": first.get("name"),
                    "title": first.get("title"),
                    "primary_phone_present": bool((first.get("phoneNumbers") or {}).get("primaryPhone")),
                    "website_uri": first.get("websiteUri"),
                    "primary_category": ((first.get("categories") or {}).get("primaryCategory") or {}).get("displayName"),
                }
            )
    return {"location": location_summary, "reviews": review_summary, "posts": post_summary}


def content_inventory(repo_root: Path) -> dict[str, Any]:
    blog_dir = repo_root / "apps/web-next/src/content/blog"
    files = sorted(blog_dir.glob("*.md")) if blog_dir.exists() else []
    inventory: dict[str, Any] = {cluster: [] for cluster in SUPPORTING_CONTENT_PATTERNS}
    for path in files:
        text = path.read_text(errors="ignore").lower()
        haystack = f"{path.name.lower()}\n{text[:5000]}"
        for cluster, terms in SUPPORTING_CONTENT_PATTERNS.items():
            if any(term in haystack for term in terms):
                inventory[cluster].append(str(path.relative_to(repo_root)))
    return {
        "blog_dir": str(blog_dir),
        "total_blog_files": len(files),
        "supporting_content_counts": {cluster: len(paths) for cluster, paths in inventory.items()},
        "sample_supporting_content": {cluster: paths[:12] for cluster, paths in inventory.items()},
    }


def write_markdown(snapshot: dict[str, Any], output_path: Path) -> None:
    lines: list[str] = []
    lines.append("# Santi Living Weekly SEO Dashboard Snapshot")
    lines.append("")
    lines.append(f"Generated UTC: `{snapshot['generated_at_utc']}`")
    lines.append(f"Window: `{snapshot['date_range']['start']}` to `{snapshot['date_range']['end']}`")
    lines.append(f"GSC property: `{PROPERTY}`")
    lines.append("")
    lines.append("## DONE")
    lines.append("- Live technical checks executed for karpet, permadani, and acara money pages.")
    lines.append("- GSC sitemap list, Search Analytics, and URL Inspection API checks executed when OAuth succeeded.")
    lines.append("- GA4 landing/session and WhatsApp event aggregates queried when OAuth succeeded.")
    lines.append("- GBP location/review/post coverage queried without storing reviewer names or comments.")
    if snapshot.get("write_actions"):
        lines.append("- Controlled write actions were requested in this run; see JSON artifact for exact status.")
    lines.append("")
    lines.append("## GSC query clusters")
    for cluster, stats in (snapshot.get("gsc") or {}).get("cluster_summary", {}).items():
        lines.append(
            f"- {cluster}: clicks={stats['clicks']:.0f}, impressions={stats['impressions']:.0f}, "
            f"ctr={stats['ctr']:.2%}, avg_position={stats['avg_position'] if stats['avg_position'] is not None else 'n/a'}"
        )
    lines.append("")
    lines.append("## Indexing and canonical")
    for item in (snapshot.get("gsc") or {}).get("url_inspections", []):
        lines.append(
            f"- {item['cluster']} {item['kind']}: `{item['url']}` -> {item.get('coverage_state')}; "
            f"googleCanonical={item.get('google_canonical') or 'n/a'}"
        )
    lines.append("")
    lines.append("## GA4 and lead attribution")
    probe = (snapshot.get("ga4") or {}).get("cta_source_custom_dimension_probe", {})
    lead_export = snapshot.get("lead_export") or {}
    lines.append(f"- GA4 custom dimension probe for `customEvent:cta_source`: ok={probe.get('ok')} status={probe.get('status')}")
    lines.append("- GA4 page URLs in this markdown are redacted to path only; full JSON also avoids raw gclid/gbraid/wbraid values.")
    if lead_export.get("ok"):
        lines.append(
            f"- Lead export fallback `/api/lead/export`: ok=True; "
            f"whatsapp_click rows={lead_export.get('rows_returned', 0)}; "
            "used as the `cta_source` source of truth while GA4 custom dimensions are absent."
        )
        for item in (lead_export.get("by_cta_source") or [])[:6]:
            lines.append(f"  - cta_source `{item.get('cta_source')}`: {item.get('event_count')} events")
    else:
        reason = lead_export.get("reason") or lead_export.get("message") or "unavailable"
        lines.append(f"- Lead export fallback `/api/lead/export`: ok=False status={lead_export.get('status')} reason={reason}")
    lines.append("")
    lines.append("## GBP coverage")
    gbp = snapshot.get("gbp") or {}
    lines.append(f"- Reviews returned: {(gbp.get('reviews') or {}).get('returned', 'n/a')}; without reply: {(gbp.get('reviews') or {}).get('without_reply', 'n/a')}")
    lines.append(f"- Local posts returned: {(gbp.get('posts') or {}).get('returned', 'n/a')}; live: {(gbp.get('posts') or {}).get('live', 'n/a')}")
    lines.append("")
    lines.append("## PENDING")
    pending = []
    for item in (snapshot.get("gsc") or {}).get("url_inspections", []):
        coverage = item.get("coverage_state") or ""
        if "tidak diindeks" in coverage.lower() or "tidak dikenali" in coverage.lower():
            pending.append(f"`{item['url']}` still reports `{coverage}`")
    if pending:
        lines.extend(f"- {item}" for item in pending)
    else:
        lines.append("PENDING: none")
    lines.append("")
    lines.append("## BLOCKED")
    blockers = []
    lead_export_ok = (snapshot.get("lead_export") or {}).get("ok") is True
    if probe.get("ok") is False and not lead_export_ok:
        blockers.append("GA4 `customEvent:cta_source` is not queryable yet and `/api/lead/export` fallback is unavailable; register event-scoped custom dimensions for cta_source, cta_location, product_category, page_type, and intent, or restore the lead export endpoint/token.")
    if blockers:
        lines.extend(f"- {item}" for item in blockers)
    else:
        lines.append("BLOCKED: none")
    lines.append("")
    output_path.write_text("\n".join(lines) + "\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate weekly Santi Living SEO dashboard snapshot")
    parser.add_argument("--env-file", default=os.environ.get("SANTI_OAUTH_ENV", "/Users/wecik/.hermes/profiles/don-santo/.env.mcp"))
    parser.add_argument("--output-dir", default="docs/SEO/Reports/weekly")
    parser.add_argument("--start-date", default=None, help="YYYY-MM-DD; defaults to 28 days before yesterday")
    parser.add_argument("--end-date", default=None, help="YYYY-MM-DD; defaults to yesterday (UTC)")
    parser.add_argument("--submit-sitemaps", action="store_true", help="WRITE: submit configured sitemap URLs to GSC")
    parser.add_argument("--submit-indexing", action="store_true", help="WRITE: publish URL_UPDATED notifications for canonical money pages")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path.cwd()
    load_env_file(Path(args.env_file).expanduser())
    load_env_file(repo_root / "apps/web-next/.env.local")
    today = dt.datetime.now(dt.timezone.utc).date()
    end = dt.date.fromisoformat(args.end_date) if args.end_date else today - dt.timedelta(days=1)
    start = dt.date.fromisoformat(args.start_date) if args.start_date else end - dt.timedelta(days=27)

    token, token_meta = refresh_access_token()
    snapshot: dict[str, Any] = {
        "generated_at_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "date_range": {"start": start.isoformat(), "end": end.isoformat()},
        "property": PROPERTY,
        "ga4_property": GA4_PROPERTY,
        "targets": MONEY_PAGES,
        "oauth": token_meta,
        "live_http": live_http_snapshot(),
        "content": content_inventory(repo_root),
        "write_actions": {},
    }

    if not token:
        snapshot["gsc"] = {"error": "OAuth token unavailable", "details": token_meta}
        snapshot["ga4"] = {"error": "OAuth token unavailable", "details": token_meta}
        snapshot["gbp"] = {"error": "OAuth token unavailable", "details": token_meta}
    else:
        if args.submit_sitemaps:
            snapshot["write_actions"]["sitemap_submissions"] = submit_sitemaps(token)
        if args.submit_indexing:
            snapshot["write_actions"]["indexing_api_submissions"] = submit_indexing(token)

        gsc_rows_response = gsc_query_rows(token, start.isoformat(), end.isoformat())
        gsc_rows = []
        if gsc_rows_response.get("ok"):
            gsc_rows = (gsc_rows_response.get("body") or {}).get("rows", [])
        snapshot["gsc"] = {
            "sitemaps": gsc_sitemap_list(token),
            "search_analytics_response_ok": gsc_rows_response.get("ok"),
            "search_analytics_status": gsc_rows_response.get("status"),
            "cluster_summary": summarize_gsc_clusters(gsc_rows),
            "url_inspections": url_inspections(token),
        }
        if not gsc_rows_response.get("ok"):
            snapshot["gsc"]["search_analytics_error"] = gsc_rows_response.get("body")
        snapshot["ga4"] = ga4_snapshot(token)
        snapshot["gbp"] = gbp_snapshot(token)

    snapshot["lead_export"] = lead_export_snapshot(start.isoformat(), end.isoformat())

    out_dir = (repo_root / args.output_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    json_path = out_dir / f"seo-weekly-dashboard-{stamp}.json"
    md_path = out_dir / f"seo-weekly-dashboard-{stamp}.md"
    json_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n")
    write_markdown(snapshot, md_path)

    print(
        json.dumps(
            {
                "ok": True,
                "json": str(json_path),
                "markdown": str(md_path),
                "date_range": snapshot["date_range"],
                "gsc_clusters": (snapshot.get("gsc") or {}).get("cluster_summary"),
                "ga4_cta_source_probe": (snapshot.get("ga4") or {}).get("cta_source_custom_dimension_probe"),
                "lead_export_summary": {
                    "ok": (snapshot.get("lead_export") or {}).get("ok"),
                    "rows_returned": (snapshot.get("lead_export") or {}).get("rows_returned"),
                },
                "gbp_summary": snapshot.get("gbp"),
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

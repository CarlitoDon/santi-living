#!/usr/bin/env bash
set -euo pipefail

REPO="/Users/wecik/Documents/Offline/Professional/Coding/santi-living"
ENV_FILE="/Users/wecik/.hermes/profiles/don-santo/.env.mcp"
OUTPUT_DIR="/Users/wecik/.hermes/profiles/don-santo/reports/santi-living/seo-weekly"

cd "$REPO"
mkdir -p "$OUTPUT_DIR"

RUN_JSON_OUTPUT="$(python3 scripts/seo_weekly_dashboard.py --env-file "$ENV_FILE" --output-dir "$OUTPUT_DIR")"
printf '%s\n' "$RUN_JSON_OUTPUT" > "$OUTPUT_DIR/latest-cron-output.json"

python3 - "$OUTPUT_DIR/latest-cron-output.json" <<'PY'
from __future__ import annotations

import json
import sys
from pathlib import Path

summary_path = Path(sys.argv[1])
summary = json.loads(summary_path.read_text())
md_path = Path(summary["markdown"])
print("Santi Living Weekly SEO Dashboard")
print(f"JSON: {summary['json']}")
print(f"Markdown: {summary['markdown']}")
print(f"Window: {summary['date_range']['start']} to {summary['date_range']['end']}")
print("")
print(md_path.read_text())
PY

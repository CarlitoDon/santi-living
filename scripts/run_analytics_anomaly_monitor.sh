#!/usr/bin/env bash
set -euo pipefail

REPO="/Users/wecik/Documents/Offline/Professional/Coding/santi-living"
ENV_FILE="/Users/wecik/.hermes/profiles/don-santo/.env.mcp"
OUTPUT_DIR="/Users/wecik/.hermes/profiles/don-santo/reports/santi-living/analytics-anomaly"

cd "$REPO"
mkdir -p "$OUTPUT_DIR"

python3 scripts/analytics_anomaly_monitor.py \
  --env-file "$ENV_FILE" \
  --output-dir "$OUTPUT_DIR" \
  "$@"

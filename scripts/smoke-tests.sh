#!/usr/bin/env bash
set -euo pipefail

BACKEND_URL=${BACKEND_URL:-http://localhost:8000}
FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}
PYTEST_TARGET=${PYTEST_TARGET:-backend/tests/smoke}

printf '🔍 Running smoke checks against %s and %s\n' "$BACKEND_URL" "$FRONTEND_URL"

backend_payload=$(curl -fsSL "${BACKEND_URL%/}/health")
PAYLOAD="$backend_payload" python - <<'PYTHON'
import json, os
json.loads(os.environ["PAYLOAD"])
PYTHON
curl -fsSL "${FRONTEND_URL%/}/" >/dev/null

printf '✅ HTTP endpoints responded successfully\n'

pytest "$PYTEST_TARGET"

#!/bin/sh
set -eu

TEMPLATE="/etc/nginx/templates/default.conf.template"
TARGET="/etc/nginx/conf.d/default.conf"

if [ ! -f "$TEMPLATE" ]; then
  echo "Template ${TEMPLATE} missing" >&2
  exit 1
fi

: "${BACKEND_SERVICE_URL:=http://backend:8000}"
: "${VITE_REACT_APP_API_BASE:=/api}"

API_PROXY_PATH="$VITE_REACT_APP_API_BASE"

if printf '%s' "$API_PROXY_PATH" | grep -Eq '^[a-zA-Z]+://'; then
  echo "WARN: VITE_REACT_APP_API_BASE includes scheme/host; defaulting proxy path to /api" >&2
  API_PROXY_PATH="/api"
fi

case "$API_PROXY_PATH" in
  "")
    API_PROXY_PATH="/api"
    ;;
  /*)
    ;;
  *)
    API_PROXY_PATH="/$API_PROXY_PATH"
    ;;
esac

API_PROXY_PATH="${API_PROXY_PATH%/}"
[ -z "$API_PROXY_PATH" ] && API_PROXY_PATH="/api"

export BACKEND_SERVICE_URL API_PROXY_PATH

envsubst '${BACKEND_SERVICE_URL} ${API_PROXY_PATH}' < "$TEMPLATE" > "$TARGET"

echo "Resolved backend=${BACKEND_SERVICE_URL} apiBase=${VITE_REACT_APP_API_BASE} proxyPath=${API_PROXY_PATH}"

exec "$@"

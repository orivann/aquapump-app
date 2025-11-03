#!/bin/sh
set -eu

TEMPLATE="/etc/nginx/templates/default.conf.template"
TARGET="/etc/nginx/conf.d/default.conf"

if [ ! -f "$TEMPLATE" ]; then
  echo "Template ${TEMPLATE} missing" >&2
  exit 1
fi

: "${BACKEND_SERVICE_URL:=http://backend:8000}"

envsubst '${BACKEND_SERVICE_URL}' < "$TEMPLATE" > "$TARGET"

exec "$@"

#!/usr/bin/env python3
"""Simple end-to-end health check for AquaPump services."""

from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Any, Tuple
from urllib import error, parse, request

DEFAULT_TIMEOUT = float(os.getenv("HEALTH_CHECK_TIMEOUT", "5"))
DEFAULT_BACKEND_BASE = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")
DEFAULT_FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def fetch(url: str, timeout: float) -> Tuple[int, bytes]:
    req = request.Request(url, headers={"User-Agent": "aquapump-health-check/1.0"})
    with request.urlopen(req, timeout=timeout) as response:  # noqa: S310 (URL controlled via CLI/env)
        return response.status, response.read()


def check_backend(backend_base: str, timeout: float) -> tuple[bool, str, bool, str]:
    health_url = parse.urljoin(backend_base.rstrip("/") + "/", "health?include=dependencies")
    try:
        status_code, body = fetch(health_url, timeout)
    except error.URLError as exc:
        return False, f"health endpoint unreachable: {exc}", False, "database status unknown"

    if status_code >= 400:
        return False, f"health endpoint returned HTTP {status_code}", False, "database check not attempted"

    try:
        payload = json.loads(body.decode("utf-8"))
    except json.JSONDecodeError as exc:
        return False, f"invalid JSON response: {exc}", False, "database check not available"

    backend_ok = payload.get("status") == "ok"
    backend_message = payload.get("status", "unknown")

    database_payload: dict[str, Any] = payload.get("checks", {}).get("database", {}) or {}
    database_ok = database_payload.get("status") == "ok"
    database_message = database_payload.get("status", "unknown")
    detail = database_payload.get("detail")
    if detail and database_ok is False:
        database_message = f"{database_message}: {detail}"

    return backend_ok, backend_message, database_ok, database_message


def check_frontend(frontend_url: str, timeout: float) -> tuple[bool, str]:
    try:
        status_code, _ = fetch(frontend_url, timeout)
    except error.URLError as exc:
        return False, f"unreachable: {exc}"

    if status_code >= 400:
        return False, f"returned HTTP {status_code}"
    return True, "reachable"


def main() -> int:
    parser = argparse.ArgumentParser(description="Run AquaPump health checks.")
    parser.add_argument("--backend-base", default=DEFAULT_BACKEND_BASE, help="Backend base URL (default: %(default)s)")
    parser.add_argument("--frontend-url", default=DEFAULT_FRONTEND_URL, help="Frontend URL (default: %(default)s)")
    parser.add_argument(
        "--timeout",
        type=float,
        default=DEFAULT_TIMEOUT,
        help="Request timeout in seconds (default: %(default)s)",
    )
    args = parser.parse_args()

    backend_ok, backend_msg, database_ok, database_msg = check_backend(args.backend_base, args.timeout)
    frontend_ok, frontend_msg = check_frontend(args.frontend_url, args.timeout)

    print(f"[{'PASS' if backend_ok else 'FAIL'}] Backend API   -> {backend_msg}")
    print(f"[{'PASS' if database_ok else 'FAIL'}] Database      -> {database_msg}")
    print(f"[{'PASS' if frontend_ok else 'FAIL'}] Frontend      -> {frontend_msg}")

    return 0 if backend_ok and database_ok and frontend_ok else 1


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Normalize an Argo CD server address for argocd CLI usage."""
from __future__ import annotations

import sys
from urllib.parse import urlparse


def normalize(raw: str) -> str:
    raw = raw.strip()
    if not raw:
        raise SystemExit("ARGOCD_SERVER secret is empty")

    parsed = urlparse(raw if "://" in raw else f"//{raw}")

    host = parsed.hostname or parsed.path.split("/")[0]
    if not host:
        raise SystemExit(f"Unable to determine host from address: {raw}")

    port = parsed.port
    scheme = parsed.scheme.lower()

    if port is None:
        if scheme == "http":
            port = 80
        elif scheme in {"https", ""}:
            port = 443
        elif scheme == "tcp":
            port = 443
        elif scheme == "grpc":
            port = 9090

    return f"{host}:{port}" if port else host


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: normalize_argocd_server.py <address>")
    print(normalize(sys.argv[1]))


if __name__ == "__main__":
    main()

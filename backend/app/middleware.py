from __future__ import annotations

from collections.abc import Awaitable, Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp


class SecureHeadersMiddleware(BaseHTTPMiddleware):
    """Add a hardened set of security headers to every response."""

    def __init__(
        self,
        app: ASGIApp,
        *,
        referrer_policy: str,
        permissions_policy: str | None,
        content_security_policy: str | None,
        enable_hsts: bool,
        hsts_max_age: int,
    ) -> None:
        super().__init__(app)
        self.referrer_policy = referrer_policy
        self.permissions_policy = permissions_policy
        self.content_security_policy = content_security_policy
        self.enable_hsts = enable_hsts and hsts_max_age > 0
        self.hsts_max_age = hsts_max_age

    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        response = await call_next(request)

        response.headers.setdefault("Referrer-Policy", self.referrer_policy)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("X-XSS-Protection", "1; mode=block")

        if self.permissions_policy:
            response.headers.setdefault("Permissions-Policy", self.permissions_policy)

        if self.content_security_policy:
            response.headers.setdefault("Content-Security-Policy", self.content_security_policy)

        if self.enable_hsts:
            response.headers.setdefault(
                "Strict-Transport-Security",
                f"max-age={self.hsts_max_age}; includeSubDomains; preload",
            )

        return response

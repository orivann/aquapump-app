from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from .config import get_settings
from .logging import configure_logging, get_logger
from .middleware import SecureHeadersMiddleware
from .routes import router

settings = get_settings()

configure_logging()
logger = get_logger("lifespan")


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info("Starting AquaPump API service")
    try:
        yield
    finally:
        logger.info("Shutting down AquaPump API service")


app = FastAPI(title=settings.app_name, lifespan=lifespan)

if settings.enable_https_redirect:
    app.add_middleware(HTTPSRedirectMiddleware)

app.add_middleware(
    SecureHeadersMiddleware,
    referrer_policy=settings.security_referrer_policy,
    permissions_policy=settings.security_permissions_policy,
    content_security_policy=settings.security_content_security_policy,
    enable_hsts=settings.enable_https_redirect,
    hsts_max_age=settings.security_hsts_max_age,
)

if settings.trusted_hosts != ["*"]:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.trusted_hosts)

if settings.gzip_minimum_size > 0:
    app.add_middleware(GZipMiddleware, minimum_size=settings.gzip_minimum_size)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_methods,
    allow_headers=settings.cors_headers,
)

app.include_router(router, prefix=settings.api_v1_prefix)

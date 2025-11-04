from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .logging import configure_logging, get_logger
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix=settings.api_v1_prefix)


@app.get("/", tags=["meta"])
async def root() -> dict[str, str]:
    """Human-friendly message when someone browses the API root."""
    return {
        "message": "AquaPump API is running.",
        "health": "/health",
        "chat": "/chat",
        "docs": "/docs",
    }

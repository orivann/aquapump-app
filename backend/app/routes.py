from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException, Query
from fastapi.concurrency import run_in_threadpool

from .ai_client import generate_response
from .config import get_settings
from .logging import get_logger
from .schemas import (
    ChatHistoryResponse,
    ChatRequest,
    ChatResponse,
    HealthCheck,
    HealthResponse,
    HealthStatus,
    Message,
    NewsletterSignupRequest,
    NewsletterSignupResponse,
)
from .supabase_client import (
    fetch_history,
    get_client,
    ping_database,
    store_messages,
    store_newsletter_signup,
    upsert_chat_session,
)

router = APIRouter()
logger = get_logger("routes")


@router.get("/health", response_model=HealthResponse)
async def health(include: str = Query(default="basic", pattern="^(basic|dependencies|all)$")) -> HealthResponse:
    checks: dict[str, HealthCheck] = {}
    include_dependencies = include in {"dependencies", "all"}

    if include_dependencies:
        client = get_client()
        try:
            await run_in_threadpool(ping_database, client)
            checks["database"] = HealthCheck(status="ok")
        except Exception as exc:  # pragma: no cover - supabase failures
            logger.warning("Database health check failed", exc_info=exc)
            checks["database"] = HealthCheck(status="error", detail=str(exc))

    status: HealthStatus = "ok"
    if checks:
        if any(check.status == "error" for check in checks.values()):
            status = "error"
        elif any(check.status == "degraded" for check in checks.values()):
            status = "degraded"

    logger.debug("Health probe evaluated", extra={"include": include, "status": status})
    return HealthResponse(status=status, checks=checks)


@router.get("/chat/{session_id}", response_model=ChatHistoryResponse)
async def get_chat_history(session_id: UUID) -> ChatHistoryResponse:
    client = get_client()
    settings = get_settings()
    raw_history = await run_in_threadpool(fetch_history, client, str(session_id), settings.history_limit)
    messages = [Message(**row) for row in raw_history]
    logger.debug("Fetched chat history", extra={"session_id": str(session_id), "messages": len(messages)})
    return ChatHistoryResponse(session_id=session_id, messages=messages)


@router.post("/chat", response_model=ChatResponse)
async def create_chat_completion(payload: ChatRequest) -> ChatResponse:
    client = get_client()
    settings = get_settings()
    session_id = payload.session_id or uuid4()

    raw_history = await run_in_threadpool(fetch_history, client, str(session_id), settings.history_limit)
    history = [Message(**row) for row in raw_history]

    logger.info("Generating assistant response", extra={"session_id": str(session_id), "history": len(history)})

    reply = await generate_response(history, payload.message)

    timestamp = datetime.now(timezone.utc)

    records = [
        {
            "session_id": str(session_id),
            "role": "user",
            "content": payload.message,
            "created_at": timestamp.isoformat(),
        },
        {
            "session_id": str(session_id),
            "role": "assistant",
            "content": reply,
            "created_at": timestamp.isoformat(),
        },
    ]

    try:
        await run_in_threadpool(store_messages, client, records)
    except Exception as exc:  # pragma: no cover - database errors
        logger.error("Unable to persist chat messages", extra={"session_id": str(session_id)}, exc_info=exc)
        raise HTTPException(status_code=502, detail="Unable to persist chat messages") from exc

    total_messages = len(history) + len(records)
    try:
        await run_in_threadpool(
            upsert_chat_session,
            client,
            {
                "session_id": str(session_id),
                "message_count": total_messages,
                "last_user_message": payload.message,
                "last_assistant_message": reply,
                "updated_at": timestamp.isoformat(),
                "metadata": {"history_before_request": len(history)},
            },
        )
    except Exception as exc:  # pragma: no cover - metadata failures
        logger.warning("Unable to upsert chat session metadata", extra={"session_id": str(session_id)}, exc_info=exc)

    messages = history + [
        Message(role="user", content=payload.message, created_at=timestamp),
        Message(role="assistant", content=reply, created_at=timestamp),
    ]

    logger.debug("Assistant reply generated", extra={"session_id": str(session_id), "total_messages": len(messages)})
    return ChatResponse(session_id=session_id, reply=reply, messages=messages)


@router.post("/newsletter", response_model=NewsletterSignupResponse, status_code=201)
async def subscribe_newsletter(payload: NewsletterSignupRequest) -> NewsletterSignupResponse:
    client = get_client()
    metadata = payload.metadata or {}

    try:
        await run_in_threadpool(
            store_newsletter_signup,
            client,
            payload.email,
            payload.source,
            metadata,
        )
    except Exception as exc:  # pragma: no cover - database errors
        logger.error("Unable to persist newsletter signup", extra={"email": payload.email}, exc_info=exc)
        raise HTTPException(status_code=502, detail="Unable to subscribe at the moment") from exc

    logger.info("Newsletter signup stored", extra={"email": payload.email, "source": payload.source})
    return NewsletterSignupResponse()

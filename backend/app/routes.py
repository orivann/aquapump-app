from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from .ai_client import generate_response
from .config import get_settings
from .schemas import ChatHistoryResponse, ChatRequest, ChatResponse, Message
from .supabase_client import fetch_history, get_client, store_messages

router = APIRouter()


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/chat/{session_id}", response_model=ChatHistoryResponse)
async def get_chat_history(session_id: UUID) -> ChatHistoryResponse:
    client = get_client()
    settings = get_settings()
    raw_history = await run_in_threadpool(fetch_history, client, str(session_id), settings.history_limit)
    messages = [Message(**row) for row in raw_history]
    return ChatHistoryResponse(session_id=session_id, messages=messages)


@router.post("/chat", response_model=ChatResponse)
async def create_chat_completion(payload: ChatRequest) -> ChatResponse:
    client = get_client()
    settings = get_settings()
    session_id = payload.session_id or uuid4()

    raw_history = await run_in_threadpool(fetch_history, client, str(session_id), settings.history_limit)
    history = [Message(**row) for row in raw_history]

    reply = await generate_response(history, payload.message)

    now_user = datetime.now(timezone.utc)
    now_assistant = datetime.now(timezone.utc)

    records = [
        {
            "session_id": str(session_id),
            "role": "user",
            "content": payload.message,
            "created_at": now_user.isoformat(),
        },
        {
            "session_id": str(session_id),
            "role": "assistant",
            "content": reply,
            "created_at": now_assistant.isoformat(),
        },
    ]

    try:
        await run_in_threadpool(store_messages, client, records)
    except Exception as exc:  # pragma: no cover - database errors
        raise HTTPException(status_code=502, detail="Unable to persist chat messages") from exc

    messages = history + [
        Message(role="user", content=payload.message, created_at=now_user),
        Message(role="assistant", content=reply, created_at=now_assistant),
    ]

    return ChatResponse(session_id=session_id, reply=reply, messages=messages)

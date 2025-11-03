from datetime import datetime, timezone
from functools import lru_cache
from typing import Any

from supabase import Client, create_client

from .config import get_settings
from .logging import get_logger

logger = get_logger("supabase")


# Cache the Supabase client across requests so connection pooling stays efficient
@lru_cache
def get_client() -> Client:
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def fetch_history(client: Client, session_id: str, limit: int) -> list[dict[str, Any]]:
    response = (
        client.table(get_settings().supabase_chat_table)
        .select("role, content, created_at")
        .eq("session_id", session_id)
        .order("created_at", desc=False)
        .limit(limit)
        .execute()
    )
    logger.debug(
        "Supabase history fetch",
        extra={"session_id": session_id, "count": len(response.data or [])},
    )
    return response.data or []


def store_messages(client: Client, records: list[dict[str, Any]]) -> None:
    if not records:
        return

    client.table(get_settings().supabase_chat_table).insert(records).execute()
    logger.debug("Persisted chat messages", extra={"count": len(records)})


def upsert_chat_session(client: Client, payload: dict[str, Any]) -> None:
    if not payload:
        return

    settings = get_settings()
    record = {
        "session_id": str(payload["session_id"]),
        "message_count": payload.get("message_count"),
        "last_user_message": payload.get("last_user_message"),
        "last_assistant_message": payload.get("last_assistant_message"),
        "updated_at": payload.get("updated_at")
        or datetime.now(timezone.utc).isoformat(),
        "metadata": payload.get("metadata") or {},
    }
    client.table(settings.supabase_chat_session_table).upsert(
        record, on_conflict="session_id"
    ).execute()
    logger.debug("Upserted chat session", extra={"session_id": record["session_id"]})


def store_newsletter_signup(
    client: Client, email: str, source: str, metadata: dict[str, Any] | None = None
) -> None:
    if not email:
        raise ValueError("email required for newsletter signup")

    settings = get_settings()
    record = {
        "email": email.strip().lower(),
        "source": source,
        "metadata": metadata or {},
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
    }
    client.table(settings.supabase_newsletter_table).upsert(
        record, on_conflict="email"
    ).execute()
    logger.debug(
        "Stored newsletter signup", extra={"email": record["email"], "source": source}
    )


def ping_database(client: Client) -> None:
    client.table(get_settings().supabase_chat_table).select(
        "role", count="exact"
    ).limit(1).execute()

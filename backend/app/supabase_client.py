from functools import lru_cache
from typing import Any

from supabase import Client, create_client

from .config import get_settings


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
    return response.data or []


def store_messages(client: Client, records: list[dict[str, Any]]) -> None:
    if not records:
        return

    client.table(get_settings().supabase_chat_table).insert(records).execute()

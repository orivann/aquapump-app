"""Utility functions for interacting with the Supabase persistence layer."""

from functools import lru_cache
from typing import Any

from supabase import Client, create_client

from .config import get_settings


def _chat_table_name() -> str:
    """Return the configured chat table name."""

    return get_settings().supabase_chat_table


@lru_cache
def get_client() -> Client:
    """Create (and cache) a Supabase client configured from the environment."""

    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def fetch_history(client: Client, session_id: str, limit: int) -> list[dict[str, Any]]:
    """Fetch ordered chat history for the supplied session."""

    response = (
        client.table(_chat_table_name())
        .select("role, content, created_at")
        .eq("session_id", session_id)
        .order("created_at", desc=False)
        .limit(limit)
        .execute()
    )
    return response.data or []


def store_messages(client: Client, records: list[dict[str, Any]]) -> None:
    """Persist a batch of chat messages if any are provided."""

    if not records:
        return

    client.table(_chat_table_name()).insert(records).execute()


def ping_database(client: Client) -> None:
    """Execute a lightweight query to validate database connectivity."""

    client.table(_chat_table_name()).select("role", count="exact").limit(1).execute()

"""Helpers for interacting with the upstream AI service."""

from functools import lru_cache
from typing import Any

from fastapi import HTTPException
from fastapi.concurrency import run_in_threadpool
from openai import OpenAI

from .config import get_settings
from .schemas import Message


@lru_cache
def _client() -> OpenAI:
    """Return a cached OpenAI client instance.

    Constructing the client is relatively expensive and the configuration is
    static for the lifetime of the process, so we memoise the instance to avoid
    unnecessary re-instantiation on every request.
    """

    settings = get_settings()
    return OpenAI(api_key=settings.ai_api_key, base_url=settings.ai_api_base_url)


def _build_messages(history: list[Message], prompt: str) -> list[dict[str, Any]]:
    """Serialise persisted chat history and append the current prompt."""

    messages = [message.model_dump(mode="json", exclude_none=True) for message in history]
    messages.append({"role": "user", "content": prompt})
    return messages


async def generate_response(history: list[Message], prompt: str) -> str:
    """Request a completion from the upstream AI provider.

    Any upstream error is translated to an HTTPException so the API surface is
    predictable for callers. We also guard against malformed responses that do
    not include a usable message payload.
    """

    settings = get_settings()
    messages = _build_messages(history, prompt)

    try:
        response = await run_in_threadpool(
            _client().chat.completions.create,
            model=settings.ai_model,
            messages=messages,
        )
    except Exception as exc:  # pragma: no cover - upstream errors
        raise HTTPException(status_code=502, detail="AI service error") from exc

    if not response.choices:  # pragma: no cover - defensive guard
        raise HTTPException(status_code=502, detail="Empty response from AI service")

    choice = response.choices[0]
    content = choice.message.content
    if not content:
        raise HTTPException(status_code=502, detail="Empty response from AI service")
    return content

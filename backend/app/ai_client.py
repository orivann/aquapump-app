from typing import Any

from fastapi import HTTPException
from fastapi.concurrency import run_in_threadpool
from openai import OpenAI

from .config import get_settings
from .schemas import Message


def _client() -> OpenAI:
    settings = get_settings()
    return OpenAI(api_key=settings.ai_api_key, base_url=settings.ai_api_base_url)


def _build_messages(history: list[Message], prompt: str) -> list[dict[str, Any]]:
    messages = [message.model_dump(mode="json", exclude_none=True) for message in history]
    messages.append({"role": "user", "content": prompt})
    return messages


async def generate_response(history: list[Message], prompt: str) -> str:
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

    choice = response.choices[0]
    content = choice.message.content
    if not content:
        raise HTTPException(status_code=502, detail="Empty response from AI service")
    return content

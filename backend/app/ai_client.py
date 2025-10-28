from functools import lru_cache
from typing import Any

from fastapi import HTTPException
from fastapi.concurrency import run_in_threadpool
from openai import OpenAI

from .config import get_settings
from .logging import get_logger
from .schemas import Message

LANGUAGE_SYSTEM_MESSAGES: dict[str, str] = {
    "en": (
        "You are Aqua AI, a helpful AquaPump product specialist. Respond in fluent English with a friendly, professional tone."
        " Provide concise, accurate answers grounded in AquaPump knowledge."
    ),
    "he": (
        "אתה Aqua AI, מומחה מוצרים של AquaPump. ענה בעברית רהוטה בטון מקצועי ונעים."
        " ספק תשובות מדויקות ומבוססות ידע של AquaPump."
    ),
}

logger = get_logger("ai_client")


@lru_cache
def _client() -> OpenAI:
    settings = get_settings()
    return OpenAI(api_key=settings.ai_api_key, base_url=settings.ai_api_base_url, timeout=settings.ai_request_timeout)


def _build_messages(history: list[Message], prompt: str, language: str) -> list[dict[str, Any]]:
    """Convert stored chat history into OpenAI compatible message payloads."""

    system_prompt = LANGUAGE_SYSTEM_MESSAGES.get(language, LANGUAGE_SYSTEM_MESSAGES["en"])

    sanitized_history = [
        {"role": "system", "content": system_prompt}
    ]
    sanitized_history.extend(
        {"role": message.role, "content": message.content}
        for message in history
        if message.content and message.role
    )
    sanitized_history.append({"role": "user", "content": prompt})
    return sanitized_history


async def generate_response(history: list[Message], prompt: str, language: str) -> str:
    settings = get_settings()
    messages = _build_messages(history, prompt, language)

    try:
        response = await run_in_threadpool(
            _client().chat.completions.create,
            model=settings.ai_model,
            messages=messages,
        )
    except Exception as exc:  # pragma: no cover - upstream errors
        logger.exception("AI provider error", extra={"model": settings.ai_model})
        raise HTTPException(status_code=502, detail="AI service error") from exc

    choice = response.choices[0]
    content = choice.message.content
    if not content:
        logger.error("Empty response from AI provider", extra={"model": settings.ai_model})
        raise HTTPException(status_code=502, detail="Empty response from AI service")

    logger.debug("AI response generated", extra={"tokens": getattr(response.usage, "total_tokens", None)})
    return content

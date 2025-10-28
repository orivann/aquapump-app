from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


Role = Literal["user", "assistant", "system"]
HealthStatus = Literal["ok", "degraded", "error"]


class Message(BaseModel):
    role: Role
    content: str
    created_at: datetime | None = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: UUID | None = None
    language: Literal["en", "he"] = Field(default="en")

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("message must not be empty")
        return cleaned


class ChatResponse(BaseModel):
    session_id: UUID
    reply: str
    messages: list[Message]


class ChatHistoryResponse(BaseModel):
    session_id: UUID
    messages: list[Message]


class HealthCheck(BaseModel):
    status: HealthStatus
    detail: str | None = None


class HealthResponse(BaseModel):
    status: HealthStatus = "ok"
    checks: dict[str, HealthCheck] = Field(default_factory=dict)

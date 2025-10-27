from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


Role = Literal["user", "assistant", "system"]


class Message(BaseModel):
    role: Role
    content: str
    created_at: datetime | None = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: UUID | None = None


class ChatResponse(BaseModel):
    session_id: UUID
    reply: str
    messages: list[Message]


class ChatHistoryResponse(BaseModel):
    session_id: UUID
    messages: list[Message]

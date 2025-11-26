from functools import lru_cache
import json

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AquaPump API"
    api_v1_prefix: str = "/api"
    history_limit: int = Field(default=20, ge=1, le=100)
    cors_allow_origins: str = ""

    supabase_url: str
    supabase_service_role_key: str
    supabase_chat_table: str = "chat_messages"
    supabase_chat_session_table: str = "chat_sessions"
    supabase_newsletter_table: str = "newsletter_signups"

    ai_api_key: str
    ai_model: str = "gpt-4o-mini"
    ai_api_base_url: str | None = None
    ai_request_timeout: float = Field(default=60.0, gt=0, le=300)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @computed_field
    @property
    def cors_origins(self) -> list[str]:
        raw = (self.cors_allow_origins or "").strip()
        if not raw:
            return []

        if raw == "*":
            return ["*"]

        if raw.startswith("["):
            try:
                parsed = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError(
                    "Invalid JSON array provided for CORS_ALLOW_ORIGINS"
                ) from exc
            if isinstance(parsed, list):
                return [str(origin).strip() for origin in parsed if str(origin).strip()]
            raise ValueError("CORS_ALLOW_ORIGINS JSON must decode to a list of origins")

        origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
        return origins or ["*"]


@lru_cache
def get_settings() -> Settings:
    return Settings()

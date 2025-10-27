from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AquaPump API"
    api_v1_prefix: str = ""
    history_limit: int = Field(default=20, ge=1, le=100)

    supabase_url: str
    supabase_service_role_key: str
    supabase_chat_table: str = "chat_messages"

    ai_api_key: str
    ai_model: str = "gpt-4o-mini"
    ai_api_base_url: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()

from functools import lru_cache
import json

from pydantic import AliasChoices, Field, computed_field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AquaPump API"
    api_v1_prefix: str = ""
    history_limit: int = Field(default=20, ge=1, le=100)
    cors_allow_origins: str = "*"
    cors_allow_methods: str = "*"
    cors_allow_headers: str = "*"
    cors_allow_credentials: bool = True
    trusted_hosts_raw: str = Field(
        default="*",
        validation_alias=AliasChoices("TRUSTED_HOSTS", "TRUSTED_HOSTS_RAW"),
    )
    enable_https_redirect: bool = False
    gzip_minimum_size: int = Field(default=500, ge=0)
    security_referrer_policy: str = "strict-origin-when-cross-origin"
    security_permissions_policy: str | None = None
    security_content_security_policy: str | None = None
    security_hsts_max_age: int = Field(default=31536000, ge=0)

    supabase_url: str
    supabase_service_role_key: str
    supabase_chat_table: str = "chat_messages"

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
        return self._parse_csv_or_json(self.cors_allow_origins) or ["*"]

    @computed_field
    @property
    def cors_methods(self) -> list[str]:
        return self._parse_csv_or_json(self.cors_allow_methods) or ["*"]

    @computed_field
    @property
    def cors_headers(self) -> list[str]:
        return self._parse_csv_or_json(self.cors_allow_headers) or ["*"]

    @computed_field
    @property
    def trusted_hosts(self) -> list[str]:
        return self._parse_csv_or_json(self.trusted_hosts_raw) or ["*"]

    def _parse_csv_or_json(self, raw_value: str | None) -> list[str]:
        raw = (raw_value or "").strip()
        if not raw or raw == "*":
            return ["*"] if raw == "*" else []

        if raw.startswith("["):
            try:
                parsed = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise ValueError("Invalid JSON array provided for configuration value") from exc
            if isinstance(parsed, list):
                values = [str(item).strip() for item in parsed if str(item).strip()]
                if values:
                    return list(dict.fromkeys(values))
                return []
            raise ValueError("JSON configuration value must decode to a list of strings")

        return list(dict.fromkeys([item.strip() for item in raw.split(",") if item.strip()]))


@lru_cache
def get_settings() -> Settings:
    return Settings()

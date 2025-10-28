import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-key")
os.environ.setdefault("SUPABASE_CHAT_TABLE", "chat_messages")
os.environ.setdefault("AI_API_KEY", "test-ai-key")
os.environ.setdefault("AI_MODEL", "gpt-4o-mini")
os.environ.setdefault("CORS_ALLOW_ORIGINS", "http://localhost:5173")

from app.main import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    return TestClient(app)

# AquaPump Backend

FastAPI service that powers the conversational assistant and persists chat transcripts in Supabase.

## Requirements

- Python 3.12+
- A Supabase project (URL + service role key)
- AI provider key compatible with the OpenAI API (set `AI_API_BASE_URL` if you proxy)

## Configuration

Copy `backend/.env.example` to `backend/.env` and provide:

| Variable                      | Description                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `SUPABASE_URL`                | Supabase project URL                                                                       |
| `SUPABASE_SERVICE_ROLE_KEY`   | Service role key with read/write access to the `chat_messages` table                       |
| `SUPABASE_CHAT_TABLE`         | Table for persisted chat messages (defaults to `chat_messages`)                            |
| `SUPABASE_CHAT_SESSION_TABLE` | Table that tracks per-session metadata such as message counts (`chat_sessions` by default) |
| `SUPABASE_NEWSLETTER_TABLE`   | Table that stores newsletter signups (`newsletter_signups` by default)                     |
| `AI_API_KEY`                  | Key for your AI provider                                                                   |
| `AI_MODEL`                    | Model identifier (defaults to `gpt-4o-mini`)                                               |
| `AI_API_BASE_URL`             | Override when using a custom-compatible endpoint                                           |
| `CORS_ALLOW_ORIGINS`          | Comma-separated origins allowed to call the API                                            |

The `/chat` endpoints read/write rows inside `SUPABASE_CHAT_TABLE` and `SUPABASE_CHAT_SESSION_TABLE`, while the `/newsletter` endpoint upserts subscribers into `SUPABASE_NEWSLETTER_TABLE`.

## Local development

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Quality checks

- `python -m compileall backend/app` – simple syntax verification used by CI.
- Add `pytest` suites under `backend/tests/` as the project grows; CI will automatically pick them up once `pytest` is present in `requirements.txt`.

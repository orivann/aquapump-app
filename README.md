# AquaPump Platform

This project delivers the AquaPump marketing experience with a modern React frontend and a FastAPI backend that powers the AI support assistant. Supabase persists chat sessions so visitors can resume conversations from any device.

## Project structure

```
.
├── backend/              # FastAPI service
│   ├── app/              # Application code
│   ├── requirements.txt  # Python dependencies
│   └── .env.example      # Backend environment template
├── src/                  # React application source
├── public/               # Static assets
├── docker-compose.yml    # Local orchestration for frontend + backend
└── frontend/Dockerfile   # Production frontend image (Nginx)
```

## Requirements

- Node.js 20+
- Python 3.12+
- Docker (optional but recommended for parity with production)

## Environment variables

### Frontend (`.env`)

Copy `.env.example` to `.env` and adjust as needed. The only required variable is the backend base URL:

```
VITE_REACT_APP_API_BASE=http://localhost:8000
```

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and provide your credentials:

- `SUPABASE_URL` – Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` – service role key with read/write access to the chat table
- `SUPABASE_CHAT_TABLE` – table used to store messages (defaults to `chat_messages`)
- `AI_API_KEY` – key for your AI provider (OpenAI-compatible)
- `AI_MODEL` – model identifier (defaults to `gpt-4o-mini`)
- `AI_API_BASE_URL` – optional custom base URL

The backend expects a Supabase table with the following columns:

| Column       | Type    | Notes                        |
|--------------|---------|------------------------------|
| `id`         | uuid    | Primary key (default uuid)   |
| `session_id` | uuid    | Conversation identifier      |
| `role`       | text    | `user`, `assistant`, `system`|
| `content`    | text    | Message body                 |
| `created_at` | timestamptz | Defaults to `now()`      |

## Running locally

### With Docker Compose (recommended)

```sh
docker compose up --build
```

- Frontend available at http://localhost:5173
- Backend available at http://localhost:8000

### Manual setup

Run the backend:

```sh
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Run the frontend in another terminal:

```sh
npm install
npm run dev
```

## Chat API

- `POST /chat` – submit a message; automatically stores conversation history and returns the assistant reply.
- `GET /chat/{session_id}` – retrieve stored messages for a session.
- `GET /health` – readiness probe.

The frontend keeps the chat session ID in local storage so visitors can resume conversations on reload.

## Production build

```sh
npm run build
```

The build artifacts are generated in `dist/` and served via Nginx in the provided Docker image.

## License

This project is provided as-is for demonstration purposes. Update the license to match your organization’s requirements.

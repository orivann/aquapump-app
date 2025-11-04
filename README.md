# AquaPump Platform

This project delivers the AquaPump marketing experience with a modern React frontend and a FastAPI backend that powers the AI support assistant. Supabase persists chat sessions so visitors can resume conversations from any device.

## Project structure

```
.
├── backend/                   # FastAPI service
│   ├── app/                   # Application code
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Backend environment template
├── src/                       # React application source
├── public/                    # Static assets
├── scripts/health_check.py    # Composite health verification script
├── deploy/
│   └── helm/                  # Helm chart scaffold (synced by aquapump-gitops)
├── .github/workflows/         # GitHub Actions pipeline definitions
├── docs/                      # Operational runbooks and architecture notes
├── docker-compose.yml         # Local orchestration for frontend + backend
└── frontend/Dockerfile        # Production frontend image (Nginx)
```

## Requirements

- Node.js 20+
- Python 3.12+
- Docker (optional but recommended for parity with production)

## Architecture

- **Frontend** – React 18 + Vite with a bespoke Apple/Tesla-inspired marketing experience. Tailwind CSS drives theming while reusable sections (`SectionHeading`, animated metrics, responsive product grid) keep the markup declarative.
- **Backend** – FastAPI application that fronts the AI assistant, persists conversations in Supabase, and emits structured logs via the built-in logging pipeline. The API enforces payload validation and consistent error handling.

## Environment variables

### Frontend (`.env`)

Copy `.env.example` to `.env` and adjust as needed. The only required variable is the backend base URL:

```
VITE_REACT_APP_API_BASE=http://localhost:8000
```

The Vite dev server now runs on port **5173** to align with the production Docker image and CORS defaults.

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and provide your credentials:

- `SUPABASE_URL` – Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` – service role key with read/write access to the chat table
- `SUPABASE_CHAT_TABLE` – table used to store messages (defaults to `chat_messages`)
- `AI_API_KEY` – key for your AI provider (OpenAI-compatible)
- `AI_MODEL` – model identifier (defaults to `gpt-4o-mini`)
- `AI_API_BASE_URL` – optional custom base URL
- `AI_REQUEST_TIMEOUT` – AI request timeout in seconds (defaults to `60`)
- `CORS_ALLOW_ORIGINS` – comma-separated origins allowed to call the API (defaults to `http://localhost:5173,http://127.0.0.1:5173`)

The backend expects a Supabase table with the following columns:

| Column       | Type        | Notes                         |
| ------------ | ----------- | ----------------------------- |
| `id`         | uuid        | Primary key (default uuid)    |
| `session_id` | uuid        | Conversation identifier       |
| `role`       | text        | `user`, `assistant`, `system` |
| `content`    | text        | Message body                  |
| `created_at` | timestamptz | Defaults to `now()`           |

## Running locally

### With Docker Compose (recommended)

```sh
docker compose up --build
```

- Frontend available at http://localhost:5173
- Backend available at http://localhost:8000
- Containers expose health checks so `docker compose ps` reflects readiness once the services finish booting.
- Leave `VITE_REACT_APP_API_BASE` set to `/api` for Docker Compose so the frontend proxies API calls through Nginx; using a full URL here will be ignored and logged as a warning.

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

The dev server listens on http://localhost:5173. Add `-- --host 0.0.0.0` if you need to expose it to other devices on your network.

## Chat API

- `POST /chat` – submit a message; automatically stores conversation history and returns the assistant reply.
- `GET /chat/{session_id}` – retrieve stored messages for a session.
- `GET /health` – readiness probe.

The frontend keeps the chat session ID in local storage so visitors can resume conversations on reload.

## Health checks

- `scripts/health_check.py` verifies that the backend health endpoint returns `200`, the Supabase dependency is reachable, and the frontend responds with `200`.
- Usage:

  ```sh
  python scripts/health_check.py \
    --backend-base http://localhost:8000 \
    --frontend-url http://localhost:5173
  ```

  Environment variables `BACKEND_BASE_URL`, `FRONTEND_URL`, and `HEALTH_CHECK_TIMEOUT` can be used instead of command-line flags.

- For cluster-wide smoke tests (frontend, backend, ingress, Argo CD, Helm), run `../verify_deployments.sh dev|stage|prod` from the repository root.

## Production build

```sh
npm run build
```

The build artifacts are generated in `dist/` and served via Nginx in the provided Docker image.

## Optimization summary

- **Sleek UI/UX** – refined navigation, hero, and section layouts provide consistent spacing, motion, and responsive behavior while highlighting the chatbot call-to-action across breakpoints.
- **Lean dependencies** – removed unused React Query provider and trimmed bundle surfacing by consolidating section heading logic.
- **Backend resilience** – structured logging, stricter request validation, and tunable AI request timeouts improve operability and debugging.
- **Accessibility & performance** – scroll-triggered reveals respect reduced-motion preferences and parallax effects throttle smoothly on mobile.

## DevOps scaffolding

- **Helm** – `deploy/helm/aquapump` contains a chart that templates both services, ingress configuration, and environment variables.
- **Argo CD** – the companion [`aquapump-gitops`](../aquapump-gitops) repository stores the Application CRDs (`applications/*.yaml`) that continuously sync this chart into dev/stage/prod clusters.
- **GitHub Actions** – `.github/workflows/main.yaml` builds and pushes images to Amazon ECR, updates Helm values, and triggers Argo CD.

## Additional documentation

- `project_structure.md` – Guided tour of the repository layout for teammates and stakeholders.
- `docs/operations.md` – Operations playbook covering environments, CI/CD, Kubernetes deployment, and recovery procedures.
- `DEPLOYMENT.md` – Hands-on deployment checklist covering Helm, Argo CD, and GitHub Actions.
- `backend/README.md` – Backend-specific setup and quality checks.
- `frontend/README.md` – Frontend development guide and design-system notes.
- `docs/infra/README.md` – Reference IAM policies that support the CI/CD pipeline.

## Next steps

1. **Container image caching** – Pre-configure build cache mounts (e.g., `--mount=type=cache` for `pip`/`npm`) in Dockerfiles to accelerate CI builds.
2. **Kubernetes readiness** – Add liveness/readiness probes that call `/health?include=dependencies` for the backend and `/` for the frontend. Consider horizontal pod autoscaling driven by latency metrics.
3. **Secrets management** – Externalize Supabase/AI credentials with External Secrets Operator or SSM Parameter Store instead of embedding them in Helm values.
4. **Observability** – Ship FastAPI logs to a centralized sink (CloudWatch, Loki) and instrument request traces (OpenTelemetry) for chatbot interactions.
5. **CI/CD** – Introduce branch protection gating on `npm run build`, `npm run lint`, and Python test suites, followed by progressive rollout via Argo CD with manual approval hooks.

## License

This project is provided as-is for demonstration purposes. Update the license to match your organization’s requirements.

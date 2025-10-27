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
│   ├── helm/                  # Helm chart scaffold
│   ├── kubernetes/            # Kustomize-ready base manifests
│   ├── argocd/                # Argo CD Application definition
│   └── ci/github-actions/     # CI/CD workflow examples
├── docker-compose.yml         # Local orchestration for frontend + backend
└── frontend/Dockerfile        # Production frontend image (Nginx)
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
- `CORS_ALLOW_ORIGINS` – comma-separated origins allowed to call the API

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
- Containers expose health checks so `docker compose ps` reflects readiness once the services finish booting.

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

## Health checks

- `scripts/health_check.py` verifies that the backend health endpoint returns `200`, the Supabase dependency is reachable, and the frontend responds with `200`.
- Usage:

  ```sh
  python scripts/health_check.py \
    --backend-base http://localhost:8000 \
    --frontend-url http://localhost:5173
  ```

  Environment variables `BACKEND_BASE_URL`, `FRONTEND_URL`, and `HEALTH_CHECK_TIMEOUT` can be used instead of command-line flags.

## Production build

```sh
npm run build
```

The build artifacts are generated in `dist/` and served via Nginx in the provided Docker image.

## DevOps scaffolding

- **Helm** – `deploy/helm/aquapump` contains a chart that templates both services, ingress configuration, and environment variables.
- **Kubernetes** – `deploy/kubernetes/base` offers Kustomize-ready manifests for direct cluster application or as a basis for overlays.
- **Argo CD** – `deploy/argocd/application.yaml` defines how to sync the Helm chart from this repository using GitOps.
- **GitHub Actions** – `deploy/ci/github-actions/ecr-deploy.yml` builds and pushes images to Amazon ECR, updates Helm values, and triggers Argo CD.

## Next steps

1. **AWS ECR** – Create ECR repositories for the backend and frontend, then populate the `ECR_REPOSITORY_*` environment values in the GitHub Actions workflow. Attach an IAM role (`AWS_GITHUB_ROLE_ARN`) that grants push access.
2. **Helm values hardening** – Externalize secrets using `values-prod.yaml` and leverage `helm secrets` or an external secrets operator to inject Supabase and AI keys securely.
3. **Kubernetes overlays** – Add environment-specific overlays under `deploy/kubernetes/overlays/` (e.g., `staging`, `production`) that patch replica counts, autoscaling, and ingress hostnames.
4. **Argo CD automation** – Point the Argo CD application at a release branch (or a Git tag) to promote changes via pull requests. Enable Argo CD notifications for sync status.
5. **Continuous testing** – Extend the CI workflow to run `npm run build`, `npm run lint`, and Python unit tests before building images; gate deployments on successful checks.

## License

This project is provided as-is for demonstration purposes. Update the license to match your organization’s requirements.

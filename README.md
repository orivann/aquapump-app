# AquaPump Platform

This project delivers the AquaPump marketing experience with a modern React frontend and a FastAPI backend that powers the AI support assistant. Supabase persists chat sessions so visitors can resume conversations from any device.

## Project structure

```
.
├── backend/                   # FastAPI service + pytest smoke tests
│   ├── app/                   # Application code
│   ├── tests/                 # Pytest smoke suite
│   ├── Dockerfile             # Backend production image
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Backend environment template
├── frontend/                  # Vite + React SPA
│   ├── Dockerfile             # Frontend production image (Nginx)
│   └── .env.example           # Frontend environment template
├── src/                       # Legacy frontend source (mirrors frontend/)
├── public/                    # Static assets
├── scripts/                   # Operational helper scripts
│   ├── health_check.py        # Composite health verification script
│   └── smoke-tests.sh         # curl + pytest smoke harness
├── terraform/                 # Infrastructure-as-code for VPC/EKS/Route53/etc.
├── deploy/                    # Cluster deployment assets
│   ├── helm/                  # Helm chart and environment values
│   ├── argocd/                # Argo CD applications per environment
│   └── kubernetes/            # Kustomize-ready base manifests
├── docs/                      # Runbooks and smoke-test guides
├── docker-compose.yml         # Local orchestration for frontend + backend
└── README.md                  # Project overview and runbooks
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

| Column       | Type    | Notes                        |
|--------------|---------|------------------------------|
| `id`         | uuid    | Primary key (default uuid)   |
| `session_id` | uuid    | Conversation identifier      |
| `role`       | text    | `user`, `assistant`, `system`|
| `content`    | text    | Message body                 |
| `created_at` | timestamptz | Defaults to `now()`      |

## Terraform provisioning

The [`terraform/`](terraform) stack provisions the shared VPC, public/private subnets, IAM roles, EKS control plane + managed node group, ACM certificates, and Route53 records required by AquaPump. Terraform state is stored in the `aquapump-terraform-state` S3 bucket with locking handled by the `aquapump-terraform-lock` DynamoDB table.

1. Export AWS credentials (either `AWS_PROFILE` or `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`) and confirm the region: 
   ```bash
   export AWS_REGION=eu-central-1
   export AWS_PROFILE=aquapump-infra   # or rely on access keys
   ```
2. Initialise Terraform and select a workspace (defaults to `default` if omitted):
   ```bash
   terraform -chdir=terraform init
   terraform -chdir=terraform workspace select dev || terraform -chdir=terraform workspace new dev
   ```
3. Provide domain-specific inputs when planning or applying: 
   ```bash
   terraform -chdir=terraform plan \
     -var='domain_name=aqua-pump.net' \
     -var='hosted_zone_id=Z0123456789' \
     -var='alb_dns_name=internal-aquapump.example.elb.amazonaws.com' \
     -var='alb_zone_id=Z2EXAMPLE'
   ```

Backend configuration values can be overridden with `-backend-config` flags or environment variables (e.g. `AWS_STATE_BUCKET`) if you maintain per-environment state buckets. See [`docs/secrets-runbook.md`](docs/secrets-runbook.md) for the full credential layout.

## Running locally

### With Docker Compose (recommended)

Copy `.env.example` files to provide Supabase/AI credentials before starting the stack:

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
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


## Smoke tests

The bash harness [`scripts/smoke-tests.sh`](scripts/smoke-tests.sh) performs end-to-end smoke testing with `curl` and `pytest`. See [`docs/smoke-tests.md`](docs/smoke-tests.md) for usage examples. Run it after `docker compose up --build` or against a remote deployment by overriding `BACKEND_URL` and `FRONTEND_URL`.

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


## Verification strategy

- **Docker Compose** – `docker compose up --build` then run [`scripts/smoke-tests.sh`](scripts/smoke-tests.sh) to hit `/health` and the SPA routes.
- **Helm** – `helm lint`, `helm template`, and `helm upgrade --install --dry-run` commands are automated in CI but can be repeated locally for each `values-*.yaml` overlay.
- **Terraform** – `terraform fmt -check`, `terraform validate`, and `terraform plan` with the environment-specific variables above.
- **CI/CD** – Trigger `workflow_dispatch` on the `Build, Test, and Deploy AquaPump` workflow to exercise the lint/test matrices, infrastructure validation, and Argo CD sync gates without merging to `main`.

## DevOps scaffolding

- **Terraform** – [`terraform/`](terraform) provisions the network, IAM roles, EKS cluster, ACM certificates, and Route53 records backing the platform.
- **Helm** – [`deploy/helm/aquapump`](deploy/helm/aquapump) bundles backend + frontend deployments with ESO-backed secrets, ingress hardening, and environment-specific `values-*.yaml` overlays.
- **Argo CD** – [`deploy/argocd/apps`](deploy/argocd/apps) provides separate applications for `dev`, `staging`, and `prod` with environment-appropriate sync policies (see [`docs/argocd.md`](docs/argocd.md)).
- **Kubernetes (legacy)** – [`deploy/kubernetes/base`](deploy/kubernetes/base) remains for Kustomize-based workflows and now mirrors the Helm image registry to avoid drift.
- **GitHub Actions** – [`.github/workflows/ecr-deploy.yml`](.github/workflows/ecr-deploy.yml) runs lint/test matrices, Terraform/Helm validation, OIDC-authenticated image builds, and gated Argo CD promotion.

## Next steps

1. **Kind integration tests** – Extend the GitHub Actions pipeline with a Kind-based stage that installs the chart and executes [`scripts/smoke-tests.sh`](scripts/smoke-tests.sh) against the in-cluster services.
2. **Progressive delivery** – Configure Argo CD rollouts or Argo Rollouts canaries to gradually promote new images after the staging sync succeeds.
3. **Autoscaling** – Add KEDA- or HPA-driven scaling rules using latency/QPS metrics exported from the backend.
4. **Observability** – Ship FastAPI logs to CloudWatch (or Loki) and emit OpenTelemetry traces for chat interactions to trace AI response times.
5. **Cost controls** – Enable cluster autoscaler and AWS Load Balancer Controller so unused nodes are scaled down automatically while still supporting managed ingress.

## License

This project is provided as-is for demonstration purposes. Update the license to match your organization’s requirements.

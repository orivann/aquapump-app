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
├── scripts/                   # Operational helper scripts
│   └── health_check.py        # Composite health verification script
├── deploy/                    # Kubernetes + Argo CD manifests
│   ├── helm/                  # Single chart for backend + frontend
│   └── argocd/                # Argo CD project + environment apps
├── terraform/                 # Single-node EC2 + k3s bootstrap
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

The [`terraform/`](terraform) directory provisions a single Ubuntu-based EC2 instance in `eu-central-1`, installs K3s, and bootstraps MetalLB, ingress-nginx, and Argo CD. Once cloud-init completes, Argo CD syncs the Helm chart in `deploy/helm/aquapump` across the `aquapump-dev`, `aquapump-staging`, and `aquapump-prod` namespaces using the images published to Amazon ECR.

1. Export AWS credentials (or select an AWS profile) and choose the SSH key pair that should be injected into the instance:
   ```bash
   export AWS_REGION=eu-central-1
   export AWS_PROFILE=aquapump-infra   # or rely on access keys
   export TF_VAR_key_name=aquapump-europe   # existing EC2 key pair name
   ```
2. (Optional) Override defaults by setting Terraform variables, for example to point MetalLB at an address range that is routable in your VPC or to track a non-`main` branch (by default MetalLB advertises the instance public IP):
   ```bash
   export TF_VAR_metallb_address_pool=10.0.1.240-10.0.1.250
   export TF_VAR_repository_branch=main
   ```
3. Initialise and apply the stack:
   ```bash
   terraform -chdir=terraform init
   terraform -chdir=terraform apply
   ```
4. After `apply` finishes, use the reported `public_ip` output to connect and verify the cluster. The bootstrap script stores the Argo CD admin password on the node at `/root/argocd-initial-admin-password` once the control plane is healthy:
   ```bash
   ssh -i ~/.ssh/aquapump-europe.pem ubuntu@<EC2_IP>
   kubectl get pods -n aquapump-prod
   kubectl get ingress -n aquapump-prod
   sudo cat /root/argocd-initial-admin-password
   ```
5. When you are done, tear everything down with the helper script. The script first removes k3s data over SSH (if the key is available) and then destroys the Terraform resources. Provide the instance IP and (optionally) the path to your SSH key:
   ```bash
   cd terraform
   EC2_IP=<EC2_IP> SSH_KEY_PATH=~/.ssh/aquapump-europe.pem ./cleanup.sh
   ```
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

- **Terraform** – `terraform -chdir=terraform plan` before applying changes to confirm the diff.
- **Kubernetes** – `kubectl get pods -n aquapump-prod` and `kubectl get ingress -n aquapump-prod` after bootstrap to confirm workloads are scheduled and ingress is published.
- **Argo CD** – `kubectl get applications -n argocd` to review sync status across dev/staging/prod.
- **Docker Compose** – `docker compose up --build` remains the quickest local validation loop.

## DevOps scaffolding

- **Terraform** – [`terraform/`](terraform) provisions a single EC2 instance, installs K3s, and bootstraps the cluster add-ons.
- **Helm** – [`deploy/helm/aquapump`](deploy/helm/aquapump) renders both services with shared values files for dev/staging/prod namespaces. Global image settings live under `imageDefaults`, so Argo CD and Terraform only need to override the registry and tag once per sync.
- **Argo CD** – [`deploy/argocd`](deploy/argocd) defines one project and three applications pointing back to this repository.

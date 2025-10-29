# Aquapump Operations Playbook

This guide explains how to run Aquapump in every environment and how the automation pieces (GitHub Actions, Amazon ECR, Argo CD, Terraform) connect. It is written for engineers who need to deploy, troubleshoot, or upgrade the platform.

## 1. Architecture at a Glance

- **Frontend** – React 18 + Vite marketing site served by Nginx.
- **Backend** – FastAPI service that proxies AI requests and persists chat history in Supabase.
- **Data** – Supabase provides Postgres storage for chat transcripts.
- **Automation** – GitHub Actions builds and ships container images to Amazon ECR and triggers Argo CD for GitOps deployments.
- **Infrastructure** – Terraform provisions the baseline AWS resources (EC2 worker nodes, K3s, MetalLB, Argo CD bootstrap).

```
┌──────────┐        ┌────────────┐        ┌─────────┐
│ Frontend │ <────> │   Backend  │ <────> │ Supabase│
└──────────┘   API  └────────────┘   DB   └─────────┘
     ▲                                 ▲
     │                                 │
     │        ┌────────────────────────┘
     │        │
     ▼        ▼
GitHub Actions ──► Amazon ECR ──► Argo CD ──► Kubernetes (K3s)
```

## 2. Environment Matrix

| Environment | Purpose | How it is deployed |
|-------------|---------|--------------------|
| **Local**   | Developer workstation, demos | `docker compose up --build` (or manual `npm run dev` / `uvicorn`) |
| **Staging** | Integration testing, stakeholder previews | Trigger GitHub Action from the `release/*` branch; Argo CD syncs the staging namespace |
| **Production** | Customer-facing site | Merge to `main` so the GitHub Action builds tagged images and Argo CD deploys to the production namespace |

## 3. Local Operations

1. Copy `.env.example` to `.env` in the repo root if you want to override `VITE_REACT_APP_API_BASE`.
2. Copy `backend/.env.example` to `backend/.env` and populate Supabase + AI credentials.
3. Launch with Docker Compose:

   ```bash
   docker compose up --build
   ```

   - Frontend → http://localhost:5173
   - Backend → http://localhost:8000
4. Validate with the bundled script:

   ```bash
   python scripts/health_check.py \
     --backend-base http://localhost:8000 \
     --frontend-url http://localhost:5173
   ```

## 4. CI/CD Pipeline (GitHub Actions → ECR → Argo CD)

Workflow: `.github/workflows/main.yaml`

1. **Quality gates** – Runs `npm run lint`/`npm run build` for the frontend and compiles the FastAPI sources to catch Python syntax issues.
2. **Image build & push** – Uses Docker Buildx with GitHub Actions cache to build and push backend and frontend images in parallel (tagged with the commit SHA and, on `main`, `latest`).
3. **Helm values update** – Patches `deploy/helm/aquapump/values.yaml` with the new image tag so Kubernetes pulls the correct version.
4. **GitOps sync** – Invokes Argo CD to sync the `aquapump` Application with the repository state.
5. **Health guard** – Polls Argo CD status and rolls back automatically if the app fails to become `Healthy` and `Synced` within the timeout window.

### Required secrets

Store the following in the GitHub repository/organization secrets vault:

- `AWS_GITHUB_ROLE_ARN` – IAM role that grants push access to ECR and read access to SSM/Secrets Manager if needed.
- `ARGOCD_SERVER` – External URL of the Argo CD API server.
- `ARGOCD_AUTH_TOKEN` – Argo CD API token scoped to the `aquapump` application.

## 5. Kubernetes & Helm Layout

The Helm chart (`deploy/helm/aquapump`) deploys both services with sensible defaults:

- Namespaced Deployments with rolling updates and resource requests/limits.
- Liveness/readiness probes hitting `/health` (backend) and `/` (frontend via Service + Nginx).
- Optional ingress object with TLS stub (replace `aquapump.example.com` and `aquapump-tls`).

Override values per environment through Helm values files or Argo CD Application parameters. Example Helm install for a new cluster:

```bash
helm upgrade --install aquapump deploy/helm/aquapump \
  --namespace aquapump \
  --create-namespace \
  --set backend.existingSecret=aquapump-secrets \
  --set frontend.existingSecret=aquapump-secrets
```

Create the `aquapump-secrets` secret once with the required keys (e.g. `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, `VITE_REACT_APP_API_BASE`) before running the Helm command. If you prefer inline variables, omit `existingSecret` and set `backend.env.*`/`frontend.env.*` instead.

For production you can turn on the bundled ExternalSecret (`externalSecret.enabled=true`) and point it at your preferred `SecretStore` so the cluster syncs credentials automatically.

## 6. Terraform & Cluster Bootstrap

Terraform modules (see `deploy/terraform/` if present in your fork) are expected to:

1. Provision the VPC, subnets, and security groups.
2. Launch EC2 instances that install K3s and configure MetalLB for load balancing.
3. Install Argo CD via Helm and configure an initial admin password.
4. Create IAM roles/policies for GitHub OIDC (see `trust-policy.json`, `ecr-policy.json`).

> **Note**: If Terraform modules are not yet committed, copy them from the infrastructure repository used by your DevOps team or create new modules following these steps.

## 7. Secrets Management

- Local development uses `.env` files (never commit actual secrets).
- Kubernetes recommends [External Secrets Operator](https://external-secrets.io/) or AWS Secrets Manager + `SecretProviderClass`.
- Update Helm chart to reference secrets via environment variable names and `valueFrom` when ESO is available.
- Rotate `SUPABASE_SERVICE_ROLE_KEY` and `AI_API_KEY` regularly; document the rotation schedule in your team runbook.

## 8. Observability & Diagnostics

- FastAPI logging is configured via `backend/app/logging.py`. Forward container logs to CloudWatch Logs or Loki for retention.
- Add Prometheus scraping by annotating the backend Deployment and exposing metrics if you adopt instrumentation.
- Use the `scripts/health_check.py` command in post-deploy smoke tests.

## 9. Release Checklist

Before merging into `main`:

- [ ] `npm run build` (frontend)
- [ ] `npm run lint`
- [ ] `pytest` (if backend tests are added)
- [ ] `python scripts/health_check.py` against staging
- [ ] Confirm GitHub Actions secrets are still valid (expiring tokens, rotated keys)

## 10. Disaster Recovery

1. Roll back to the previous image using Argo CD UI or the CLI: `argocd app rollback aquapump --revision <REV>`.
2. If the cluster is unhealthy, redeploy infrastructure via Terraform and then re-run the Helm install.
3. Restore Supabase backups using the Supabase dashboard or the `supabase` CLI.
4. Document the incident in your operations log and capture follow-up actions.

---

Keep this document close when onboarding new operators or when you need to explain how Aquapump moves from commit to production. Update it whenever you tweak the pipeline, secrets layout, or Kubernetes resources.

# Aquapump Operations Playbook

This guide explains how to run Aquapump in every environment and how the automation pieces (GitHub Actions, Amazon ECR, Argo CD, Terraform) connect. It is written for engineers who need to deploy, troubleshoot, or upgrade the platform.

## 1. Architecture at a Glance

- **Frontend** – React 18 + Vite marketing site served by Nginx.
- **Backend** – FastAPI service that proxies AI requests and persists chat history in Supabase.
- **Data** – Supabase provides Postgres storage for chat transcripts.
- **Automation** – GitHub Actions builds and ships container images to Amazon ECR and triggers Argo CD for GitOps deployments.
- **Infrastructure** – Terraform (see `../aquapump-infra`) provisions the AWS VPC, EKS control plane/node groups, ingress-nginx, cert-manager, and Argo CD via Helm.

```
┌──────────┐        ┌────────────┐        ┌─────────┐
│ Frontend │ <────> │   Backend  │ <────> │ Supabase│
└──────────┘   API  └────────────┘   DB   └─────────┘
     ▲                                 ▲
     │                                 │
     │        ┌────────────────────────┘
     │        │
     ▼        ▼
GitHub Actions ──► Amazon ECR ──► Argo CD ──► AWS EKS
```

## 2. Environment Matrix

| Environment    | Namespace      | Argo CD App      | Git Source                             | Purpose / Notes                                                                                   |
| -------------- | -------------- | ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Local**      | n/a            | n/a              | working tree                           | `docker compose up --build` (or manual `npm run dev` / `uvicorn`) for workstation demos.          |
| **Development**| `aquapump-dev` | `aquapump-dev`   | `main` + Helm overrides (`tag=dev`)    | Auto-syncs on every push so dev images tagged `dev` roll out quickly.                             |
| **Staging**    | `aquapump-stage`| `aquapump-stage`| `main`                                 | Mirrors production values minus `values-prod.yaml` overrides for integration testing.             |
| **Production** | `aquapump`     | `aquapump-prod`  | `refs/tags/prod` + `values-prod.yaml`  | Tracks the immutable `prod` tag; promoting a release means retagging and letting Argo CD sync it. |

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

5. Need to validate a remote cluster? From the repository root run `./verify_deployments.sh dev|stage|prod` to exercise frontend, backend, ingress, Argo CD, and Helm in one go.

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
- Optional ExternalSecret integration (`externalSecret.*` values) so credentials can flow from AWS Secrets Manager or ESO without baking them into `values.yaml`.

Override values per environment through Helm values files or the GitOps ApplicationSet overrides. Example Helm install for a new cluster:

```bash
helm upgrade --install aquapump deploy/helm/aquapump \
  --namespace aquapump \
  --create-namespace \
  -f deploy/helm/aquapump/values-local.yaml
```

Create the `aquapump-secrets` secret once with the required keys (e.g. `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, `VITE_REACT_APP_API_BASE`) before running the Helm command. `values-local.yaml` points at localhost ingress and disables ExternalSecret/TLS for kind/minikube; IaC-driven environments keep using the default `values.yaml` plus GitOps overrides. If you prefer inline variables, omit `existingSecret` in the values file and set `backend.env.*`/`frontend.env.*` instead.

For production you can turn on the bundled ExternalSecret (`externalSecret.enabled=true`) and point it at your preferred `SecretStore` so the cluster syncs credentials automatically.

## 6. Terraform & Cluster Bootstrap

The infrastructure lives in `../aquapump-infra` and is applied with standard `terraform init/plan/apply` commands. The stack handles:

1. VPC, subnet, and security group creation inside the target AWS account/region.
2. EKS control plane + managed node groups sized via `nodegroup.tf`.
3. Cluster add-ons via Helm (`ingress-nginx`, `cert-manager`, `Argo CD`, cluster-autoscaler).
4. IAM roles/policies for GitHub OIDC plus Amazon ECR (see `trust-policy.json`, `ecr-policy.json`).

When bootstrapping a new environment, run Terraform first, then apply the Argo CD AppProject and ApplicationSet from `../aquapump-gitops/applications` so the workloads sync automatically.

## 7. Secrets Management

- Local development uses `.env` files (never commit actual secrets).
- Kubernetes recommends [External Secrets Operator](https://external-secrets.io/) or AWS Secrets Manager + `SecretProviderClass`.
- Update Helm chart to reference secrets via environment variable names and `valueFrom` when ESO is available.
- Rotate `SUPABASE_SERVICE_ROLE_KEY` and `AI_API_KEY` regularly; document the rotation schedule in your team runbook.
- For GitOps environments, copy `aquapump-secrets` into `aquapump-dev` and `aquapump-stage` namespaces (or add matching ExternalSecrets) before syncing so FastAPI boots without Pydantic validation errors.

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

1. Roll back to the previous image using Argo CD UI or the CLI: `argocd app rollback aquapump-prod --revision <REV>` (replace with the environment you need).
2. If the cluster is unhealthy, redeploy infrastructure via Terraform and then re-run the Helm install.
3. Restore Supabase backups using the Supabase dashboard or the `supabase` CLI.
4. Document the incident in your operations log and capture follow-up actions.

---

Keep this document close when onboarding new operators or when you need to explain how Aquapump moves from commit to production. Update it whenever you tweak the pipeline, secrets layout, or Kubernetes resources.

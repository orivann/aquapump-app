# Deployment Guide

This document explains how AquaPump moves from source code to production using Helm, Argo CD, and GitHub Actions, and how to spin everything up locally for day-to-day development.

## Local deployment workflow

1. **Prepare the environment**
   - Install Node.js 20+, Python 3.12+, Docker, and Docker Compose.
   - Copy env files and tailor them to your Supabase/AI credentials:
     ```bash
     cp .env.example .env
     cp backend/.env.example backend/.env
     ```
     Ensure `VITE_REACT_APP_API_BASE=http://localhost:8000` in `.env` and fill in Supabase + AI settings inside `backend/.env`.
2. **Start everything with Docker Compose (recommended)**
   ```bash
   docker compose up --build
   ```
   - First run builds two images (`frontend`, `backend`) before starting the containers.
   - Frontend serves on `http://localhost:5173`, backend on `http://localhost:8000`. Health checks keep `frontend` waiting until the API is ready.
   - Keep `VITE_REACT_APP_API_BASE=/api` for Docker Compose so Nginx can proxy `/api/*` to the backend; the entrypoint falls back to `/api` if you mistakenly set a full URL.
   - Stop with `Ctrl+C` and clean up containers/images with `docker compose down --volumes`.
3. **Manual split workflow (if you do not want Docker)**
   - Backend:
     ```bash
     cd backend
     python -m venv .venv
     source .venv/bin/activate
     pip install -r requirements.txt
     uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
     ```
   - Frontend (second terminal):
     ```bash
     npm install
     npm run dev -- --host 0.0.0.0 --port 5173
     ```
     Update `backend/.env` `CORS_ALLOW_ORIGINS` if you expose the dev server to other hosts.
4. **Validate the stack**
   - Quick checks:
     ```bash
     curl http://localhost:8000/health
     curl http://localhost:5173 --head
     ```
   - Full smoke test:
     ```bash
     python scripts/health_check.py \
       --backend-base http://localhost:8000 \
       --frontend-url http://localhost:5173
     ```
     The script blocks until both services respond with HTTP 200.
5. **Iterate**
   - Run backend type checks/tests as you edit (`pytest` if tests exist, `uvicorn --reload` already hot-reloads).
   - Run frontend quality gates (`npm run lint`, `npm run test`) before committing.

## Local Kubernetes cluster (kind/minikube)

Use this path to exercise the Helm chart against a local cluster instead of Docker Compose or AWS.

1. **Install tools** – `kubectl`, `helm`, and either [kind](https://kind.sigs.k8s.io/) (recommended) or [minikube](https://minikube.sigs.k8s.io/). Docker Desktop/Engine must be running because the cluster nodes run as containers/VMs.
2. **Create a cluster with ingress support (kind example)**
   ```bash
   cat <<'EOF' > kind-aquapump.yaml
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   nodes:
     - role: control-plane
       extraPortMappings:
         - containerPort: 80
           hostPort: 8080
         - containerPort: 443
           hostPort: 8443
   EOF
   kind create cluster --name aquapump --config kind-aquapump.yaml
   ```
   This exposes the in-cluster ingress controller on `http://localhost:8080` / `https://localhost:8443`. For minikube you can simply run `minikube start` and enable ingress with `minikube addons enable ingress`.
3. **Install ingress-nginx and cert-manager**

   ```bash
   helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
   helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
     --namespace ingress-nginx --create-namespace \
     --set controller.publishService.enabled=true

   helm repo add jetstack https://charts.jetstack.io
   helm upgrade --install cert-manager jetstack/cert-manager \
     --namespace cert-manager --create-namespace \
     --set installCRDs=true
   ```

4. **Load local container images (optional)** – If you build images locally, tag them (e.g., `aquapump-frontend:dev`, `aquapump-backend:dev`) and run `kind load docker-image aquapump-frontend:dev aquapump-backend:dev --name aquapump`. Rebuild after chart changes so the `dev` tag stays current:
   ```bash
   docker build -t aquapump-frontend:dev -f frontend/Dockerfile .
   docker build -t aquapump-backend:dev -f backend/Dockerfile .
   ```
   Otherwise point the Helm values at images hosted in a pullable registry and configure `global.imagePullSecrets`.
5. **Create secrets and install the chart**

```bash
kubectl create namespace aquapump
kubectl create secret generic aquapump-secrets -n aquapump \
  --from-literal=SUPABASE_URL=... \
  --from-literal=SUPABASE_SERVICE_ROLE_KEY=... \
  --from-literal=AI_API_KEY=...

helm upgrade --install aquapump deploy/helm/aquapump \
  --namespace aquapump \
  -f deploy/helm/aquapump/values-local.yaml
```

Run this command from `aquapump-app/` so Helm can resolve the relative chart path; if you invoke it from another directory (e.g., `aquapump-infra/`), reference the chart via an absolute path or `../aquapump-app/deploy/helm/aquapump`. `values-local.yaml` disables ExternalSecret, drops TLS, and points the ingress at `localhost`. Update the `backend/frontend.image.*` entries inside that file if you publish different tags to your local cluster. The frontend container proxies `/api/*` requests to the in-cluster backend service, so browsers just call `/api/chat` on the same origin—no special DNS entries or Kubernetes-only hostnames are required.

6. **Access the app** – With the kind config above, browse to `http://localhost:8080` for the frontend and `http://localhost:8080/api` for backend routes. Alternatively, port-forward: `kubectl port-forward svc/aquapump-frontend 8081:80 -n aquapump`.
7. **Cleanup** – `kind delete cluster --name aquapump && rm kind-aquapump.yaml`. For minikube run `minikube delete`.

## Production deployment checklist

1. **Provision or update infrastructure** – From `aquapump-infra/`, run Terraform (`terraform init/plan/apply`) to ensure VPC, EKS, ingress, cert-manager, and Argo CD exist.
2. **Build and publish images** – The GitHub Actions pipeline builds/pushes both Docker images on every merge to `main`. For emergency/manual releases, run `docker build` for `backend` and `frontend`, tag with the desired version, and push to Amazon ECR.
3. **Manage runtime secrets** – Create or update the `aquapump-secrets` Kubernetes Secret (or configure External Secrets) so the Helm chart can mount Supabase/AI credentials.
4. **Promote configuration** – Update `deploy/helm/aquapump/values*.yaml` with new image tags or settings, commit, and push.
5. **Deploy via Helm or Argo CD** – Either run `helm upgrade --install ...` (below) for a direct rollout or rely on the Argo CD ApplicationSet syncing the repository automatically (`aquapump-dev|stage|prod`).
6. **Observe and verify** – Use `kubectl`, `argocd app get aquapump-prod` (swap for `-dev`/`-stage`), and `scripts/health_check.py` (pointed at the public endpoints) to make sure pods become `Ready`, Argo reports `Healthy/Synced`, and smoke tests pass.

## Kubernetes prerequisites

- Kubernetes cluster with an ingress controller (examples assume `nginx`).
- Amazon ECR repositories `aquapump/backend` and `aquapump/frontend`.
- Argo CD installed in the cluster.
- GitHub OpenID Connect role (`AWS_GITHUB_ROLE_ARN`) granting push access to ECR and (optionally) read access to secrets.
- Optional: External Secrets Operator if you want GitHub Actions or AWS Secrets Manager to feed runtime secrets.

## Secrets

1. Create the shared Kubernetes secret referenced by the chart:

   ```bash
   kubectl create namespace aquapump
   kubectl create secret generic aquapump-secrets \
     --namespace aquapump \
     --from-literal=SUPABASE_URL=... \
     --from-literal=SUPABASE_SERVICE_ROLE_KEY=... \
     --from-literal=AI_API_KEY=... \
     --from-literal=VITE_REACT_APP_API_BASE=/api
   ```

   The `/api` default keeps requests on the same origin and lets the frontend pod proxy traffic to the backend service internally. Override it with a full URL (e.g., `https://api.aqua-pump.net`) only if you have public DNS set up for the API host.

2. (Optional) Enable the bundled ExternalSecret by setting `externalSecret.enabled=true` and pointing `secretStoreRef` at your provider. The Kubernetes secret above is still created, but now gets populated automatically.

## Helm chart

Render manifests for a dry run:

```bash
helm template aquapump deploy/helm/aquapump \
  -f deploy/helm/aquapump/values-local.yaml
```

Deploy or upgrade:

```bash
helm upgrade --install aquapump deploy/helm/aquapump \
  --namespace aquapump \
  --create-namespace \
  -f deploy/helm/aquapump/values-local.yaml
```

Use additional value files (e.g. `values-prod.yaml` for production or `values-local.yaml` for kind/minikube) for environment-specific overrides such as enabling `externalSecret` or pointing ingress at localhost.

## Argo CD

Apply the AppProject and ApplicationSet from the GitOps repository once (from the repo root):

```bash
kubectl apply -n argocd -f ../aquapump-gitops/applications/project.yaml
kubectl apply -n argocd -f ../aquapump-gitops/applications/aquapump-applicationset.yaml
```

The ApplicationSet renders three Applications (`aquapump-dev`, `aquapump-stage`, `aquapump-prod`) that continuously sync the Helm chart from this repository using the environment overrides in `aquapump-gitops/environments/<env>/values.yaml`. Use the CLI to trigger manual syncs or monitor status:

```bash
argocd app sync aquapump-dev
argocd app get aquapump-dev
```

When promoting through infrastructure-as-code, stick with the Terraform → ApplicationSet flow: update `deploy/helm/aquapump/values.yaml` plus the overrides in `aquapump-gitops/environments/` and let Argo CD reconcile each environment instead of applying ad-hoc manifests.

## GitHub Actions pipeline

Workflow: `.github/workflows/main.yaml`

1. **Quality gates** – lint/build the frontend and compile the backend for syntax errors.
2. **Build & push** – build Docker images with Buildx (cached) and push tags `<sha>` and `latest` (on `main`) to Amazon ECR.
3. **Deploy** – update Helm image tags, commit the change back to `main`, and trigger an Argo CD sync. The workflow waits for the application to become Healthy & Synced and rolls back automatically if health checks fail.

Ensure the following secrets exist in the repository settings:

- `AWS_GITHUB_ROLE_ARN`
- `ARGOCD_SERVER`
- `ARGOCD_AUTH_TOKEN`

## Automated verification script

After any deployment (local, staging, or production), run the repository-level helper to perform HTTP checks plus Argo CD/Helm validation:

```bash
./verify_deployments.sh dev     # or stage / prod
```

Override the default endpoints via `FRONTEND_URL`, `BACKEND_URL`, and `INGRESS_URL` if your environment differs. Set `ARGOCD_SERVER`, `ARGOCD_AUTH_TOKEN`, and `ARGOCD_FLAGS` (e.g., `--grpc-web --insecure`) so the script can verify GitOps status; configure `KUBECONFIG`/`helm` context for Helm release checks.

## Troubleshooting

- `kubectl get events -n aquapump --sort-by=.metadata.creationTimestamp` to inspect rollout issues.
- `kubectl logs deploy/aquapump-backend -n aquapump` for API failures.
- `argocd app history aquapump-prod` (swap prod for dev/stage) to review recent syncs/rollbacks.
- `python scripts/health_check.py --backend-base https://api.aquapump.net --frontend-url https://aquapump.net` for post-deploy smoke tests.
- `docker compose ps` and `docker compose logs -f backend` help diagnose local startup issues (missing env vars, Supabase connectivity, etc.).

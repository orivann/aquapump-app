# Deployment Guide

This guide covers three common scenarios:

1. **Local development without Kubernetes**
2. **Local Kubernetes rehearsal (kind/minikube)**
3. **Production-ready flow (Terraform + Argo CD ApplicationSet)**

Each section includes prerequisites, exact commands, and clean-up steps.

---

## 1. Local Development (Docker Compose or manual)

### 1.1 Bootstrap

```bash
cd aquapump-app
cp .env.example .env
cp backend/.env.example backend/.env
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Stop: `Ctrl+C` → `docker compose down --volumes`

Keep `VITE_REACT_APP_API_BASE=/api`; the Nginx entrypoint rewrites `/api/*` to the backend container.

### 1.2 Manual split (optional)

```bash
# Backend
cd aquapump-app/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd aquapump-app
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### 1.3 Smoke tests

```bash
python scripts/health_check.py \
  --backend-base http://localhost:8000 \
  --frontend-url http://localhost:5173
```

---

## 2. Local Kubernetes (kind/minikube)

### 2.1 Create a cluster (kind example)

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

Install ingress-nginx and cert-manager exactly as the production chart expects:

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

### 2.2 Images & secrets

Optionally build local images and load them into kind:

```bash
docker build -t aquapump-frontend:dev -f frontend/Dockerfile .
docker build -t aquapump-backend:dev -f backend/Dockerfile .
kind load docker-image aquapump-frontend:dev aquapump-backend:dev --name aquapump
```

Create the shared secret and install the chart (run from `aquapump-app/`):

```bash
kubectl create namespace aquapump
kubectl create secret generic aquapump-secrets -n aquapump \
  --from-literal=SUPABASE_URL=stub \
  --from-literal=SUPABASE_SERVICE_ROLE_KEY=stub \
  --from-literal=AI_API_KEY=stub

helm upgrade --install aquapump deploy/helm/aquapump \
  --namespace aquapump \
  -f deploy/helm/aquapump/values-local.yaml
```

`values-local.yaml` disables TLS/ExternalSecret, sets ingress hosts to `localhost`, and expects the `dev` image tag.

### 2.3 Access & cleanup

- UI: http://localhost:8080 (via kind port-mapping)
- Backend health: http://localhost:8080/api/health
- Cleanup: `kind delete cluster --name aquapump && rm kind-aquapump.yaml`

---

## 3. Production Flow (Terraform + GitOps)

### 3.1 Provision infrastructure

```bash
cd aquapump-infra
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

Terraform installs Argo CD, ingress-nginx, cert-manager, and EKS foundational pieces.

### 3.2 Bootstrap Argo CD ApplicationSet

```bash
kubectl apply -n argocd -f aquapump-gitops/applications/project.yaml
kubectl apply -n argocd -f aquapump-gitops/applications/aquapump-applicationset.yaml
```

The ApplicationSet renders `aquapump-dev`, `aquapump-stage`, and `aquapump-prod` using multi-source manifests (Helm chart from `aquapump-app`, values from `aquapump-gitops/environments/...`).

### 3.3 Secrets & image tags

- Ensure `aquapump-secrets` exists in each namespace (`aquapump`, `aquapump-stage`, `aquapump-dev`) or configure External Secrets.
- Copy `ecr-creds` into every namespace so pods can pull from Amazon ECR.
- CI pipeline tags images with `<short_sha>-<branch>` and `latest`; dev/stage default to `latest`, prod uses `refs/tags/prod`.

### 3.4 Argo CD CLI quick reference

```bash
kubectl port-forward -n argocd svc/argocd-server 8080:80
argocd login localhost:8080 --username admin --password <pw> --plaintext --insecure

argocd app sync aquapump-dev
argocd app get aquapump-prod
argocd app history aquapump-stage
```

Set `--config /tmp/argocd/config` (or `ARGOCD_CONFIG`) if your environment requires a custom config path.

### 3.5 Validation & runbooks

- `kubectl get pods -n aquapump{,-stage,-dev}`
- `./verify_deployments.sh dev|stage|prod`
- `argocd app get aquapump-prod` should report `Synced`/`Healthy`

### 3.6 Promotions

1. Merge to `main` → CI builds/pushes images and updates helm values.
2. Update GitOps overrides (`environments/<env>/values.yaml`) as needed (e.g., enabling ingress or adjusting secrets).
3. Tag production release (`git tag prod <commit>`) and push; Argo CD reconciles `aquapump-prod` automatically.

---

## Troubleshooting

| Symptom                                  | Likely cause                               | Fix                                                                                                          |
| ---------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------------- |
| `ImagePullBackOff`                       | Missing `ecr-creds` or incorrect image tag | `kubectl describe pod` → ensure secret exists & tag was pushed                                               |
| Backend crash loops with Pydantic errors | `aquapump-secrets` missing in namespace    | Copy secret: `kubectl get secret aquapump-secrets -n aquapump -o yaml                                        | sed 's/namespace: aquapump/namespace: aquapump-stage/' | kubectl apply -f -` |
| Argo CD sync fails on ingress            | Dev shares host with stage/prod            | Disable dev ingress (`ingress.enabled=false`) or use a unique hostname                                       |
| CLI errors writing `~/.argocd/config`    | Read-only home dir                         | Use `--config /tmp/argocd/config` or adjust permissions                                                      |
| Cannot reach Argo CD                     | Service is ClusterIP                       | Port-forward (`kubectl port-forward -n argocd svc/argocd-server 8080:80`) or expose via ingress/LoadBalancer |

---

## Reference Files

- `deploy/helm/aquapump/values.yaml` – baseline chart configuration
- `deploy/helm/aquapump/values-local.yaml` – local-k8s overrides (no ingress TLS, dev image tag)
- `aquapump-gitops/environments/<env>/values.yaml` – GitOps overrides per environment
- `aquapump-gitops/applications/aquapump-applicationset.yaml` – multi-source ApplicationSet definition

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

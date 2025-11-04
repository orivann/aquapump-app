# Aquapump Environment Runbook

This runbook walks you through running Aquapump in three contexts:

- Local developer workstation (Docker Compose or split services)
- Local Kubernetes cluster (kind or minikube)
- AWS infrastructure via Terraform + Argo CD (production parity)

Each section includes prerequisites, step-by-step commands, verification checks, and common troubleshooting tips.

---

## 1. Local Developer Stack

### 1.1 Prerequisites

- Docker Engine + Docker Compose v2
- Node.js 20 and npm
- Python 3.12 + `pip`
- Supabase project (URL + service-role key) and AI provider key

### 1.2 Prepare configuration

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Populate the copies:

- `.env` → set `VITE_REACT_APP_API_BASE=http://localhost:8000`
- `backend/.env` → fill `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, and optional overrides (`AI_MODEL`, `CORS_ALLOW_ORIGINS`, etc.)

### 1.3 Start with Docker Compose (recommended)

```bash
docker compose up --build
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:8000>
- Stop: `Ctrl+C`
- Clean up: `docker compose down --volumes`

### 1.4 Manual split (optional)

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Frontend (new terminal):

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### 1.5 Verify locally

```bash
curl http://localhost:8000/health
curl -I http://localhost:5173
python scripts/health_check.py \
  --backend-base http://localhost:8000 \
  --frontend-url http://localhost:5173
```

### 1.6 Troubleshooting

- **Backend exits immediately** → check `.env` entries, especially Supabase keys.
- **Frontend cannot reach API** → ensure `VITE_REACT_APP_API_BASE` matches the backend URL.
- **Docker port conflicts** → stop other services or change `docker-compose.yaml` port mappings.

---

## 2. Local Kubernetes Cluster (kind/minikube)

### 2.1 Prerequisites

- `kubectl`, `helm`, and either [kind](https://kind.sigs.k8s.io/) or [minikube](https://minikube.sigs.k8s.io/)
- Docker Engine running (kind nodes run as Docker containers)

### 2.2 Create a cluster (kind example)

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

For minikube:

```bash
minikube start
minikube addons enable ingress
```

### 2.3 Install ingress and cert-manager

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

### 2.4 Load or reference container images

- Build locally and load: `kind load docker-image aquapump-backend:dev aquapump-frontend:dev --name aquapump`
- OR use published images and configure `global.imagePullSecrets` / `backend.image.repository` / `frontend.image.repository`

### 2.5 Create runtime secret

```bash
kubectl create namespace aquapump
kubectl create secret generic aquapump-secrets \
  --namespace aquapump \
  --from-env-file=backend/.env \
  --from-env-file=.env
```

Ensure the env files contain at least:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AI_API_KEY`
- `VITE_REACT_APP_API_BASE=/api` (for in-cluster proxying)

### 2.6 Install the Helm chart

```bash
helm upgrade --install aquapump deploy/helm/aquapump \
  --namespace aquapump \
  --create-namespace \
  -f deploy/helm/aquapump/values-local.yaml
```

Run the command from the `aquapump-app/` directory (or reference the chart with an absolute/`../aquapump-app/...` path) so Helm finds the chart. Adjust the image overrides inside `values-local.yaml` to match either local tags or a remote registry.

### 2.7 Verify the cluster deployment

```bash
kubectl get pods -n aquapump
kubectl rollout status deployment aquapump-backend -n aquapump
kubectl rollout status deployment aquapump-frontend -n aquapump
kubectl logs deploy/aquapump-backend -n aquapump --tail=50
kubectl logs deploy/aquapump-frontend -n aquapump --tail=50
```

Access via ingress (`http://localhost:8080`) or port-forward:

```bash
kubectl port-forward svc/aquapump-frontend 8081:80 -n aquapump
kubectl port-forward svc/aquapump-backend 8000:8000 -n aquapump
```

Run the health script against the forwarded ports.

### 2.8 Troubleshooting

- **ErrImagePull/ImagePullBackOff** → image tags incorrect or missing pull secret (`ecr-creds`). Create the secret and set `global.imagePullSecrets`.
- **Backend crash loops** → check `kubectl logs` for Pydantic validation errors; ensure `aquapump-secrets` holds Supabase/AI keys.
- **Ingress 404** → confirm ingress class is `nginx` and hosts match; for local testing you can comment out the TLS block or set hosts to `localhost`.
- **kind DNS caching old IPs** → delete and recreate the cluster if ingress IP mappings become stale.

---

## 3. AWS Infrastructure as Code (EKS + Argo CD)

### 3.1 Overview

The production topology is managed out of `aquapump-infra` (Terraform) and `aquapump-gitops` (Argo CD Applications + Helm chart). The flow:

1. Terraform provisions VPC, EKS cluster, managed node groups, ingress-nginx, cert-manager, and Argo CD.
2. GitHub Actions builds/pushes Docker images to Amazon ECR (`aquapump/backend`, `aquapump/frontend`).
3. Argo CD syncs the Helm chart (`aquapump-app/deploy/helm/aquapump`) into environment namespaces (`aquapump-dev`, `aquapump-stage`, `aquapump`).

### 3.2 Terraform prerequisites

- AWS CLI configured with access to the target account (OIDC or IAM user)
- Terraform 1.5.7+ (binary included in `aquapump-infra/terraform_1.5.7_linux_amd64.zip` if needed)
- Bucket/DynamoDB table for remote state (configure in `backend.tf` if not already)

### 3.3 Apply infrastructure

```bash
cd aquapump-infra
terraform init
terraform workspace select prod # or dev/stage if defined
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

Outputs include kubeconfig, Argo CD admin password, and load balancer endpoints. After apply, export kubeconfig:

```bash
aws eks update-kubeconfig --name <cluster-name> --region eu-central-1
```

### 3.4 Bootstrap Argo CD applications

From `aquapump-gitops/`:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f applications/project.yaml
kubectl apply -n argocd -f applications/aquapump-applicationset.yaml
```

The ApplicationSet renders `aquapump-dev`, `aquapump-stage`, and `aquapump-prod`, each combining the base chart with `environments/<env>/values.yaml`.

### 3.5 Accessing Argo CD

1. Port-forward the API/UI (leave this running while you use the CLI or UI):

   ```bash
   kubectl port-forward -n argocd svc/argocd-server 8080:80
   ```

2. In a second terminal, log in with the CLI using the initial admin password (or a personal token):

   ```bash
   argocd login localhost:8080 \
     --username admin \
     --password <secret> \
     --grpc-web \
     --insecure
   ```

3. Inspect or sync applications:

   ```bash
   argocd app get aquapump-prod    # swap prod for dev/stage as needed
   argocd app sync aquapump-prod   # optional manual sync
   ```

### 3.5 Registry credentials (`ecr-creds`)

Nodes in managed EKS clusters usually assume an IAM role that grants ECR pull rights. For local clusters or if using kubeconfig outside AWS, create the secret manually:

```bash
aws ecr get-login-password --region eu-central-1 | \
kubectl create secret docker-registry ecr-creds \
  --namespace aquapump \
  --docker-server=043309328819.dkr.ecr.eu-central-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password-stdin
```

Ensure `global.imagePullSecrets` includes `ecr-creds` (see `values.yaml`/`values-prod.yaml`) or add it via Argo CD parameter overrides.

### 3.6 Runtime secrets

Populate the base secret in each namespace:

```bash
kubectl create secret generic aquapump-secrets \
  --namespace aquapump \
  --from-env-file=backend/.env \
  --from-env-file=.env \
  --dry-run=client -o yaml | kubectl apply -f -
```

Copy the secret into the staging and development namespaces before syncing those environments so the backend passes Pydantic validation:

```bash
kubectl get secret aquapump-secrets -n aquapump -o yaml | \
  sed 's/namespace: aquapump/namespace: aquapump-stage/' | kubectl apply -f -
kubectl get secret aquapump-secrets -n aquapump -o yaml | \
  sed 's/namespace: aquapump/namespace: aquapump-dev/' | kubectl apply -f -
```

For production, enable `externalSecret` in `values-prod.yaml` so AWS Secrets Manager/ESO owns the secret contents:

```yaml
externalSecret:
  enabled: true
  secretStoreRef:
    kind: ClusterSecretStore
    name: aws-secrets
  data:
    - secretKey: SUPABASE_URL
      remoteRef:
        key: prod/aquapump
        property: SUPABASE_URL
    ...
```

### 3.7 Deploying updates

1. Push code to GitHub → Actions builds images, updates Helm values, triggers Argo sync.
2. Monitor rollout:

```bash
argocd app get aquapump-prod   # or aquapump-stage / aquapump-dev
kubectl get pods -n aquapump
kubectl rollout status deployment aquapump-backend -n aquapump
```

3. Run smoke test script against public endpoints once ingress is live.

### 3.8 Troubleshooting in AWS

- **ErrImagePull** → verify `ecr-creds` secret exists or node IAM role has ECR permissions. Check pods with `kubectl describe`.
- **CrashLoopBackOff** → usually missing secrets. Confirm `aquapump-secrets` keys or ExternalSecret status.
- **Ingress not reachable** → wait for the AWS load balancer to provision; inspect `kubectl get svc -n ingress-nginx` and route53/DNS settings.
- **Argo CD out of sync** → check `argocd app diff aquapump-prod` and sync manually.

---

## 4. Verification Checklist

| Scope | Command | Expectation |
| ----- | ------- | ----------- |
| Pods  | `kubectl get pods -n aquapump` | Backend & frontend show `1/1 Running` |
| Deployments | `kubectl rollout status deployment aquapump-backend -n aquapump` | Successful rollout |
| Logs | `kubectl logs deploy/aquapump-backend -n aquapump --tail=100` | No Pydantic errors |
| Health | `python scripts/health_check.py --backend-base <url> --frontend-url <url>` | Both checks pass |
| Argo | `argocd app get aquapump-prod` | `Sync Status: Synced`, `Health Status: Healthy` |

Keep this runbook aligned with automation updates (Terraform, Helm, GitHub Actions). When any workflow changes, update the relevant section with the exact command sequence and new verification steps.

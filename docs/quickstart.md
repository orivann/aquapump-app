# AquaPump Quickstart Guide

This quickstart walks through the minimum steps to see AquaPump running locally, validate the stack, and ship changes through the delivery pipeline. For deeper background consult [`README.md`](../README.md) and the in-repo comments referenced below.

## 1. Clone & install prerequisites

1. Clone the repository and switch into the project directory:
   ```bash
   git clone https://github.com/<your-org>/aquapump.git
   cd aquapump
   ```
2. Install the core tooling:
   - **Node.js 20+** (ships with `npm`)
   - **Python 3.12+**
   - **Docker Desktop** (optional for local parity)
   - **Terraform 1.6+** and **AWS CLI v2** if you plan to provision the reference infrastructure

## 2. Prepare environment variables

Copy the provided examples and fill in secrets before running the stack:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Required backend settings are documented in [`backend/.env.example`](../backend/.env.example) and summarised in the README. At a minimum you need Supabase credentials and an AI API key. Security toggles introduced in the latest hardening pass—host allow-lists, HTTPS redirects, security headers, gzip thresholds—can remain at their defaults for local runs.

## 3. Launch the app locally

### Option A – Docker Compose (fastest path)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:8000

Both containers expose health checks so `docker compose ps` indicates readiness once the services finish booting.

### Option B – Manual dev servers

Run the backend in one terminal:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Run the frontend in another terminal:

```bash
npm install
npm run dev
```

Visit http://localhost:5173. Append `-- --host 0.0.0.0` to expose the dev server across your LAN.

## 4. Run quality gates

Before pushing a change, execute the same checks enforced in CI:

```bash
npm run lint
npm run build
pytest backend/tests
```

Optional but recommended:

- `python scripts/health_check.py --backend-base http://localhost:8000 --frontend-url http://localhost:5173`
- `npm run test` for component/unit coverage (when tests are added)

## 5. Build container images (local validation)

```bash
npm run build
docker build -t aquapump-frontend:local -f frontend/Dockerfile frontend

docker build -t aquapump-backend:local -f backend/Dockerfile backend
```

Push the images to your registry or load them into your cluster as needed. The GitHub Actions workflow handles this automatically on the main branch.

## 6. Provision the reference infrastructure (optional)

The [`terraform/`](../terraform) directory creates a single Ubuntu EC2 instance, installs K3s, and bootstraps Argo CD plus ingress. To use it:

```bash
export AWS_REGION=eu-central-1
export AWS_PROFILE=<profile>
export TF_VAR_key_name=<existing-ec2-key>

terraform -chdir=terraform init
terraform -chdir=terraform apply
```

Key variables you might want to override up front:

- `metallb_address_pool` to advertise IPs that are routable in your VPC
- `http_ingress_cidrs` / `https_ingress_cidrs` to restrict traffic sources
- `enable_ssm` to bootstrap AWS Systems Manager access
- `ingress_nginx_chart_version` and related add-on pins to control upgrade cadence

Grab the `public_ip` output, SSH using the key pair supplied above, then pull the Argo CD admin password from `/root/argocd-initial-admin-password`.

When finished, execute `terraform/cleanup.sh` with the instance IP (and optionally the SSH key path) to tear everything down safely.

## 7. Deploy through Argo CD & Helm

Argo CD tracks the Helm chart in [`deploy/helm/aquapump`](../deploy/helm/aquapump). Customise the installation by layering overrides in the environment-specific value files (`values-dev.yaml`, etc.) or by supplying your own Helm values. Recent enhancements worth noting:

- `global.*` keys propagate pod labels, annotations, node selectors, and resource defaults across both services.
- Component `serviceAccount`, `autoscaling`, and `pdb` blocks are opt-in and render only when explicitly enabled.
- Services and ingresses accept extra annotations and rules so you can integrate with your ingress controller or mesh without modifying templates.

After updating values, sync the corresponding Argo CD `Application` or rely on the GitHub Actions deployment workflow to build, scan with Trivy, push images, and trigger the rollout automatically.

## 8. Troubleshooting checklist

- **API 403/404 locally** – verify `CORS_ALLOW_ORIGINS` and `TRUSTED_HOSTS` in `backend/.env` include your dev hostnames.
- **Slow responses** – adjust `AI_REQUEST_TIMEOUT`, confirm Supabase credentials, and check the AI provider status.
- **Terraform apply fails** – run `terraform fmt` locally (CI enforces formatting) and confirm AWS credentials/quotas.
- **Argo CD sync errors** – use `kubectl describe application <env> -n argocd` and review the retry/finalizer settings added in the project manifests.

With these steps you can replicate the full AquaPump workflow—from local coding to production-ready deployments—in minutes.

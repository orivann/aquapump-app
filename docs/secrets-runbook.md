# Secrets and configuration runbook

This guide explains how AquaPump secrets are managed across Terraform, Helm, External Secrets Operator (ESO), Docker Compose, and GitHub Actions.

## AWS credentials for Terraform

Terraform authenticates with AWS using environment variables. Export the following before running `terraform init` or `terraform plan`:

```bash
export AWS_PROFILE=aquapump-infra            # or set AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
export AWS_REGION=eu-central-1
export TF_WORKSPACE=prod                     # optional workspace isolation
```

See [README.md](../README.md#terraform-provisioning) for the end-to-end Terraform workflow.

## External Secrets Operator (ESO)

The Helm chart provisions two ESO manifests when `externalSecrets.enabled` is `true`:

- `aquapump-backend` – expects backend credentials (Supabase URL/service key, AI provider token, optional overrides).
- `aquapump-frontend` – provides build-time environment variables for the SPA (`VITE_REACT_APP_API_BASE`, `VITE_PUBLIC_SITE_ORIGIN`).

### Secret layout

| Environment | Store path | Keys |
|-------------|------------|------|
| `dev`       | `dev/aquapump/backend`, `dev/aquapump/frontend` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, `API_BASE_URL`, ... |
| `staging`   | `staging/aquapump/backend`, `staging/aquapump/frontend` | Same as `dev`, with staging-specific values |
| `prod`      | `prod/aquapump/backend`, `prod/aquapump/frontend` | Production credentials |

Each key maps directly to the environment variable injected into the container. Update or rotate secrets by writing to the relevant path (AWS Secrets Manager or Parameter Store), then allow ESO to refresh the Kubernetes `Secret`.

### Rotation procedure

1. Generate the new credential (Supabase service key, OpenAI API key, etc.).
2. Update the secret in AWS Secrets Manager:
   ```bash
   aws secretsmanager put-secret-value \
     --secret-id prod/aquapump/backend \
     --secret-string '{"AI_API_KEY":"sk-new..."}'
   ```
3. Verify the ESO sync status:
   ```bash
   kubectl describe externalsecret aquapump-backend -n aquapump
   kubectl get secret aquapump-backend -n aquapump -o yaml
   ```
4. Redeploy (or allow the rolling update) if the application requires a restart.

## GitHub Actions environments

| Secret | Description | Scope |
|--------|-------------|-------|
| `AWS_GITHUB_ROLE_ARN` | IAM role assumed via OIDC for ECR pushes and Terraform plan/apply steps. | All environments |
| `ARGOCD_SERVER` | HTTPS endpoint for the Argo CD API server. | staging/prod |
| `ARGOCD_AUTH_TOKEN` | Short-lived Argo CD auth token used by the CLI. Rotate via `argocd account generate-token`. | staging/prod |
| `AWS_STATE_BUCKET` | Overrides Terraform backend bucket when running in CI. Optional; defaults to `aquapump-terraform-state`. | All |
| `AWS_STATE_DYNAMODB_TABLE` | Overrides Terraform lock table. Optional. | All |

Create separate GitHub Environments for `dev`, `staging`, and `prod` and scope deployments accordingly. Use required reviewers on `prod` to enforce manual approvals.

## Argo CD tokens

- Generate tokens with minimal scopes (`login`, `applications`, `projects`).
- Store them in GitHub Actions or use SSM via OIDC.
- Rotate quarterly or when staff change; revoke via `argocd account token delete`.

## Local parity

- `docker-compose.yml` reads `backend/.env` to match Kubernetes secrets. Keep the sample file (`backend/.env.example`) updated when secrets change.
- Frontend build args mimic `VITE_REACT_APP_API_BASE` to ensure SSR assets reference the correct API host.

Keeping these artifacts in sync ensures Terraform, Helm, Compose, and CI all agree on the expected configuration.

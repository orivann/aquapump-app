# Deployment Guide

This document explains how AquaPump moves from source code to production using Helm, Argo CD, and GitHub Actions.

## Prerequisites

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
     --from-literal=VITE_REACT_APP_API_BASE=https://api.aquapump.net
   ```

2. (Optional) Enable the bundled ExternalSecret by setting `externalSecret.enabled=true` and pointing `secretStoreRef` at your provider. The Kubernetes secret above is still created, but now gets populated automatically.

## Helm chart

Render manifests for a dry run:

```bash
helm template aquapump deploy/helm/aquapump \
  --set backend.existingSecret=aquapump-secrets \
  --set frontend.existingSecret=aquapump-secrets
```

Deploy or upgrade:

```bash
helm upgrade --install aquapump deploy/helm/aquapump \
  --namespace aquapump \
  --create-namespace \
  --set backend.existingSecret=aquapump-secrets \
  --set frontend.existingSecret=aquapump-secrets
```

Use additional value files (e.g. `values-prod.yaml`) for environment-specific overrides such as enabling `externalSecret`.

## Argo CD

Apply `deploy/argocd/application.yaml` once:

```bash
kubectl apply -f deploy/argocd/application.yaml -n argocd
```

Argo CD will continuously sync the Helm chart from this repository. Use the CLI to trigger manual syncs or monitor status:

```bash
argocd app sync aquapump
argocd app get aquapump
```

## GitHub Actions pipeline

Workflow: `.github/workflows/main.yaml`

1. **Quality gates** – lint/build the frontend and compile the backend for syntax errors.
2. **Build & push** – build Docker images with Buildx (cached) and push tags `<sha>` and `latest` (on `main`) to Amazon ECR.
3. **Deploy** – update Helm image tags, commit the change back to `main`, and trigger an Argo CD sync. The workflow waits for the application to become Healthy & Synced and rolls back automatically if health checks fail.

Ensure the following secrets exist in the repository settings:

- `AWS_GITHUB_ROLE_ARN`
- `ARGOCD_SERVER`
- `ARGOCD_AUTH_TOKEN`

## Troubleshooting

- `kubectl get events -n aquapump --sort-by=.metadata.creationTimestamp` to inspect rollout issues.
- `kubectl logs deploy/aquapump-backend -n aquapump` for API failures.
- `argo app history aquapump` to review recent syncs/rollbacks.
- `python scripts/health_check.py --backend-base https://api.aquapump.net --frontend-url https://aquapump.net` for post-deploy smoke tests.

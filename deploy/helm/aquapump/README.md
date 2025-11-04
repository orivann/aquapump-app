# AquaPump Helm Chart

This chart deploys the AquaPump frontend and backend workloads. It is designed to work without any optional operators, and can be extended when you want External Secrets or additional environment sources.

## Requirements

- Kubernetes 1.24+
- (Optional) Docker registry credentials exposed via an `imagePullSecret` named `ecr-creds`
- (Optional) External Secrets Operator when you enable `externalSecret.enabled`

## Quick Start

Render the manifests to verify your settings:

```bash
helm template aquapump ./deploy/helm/aquapump
```

Install using inline environment values:

```bash
helm upgrade --install aquapump ./deploy/helm/aquapump \
  --namespace aquapump --create-namespace \
  --set-string backend.env.SUPABASE_URL="$SUPABASE_URL" \
  --set-string backend.env.SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  --set-string backend.env.AI_API_KEY="$AI_API_KEY" \
  --set-string frontend.env.VITE_REACT_APP_API_BASE="$VITE_REACT_APP_API_BASE"
```

If you prefer Kubernetes secrets, create them once and reference them via `existingSecret`:

```bash
kubectl create secret generic aquapump-secrets \
  --namespace aquapump \
  --from-literal=SUPABASE_URL=... \
  --from-literal=SUPABASE_SERVICE_ROLE_KEY=... \
  --from-literal=AI_API_KEY=... \
  --from-literal=VITE_REACT_APP_API_BASE=...

helm upgrade --install aquapump ./deploy/helm/aquapump \
  --namespace aquapump --create-namespace \
  -f values-local.yaml
```

`values-local.yaml` disables ExternalSecret/TLS and maps ingress hosts to `localhost` so you can run the chart on kind/minikube without extra flags. Cloud environments continue to rely on `values.yaml` plus any GitOps overrides.

## Configuration Highlights

- `backend` / `frontend`: control replicas, container images, inline env vars, and optional `envFrom` sources.
- `existingSecret`: when set, the Deployment adds an `envFrom.secretRef` so you keep secrets in Kubernetes instead of Helm values.
- `externalSecret`: disabled by default. Set `externalSecret.enabled=true` and provide `secretStoreRef` plus `data` entries to sync secrets from your provider into the cluster.
- `ingress`: two independent ingress configurations (`frontend` and `backend`) that you can enable/disable or override per environment.

Refer to `values.yaml` for the full set of options.

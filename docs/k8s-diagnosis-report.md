# Aquapump K8s Diagnose & Fix Report

## Overview

A diagnose→fix pass was attempted against the existing Kubernetes, Helm, and Argo CD configuration. Local Helm chart updates were prepared to align ingress routing and service ports with the production domain (`aqua-pump.net`). Cluster-level diagnostics and changes could not be executed because the current environment does not provide `kubectl` or `helm` binaries.

## Successes

- Reviewed the `deploy/helm/aquapump` chart and updated values/templates so the frontend and backend publish distinct ingress resources, expose the correct container ports (5173/8000), and remain aligned with the AWS ECR repositories. 【F:deploy/helm/aquapump/values.yaml†L1-L64】【F:deploy/helm/aquapump/templates/deployment-frontend.yaml†L24-L42】【F:deploy/helm/aquapump/templates/deployment-backend.yaml†L24-L42】【F:deploy/helm/aquapump/templates/ingress.yaml†L1-L29】【F:deploy/helm/aquapump/templates/ingress-backend.yaml†L1-L32】【F:deploy/helm/aquapump/templates/service-frontend.yaml†L1-L17】
- Documented the required DNS records and cluster-level follow-up steps so the platform owner can complete the rollout once cluster access is available.

## Failures

| Action                                                   | Reason                                                                      | Suggested Fix                                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `kubectl version --short`                                | `kubectl` binary unavailable in the execution environment. 【bbfbde†L1-L2】 | Install/configure `kubectl` (with the live cluster context) before retrying diagnostics. |
| `kubectl get nodes -o wide`                              | `kubectl` binary unavailable. 【20c9a1†L1-L2】                              | Same as above.                                                                           |
| `kubectl get ns`                                         | `kubectl` binary unavailable. 【4f7ddf†L1-L2】                              | Same as above.                                                                           |
| `kubectl get pods,svc,ing -A`                            | `kubectl` binary unavailable. 【e4bdda†L1-L2】                              | Same as above.                                                                           |
| `kubectl get events -A --sort-by=.lastTimestamp`         | `kubectl` binary unavailable. 【cd831b†L1-L2】                              | Same as above.                                                                           |
| `helm ls -A`                                             | `helm` binary unavailable in the execution environment. 【92dce6†L1-L2】    | Install/configure `helm` before reviewing release state.                                 |
| `kubectl -n argocd get svc argocd-server -o yaml`        | `kubectl` binary unavailable. 【29b9ef†L1-L2】                              | Install/configure `kubectl`.                                                             |
| `kubectl -n argocd get ing`                              | `kubectl` binary unavailable. 【52a4fa†L1-L2】                              | Install/configure `kubectl`.                                                             |
| `kubectl -n argocd logs deploy/argocd-server --tail=300` | `kubectl` binary unavailable. 【44dac6†L1-L2】                              | Install/configure `kubectl`.                                                             |

Because `kubectl`/`helm` were unavailable, MetalLB, ingress-nginx, Argo CD exposure, workload rollout, and HTTP validation could not be executed during this pass.

## Required User Actions

1. **Restore CLI access** – Ensure `kubectl` and `helm` are installed locally (or run the agent inside an environment that already has access to the live cluster context).
2. **Apply Helm chart changes** – Commit/push these updates, allow Argo CD to sync, or run `helm upgrade --install` once CLI access is restored.
3. **Create GoDaddy DNS records once external IPs/DNS names are known:**
   - `aqua-pump.net` → `A` record pointing to the frontend ingress/load balancer IP or hostname (TTL 300).
   - `api.aqua-pump.net` → `A` record pointing to the backend ingress/load balancer IP or hostname (TTL 300).
   - `argocd.aqua-pump.net` → `A` record pointing to the Argo CD ingress/load balancer IP or hostname (TTL 300).
4. **(If private ECR)** Ensure the `ecr-creds` imagePullSecret is populated in the `aquapump` namespace and linked to the Argo CD service account if Argo CD performs deployments.

## Artifacts

- Helm chart diff prepared in this commit (see files listed above). No live-cluster snapshots (`kubectl get ...`) are available because CLI tooling is absent.

## Next Steps

- Re-run the diagnostics once `kubectl`/`helm` are available to confirm MetalLB, ingress-nginx, and Argo CD exposure.
- After confirming external IPs/DNS, enable TLS (e.g., via cert-manager) for `aqua-pump.net`, `api.aqua-pump.net`, and `argocd.aqua-pump.net`.
- Proceed to the Terraform stage (EC2 + K3s bootstrap + S3 backend) only after the Kubernetes layer is validated.

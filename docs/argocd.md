# Argo CD environment promotion

The repository defines three Argo CD `Application` manifests under [`deploy/argocd/apps`](../deploy/argocd/apps):

| Application | Namespace        | Values files                              | Sync policy |
|-------------|------------------|-------------------------------------------|-------------|
| `aquapump-dev` | `aquapump-dev`    | `values.yaml`, `values-dev.yaml`           | Automated (self-heal + prune) |
| `aquapump-staging` | `aquapump-staging` | `values.yaml`, `values-staging.yaml`      | Manual sync with retry backoff |
| `aquapump-prod` | `aquapump`        | `values.yaml`, `values-prod.yaml`         | Manual sync with extended retry |

## Promotion flow

1. CI publishes container images to ECR and patches `values.yaml` + `values-prod.yaml` with the commit SHA tag.
2. `aquapump-staging` is synced automatically from the workflow to validate the release in an isolated namespace.
3. A GitHub deployment approval gate is required before syncing `aquapump-prod`.
4. Post-sync health checks run via the Argo CD CLI to ensure both staging and production applications reach the `Healthy/Synced` state.

For day-to-day verification run [`scripts/smoke-tests.sh`](../scripts/smoke-tests.sh) against the staging hostname before approving production.

## Manual overrides

If you need to force-sync or rollback outside the workflow:

```bash
argocd app sync aquapump-staging --prune --retry-limit 3
argocd app rollback aquapump-prod 0
```

Use the `docs/secrets-runbook.md` guide when rotating backing secrets to keep ESO and GitHub Action variables aligned.

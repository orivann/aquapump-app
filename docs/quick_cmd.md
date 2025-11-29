# Quick Command Reference

Fastest way to start, stop, and inspect AquaPump across local dev and Kubernetes deployments.

## Local development

- **Start both services:** `docker compose up --build`
- **Stop containers:** `docker compose down`
- **Frontend dev server:** `npm run dev` (requires `npm install`)
- **Backend dev server:** `uvicorn app.main:app --host 0.0.0.0 --port 8000` inside `backend` venv

## Kubernetes (Helm)

- **Create secrets from env files:**
  ```bash
  kubectl create secret generic aquapump-secrets \
    --namespace aquapump \
    --from-env-file=backend/.env \
    --from-env-file=.env
  ```
- **Install/upgrade Helm release:**
  ```bash
  helm upgrade --install aquapump deploy/helm/aquapump \
    --namespace aquapump --create-namespace \
    -f deploy/helm/aquapump/values-local.yaml
  ```
- **Tail backend logs:** `kubectl logs -n aquapump deploy/aquapump-backend -f`
- **Tail frontend logs:** `kubectl logs -n aquapump deploy/aquapump-frontend -f`
- **Delete release:** `helm uninstall aquapump -n aquapump`

## Argo CD

- **Port-forward UI/API (requires running pods):**  
  `kubectl port-forward -n argocd svc/argocd-server 8080:80`
- **CLI login (with port-forward above):**  
  `argocd login localhost:8080 --username admin --grpc-web --insecure`
- **Reapply GitOps manifests:**  
  `kubectl apply -n argocd -f ../aquapump-gitops/applications/{project.yaml,aquapump-applicationset.yaml}`
- **Sync environment:** `argocd app sync aquapump-dev` (replace with `aquapump-stage` / `aquapump-prod`)
- **Environment status:** `argocd app get aquapump-dev`

## Diagnostics

- **Pod status:** `kubectl get pods -n aquapump`
- **Ingress status:** `kubectl get ingress -n aquapump`
- **Describe resource:** `kubectl describe <kind>/<name> -n aquapump`
- **Cluster events:**  
  `kubectl get events -A --sort-by=.metadata.creationTimestamp | tail`
Contributor: Noam – safe exam proof (docs only, no runtime change)
Contributor: Noam – code changed 

#!/bin/bash
set -euo pipefail

exec > >(tee /var/log/aquapump-user-data.log) 2>&1

echo "[aquapump] Updating system packages"
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git jq unzip

PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
LOCAL_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)

if [[ "${metallb_address_pool}" == "auto" ]]; then
  METALLB_RANGE="${PUBLIC_IP}-${PUBLIC_IP}"
else
  METALLB_RANGE="${metallb_address_pool}"
fi

INSTALL_K3S_EXEC="server --write-kubeconfig-mode 644 --tls-san ${PUBLIC_IP} --disable traefik"
export INSTALL_K3S_EXEC

curl -sfL https://get.k3s.io | sh -

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

until kubectl get nodes >/dev/null 2>&1; do
  echo "[aquapump] Waiting for k3s control plane"
  sleep 5
done

echo "[aquapump] Installing Helm"
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

sed -i "s/127.0.0.1/${LOCAL_IP}/" "$KUBECONFIG"
mkdir -p /home/ubuntu/.kube
cp "$KUBECONFIG" /home/ubuntu/.kube/config
chown ubuntu:ubuntu /home/ubuntu/.kube/config

kubectl create namespace metallb-system --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.12/config/manifests/metallb-native.yaml

cat <<EOF >/root/metallb-ipaddresspool.yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: aquapump-pool
  namespace: metallb-system
spec:
  addresses:
    - ${METALLB_RANGE}
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: aquapump-l2
  namespace: metallb-system
spec:
  ipAddressPools:
    - aquapump-pool
EOF

kubectl apply -f /root/metallb-ipaddresspool.yaml

echo "[aquapump] Installing ingress-nginx"
kubectl create namespace ingress-nginx --dry-run=client -o yaml | kubectl apply -f -
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.service.type=LoadBalancer \
  --set controller.replicaCount=1 \
  --wait \
  --timeout 5m

echo "[aquapump] Installing Argo CD"
kubectl create namespace ${argocd_namespace} --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n ${argocd_namespace} -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

sudo -u ubuntu env REPO_URL="${repo_url}" REPO_BRANCH="${repo_branch}" bash <<'EOSU'
set -euo pipefail

REPO_DIR="$HOME/aquapump"

if [ ! -d "$REPO_DIR" ]; then
  git clone --branch "$REPO_BRANCH" --depth 1 "$REPO_URL" "$REPO_DIR"
else
  cd "$REPO_DIR"
  git fetch origin "$REPO_BRANCH"
  git checkout "$REPO_BRANCH"
  git reset --hard "origin/$REPO_BRANCH"
fi
EOSU

echo "[aquapump] Waiting for Argo CD CRDs"
until kubectl get crd applications.argoproj.io >/dev/null 2>&1; do
  sleep 5
done

echo "[aquapump] Applying Argo CD project and applications"
kubectl apply -f /home/ubuntu/aquapump/deploy/argocd/project.yaml
kubectl apply -f /home/ubuntu/aquapump/deploy/argocd/dev-app.yaml
kubectl apply -f /home/ubuntu/aquapump/deploy/argocd/staging-app.yaml
kubectl apply -f /home/ubuntu/aquapump/deploy/argocd/prod-app.yaml

echo "[aquapump] Waiting for Argo CD control plane"
kubectl -n ${argocd_namespace} wait --for=condition=available deployment/argocd-server --timeout=10m
kubectl -n ${argocd_namespace} wait --for=condition=available deployment/argocd-repo-server --timeout=10m

if kubectl -n ${argocd_namespace} get secret argocd-initial-admin-secret >/dev/null 2>&1; then
  kubectl -n ${argocd_namespace} get secret argocd-initial-admin-secret \
    -o jsonpath='{.data.password}' | base64 -d > /root/argocd-initial-admin-password
  chmod 600 /root/argocd-initial-admin-password
fi

echo "[aquapump] Bootstrap complete"

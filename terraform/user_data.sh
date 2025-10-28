#!/bin/bash
set -euo pipefail

exec > >(tee /var/log/aquapump-user-data.log) 2>&1

log() {
  echo "[aquapump] $*"
}

retry() {
  local attempts=$1
  shift
  local count=0
  until "$@"; do
    count=$((count + 1))
    if [[ $count -ge $attempts ]]; then
      return 1
    fi
    sleep $((count * 2))
  done
}

trap 'log "bootstrap failed"' ERR

export DEBIAN_FRONTEND=noninteractive

log "Updating system packages"
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git jq unzip ca-certificates

PUBLIC_IP=$(curl -fsSL --retry 5 --retry-delay 2 http://169.254.169.254/latest/meta-data/public-ipv4)
LOCAL_IP=$(curl -fsSL --retry 5 --retry-delay 2 http://169.254.169.254/latest/meta-data/local-ipv4)

if [[ "${metallb_address_pool}" == "auto" ]]; then
  METALLB_RANGE="${PUBLIC_IP}-${PUBLIC_IP}"
else
  METALLB_RANGE="${metallb_address_pool}"
fi

INSTALL_K3S_EXEC="server --write-kubeconfig-mode 644 --tls-san ${PUBLIC_IP} --disable traefik"
export INSTALL_K3S_EXEC

log "Installing k3s"
curl -fsSL --retry 5 --retry-delay 2 https://get.k3s.io | sh -

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

until kubectl get nodes >/dev/null 2>&1; do
  log "Waiting for k3s control plane"
  sleep 5
done

log "Installing Helm ${helm_version}"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT
retry 5 curl -fsSL --retry 5 --retry-delay 2 -o "$TMPDIR/helm.tar.gz" "https://get.helm.sh/helm-${helm_version}-linux-amd64.tar.gz"
tar -xf "$TMPDIR/helm.tar.gz" -C "$TMPDIR"
install -m 0755 "$TMPDIR/linux-amd64/helm" /usr/local/bin/helm

sed -i "s/127.0.0.1/${LOCAL_IP}/" "$KUBECONFIG"
mkdir -p /home/ubuntu/.kube
cp "$KUBECONFIG" /home/ubuntu/.kube/config
chown ubuntu:ubuntu /home/ubuntu/.kube/config

log "Deploying MetalLB ${metallb_version}"
kubectl create namespace metallb-system --dry-run=client -o yaml | kubectl apply -f -
retry 5 curl -fsSL --retry 5 --retry-delay 2 -o /tmp/metallb-manifest.yaml "https://raw.githubusercontent.com/metallb/metallb/${metallb_version}/config/manifests/metallb-native.yaml"
kubectl apply -f /tmp/metallb-manifest.yaml

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
kubectl -n metallb-system wait --for=condition=available deployment/controller --timeout=5m

log "Installing ingress-nginx ${ingress_chart_version}"
kubectl create namespace ingress-nginx --dry-run=client -o yaml | kubectl apply -f -
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.service.type=LoadBalancer \
  --set controller.replicaCount=2 \
  --set controller.image.tag="${ingress_controller_version}" \
  --version "${ingress_chart_version}" \
  --wait \
  --timeout 10m

log "Installing Argo CD ${argocd_version}"
kubectl create namespace ${argocd_namespace} --dry-run=client -o yaml | kubectl apply -f -
retry 5 curl -fsSL --retry 5 --retry-delay 2 -o /tmp/argocd.yaml "https://github.com/argoproj/argo-cd/releases/download/${argocd_version}/install.yaml"
kubectl apply -n ${argocd_namespace} -f /tmp/argocd.yaml

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

log "Waiting for Argo CD CRDs"
until kubectl get crd applications.argoproj.io >/dev/null 2>&1; do
  sleep 5
done

log "Applying Argo CD project and applications"
kubectl apply -f /home/ubuntu/aquapump/deploy/argocd/project.yaml
kubectl apply -f /home/ubuntu/aquapump/deploy/argocd/dev-app.yaml
kubectl apply -f /home/ubuntu/aquapump/deploy/argocd/staging-app.yaml
kubectl apply -f /home/ubuntu/aquapump/deploy/argocd/prod-app.yaml

log "Waiting for Argo CD control plane"
kubectl -n ${argocd_namespace} wait --for=condition=available deployment/argocd-server --timeout=10m
kubectl -n ${argocd_namespace} wait --for=condition=available deployment/argocd-repo-server --timeout=10m

if kubectl -n ${argocd_namespace} get secret argocd-initial-admin-secret >/dev/null 2>&1; then
  kubectl -n ${argocd_namespace} get secret argocd-initial-admin-secret \
    -o jsonpath='{.data.password}' | base64 -d > /root/argocd-initial-admin-password
  chmod 600 /root/argocd-initial-admin-password
fi

log "Bootstrap complete"

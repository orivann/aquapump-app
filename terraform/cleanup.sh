#!/bin/bash
set -euo pipefail

if ! command -v terraform >/dev/null 2>&1; then
  echo "terraform command not found" >&2
  exit 1
fi

if [ -z "${EC2_IP:-}" ]; then
  echo "Set EC2_IP environment variable to the public IP of the instance before running this script." >&2
  exit 1
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

if [ -z "${SSH_KEY_PATH:-}" ]; then
  SSH_KEY_PATH="$HOME/.ssh/${TF_VAR_key_name:-aquapump}.pem"
fi

if [ -f "$SSH_KEY_PATH" ]; then
  ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" ubuntu@"$EC2_IP" \
    "sudo systemctl stop k3s && sudo rm -rf /etc/rancher /var/lib/rancher ~/.kube" || true
else
  echo "SSH key not found at $SSH_KEY_PATH; skipping remote cleanup" >&2
fi

terraform -chdir="$SCRIPT_DIR" destroy -auto-approve

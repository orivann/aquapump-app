# Infrastructure Reference
test
This directory stores reference policies used by the AquaPump deployment pipeline.

- `github-oidc-role.json` – Example IAM role document generated after creating the GitHub OpenID Connect provider and role assumption policy.
- `../operations.md` – Operational playbook with details on CI/CD and recovery flows.
- Root-level `trust-policy.json` and `ecr-policy.json` complement this role by defining the trust relationship and permissions required by the GitHub Actions runner.

Update or regenerate these artifacts whenever you rotate AWS resources to keep the documentation in sync.

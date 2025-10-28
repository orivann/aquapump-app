# Aquapump Architecture

## Overview
Aquapump is a full-stack water management platform composed of a TypeScript/React
frontend and a Python-based backend. The project is designed for containerized
deployment to Amazon ECR with downstream synchronization to Argo CD-managed
Kubernetes environments.

## Frontend
- **Location:** `frontend/`, `src/`, `components/`
- **Stack:** React 18 with Vite, Tailwind CSS, and TypeScript.
- **Responsibilities:**
  - Implements the user interface and client-side routing.
  - Communicates with backend APIs for data operations.
  - Bundled via Vite for optimized builds.

## Backend
- **Location:** `backend/`
- **Stack:** Python 3.12, FastAPI, and Pytest for testing.
- **Responsibilities:**
  - Exposes REST APIs consumed by the frontend.
  - Handles business logic and integration with persistent storage services.
  - Includes automated test suite under `backend/tests/`.

## Infrastructure & Deployment
- **Infrastructure as Code:** Terraform manifests in `terraform/` manage cloud
  resources such as VPCs, IAM roles, and ECR repositories.
- **Containerization:** Dockerfiles in `backend/Dockerfile` and
  `frontend/Dockerfile` build service images.
- **CI/CD:**
  - GitHub Actions workflow `.github/workflows/ecr-deploy.yml` runs linting,
    testing, security scanning, image builds, and deployment synchronization.
  - Uses AWS IAM Roles for GitHub OIDC federation to push images to Amazon ECR.
  - Successful pushes trigger Argo CD to update application deployments across
    dev, staging, and production environments.

## Local Development
- **Dependencies:** Managed through `package.json` for Node.js packages and
  `backend/requirements.txt` for Python packages.
- **Tooling:** ESLint, Prettier, and Tailwind for frontend; Pytest for backend.
- **Developer Experience:**
  - `npm install` / `npm run dev` for the frontend.
  - `pip install -r backend/requirements.txt` and `uvicorn` for the backend.
  - `docker-compose.yml` provides service orchestration for local testing.

## Observability & Security
- **Security Scanning:** Trivy filesystem scans run as part of CI before image
  builds to block critical vulnerabilities.
- **Secrets Management:** AWS secrets and tokens are provided through GitHub
  Actions secrets and leveraged via OIDC-backed role assumptions.


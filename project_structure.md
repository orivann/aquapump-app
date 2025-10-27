# AquaPump Project Walkthrough

This document is written for teammates. It explains what each folder and tool in the AquaPump repository does, using practical language and real-world analogies.

---

## Big Picture

Think of AquaPump as a showroom with two main areas:

1. **Frontend** – The polished customer-facing website where visitors explore the brand and chat with Aqua AI.
2. **Backend** – The behind-the-scenes assistant that answers chat questions, stores conversations, and talks to third-party services (Supabase and the AI provider).

Supporting these two areas is a set of deployment, testing, and automation tools that help us run the experience reliably in different environments (local laptops, staging servers, production).

---

## Top-level Items (Root Folder)

| Item | Plain-English Description |
|------|---------------------------|
| `src/` | The source code for the React website (what people see). |
| `backend/` | The FastAPI application that processes chat messages and integrates with Supabase and AI services. |
| `docker-compose.yml` | A recipe that launches the website and the API together using Docker; one command to start both services for demos or testing. |
| `scripts/health_check.py` | A quick diagnostic tool that confirms all parts are alive (website, backend, database connection). |
| `deploy/` | Blueprints for deploying AquaPump to cloud platforms (Kubernetes, ArgoCD, CI/CD pipelines). |
| `project_structure.md` | This explanation file. |
| `README.md` | The technical setup guide for engineers (install instructions, environment variables, etc.). |
| `.gitignore` | Tells Git which files to ignore (log files, local secrets, temporary folders). |

There are also configuration files for the React project (`tailwind.config.ts`, `tsconfig.json`, `vite.config.ts`, etc.). You rarely need to touch them unless you are coding.

---

## Frontend (`src/` folder)

### Purpose

Delivers the AquaPump marketing site and the Aqua AI chat widget in the browser.

### Key Parts

- `src/App.tsx` – The “main switchboard” that wires routing, notifications, language support, and the chat widget.
- `src/pages/` – Full-page layouts; currently includes the homepage (`Index.tsx`) and a fallback page (`NotFound.tsx`).
- `src/components/` – Reusable building blocks like the hero banner, product cards, navigation bar, and the chat section.
- `src/contexts/` – Shared state, such as language selection and the chat widget session logic.
- `src/hooks/` – Custom helpers (detect mobile screens, scroll animations).
- `src/lib/` – Utility functions focusing on formatting and API calls (e.g., chat API client).

### What Non-Tech Stakeholders Need to Know

The frontend turns brand ideas into visuals and interactions. Text, images, translations, and the chat launch button all live here. Designers and marketers collaborate with developers to update this area.

---

## Backend (`backend/` folder)

### Purpose

Runs the FastAPI service that:

- Handles chat messages from the website.
- Stores and retrieves message history from Supabase.
- Calls the AI provider to generate replies.
- Offers a health endpoint for monitoring.

### Key Parts

- `backend/app/main.py` – Boots the FastAPI app, enables CORS so the website can call it.
- `backend/app/routes.py` – Defines the HTTP endpoints:
  - `GET /health` – For monitors and the health script.
  - `POST /chat` – Accepts a new message and gets the AI response.
  - `GET /chat/{session_id}` – Retrieves past messages for a session.
- `backend/app/config.py` – Loads environment variables (Supabase credentials, AI keys, CORS settings).
- `backend/app/ai_client.py` – Talks to the AI service.
- `backend/app/supabase_client.py` – Talks to Supabase for data storage.
- `backend/app/schemas.py` – Describes the shape of data sent and received.
- `backend/Dockerfile` – Instructions to containerize the backend (used in Docker and production clusters).
- `backend/requirements.txt` – Python dependencies.
- `backend/.env.example` – Template for secret keys and URLs (actual secrets go in `backend/.env` which is excluded from Git).

### Plain-English Summary

This is the “AI concierge” engine room. Marketing teams do not touch it, but they rely on it to keep chat conversations smooth and fast.

---

## Scripts

- `scripts/health_check.py` – Runs simple checks:
  - Calls the backend health URL to confirm the AI concierge is reachable.
  - Verifies the backend can see Supabase.
  - Confirms the frontend website is responding.

This is handy for demos or support teams: run the script, get a PASS/FAIL list.

---

## Docker & Local Orchestration

- `docker-compose.yml` – One command starts the frontend and backend inside Docker containers. Each container has its own health probe so you know when it is safe to use.
- `frontend/Dockerfile` – Builds the production-ready website (static files served by Nginx).
- `backend/Dockerfile` – Builds the backend service with Python and Uvicorn.

Use case: marketing or sales teams can launch the full experience locally with Docker without installing Node or Python.

---

## Deployment Blueprints (`deploy/` folder)

### `deploy/helm/aquapump/`

A Helm chart that describes how to deploy the frontend and backend onto Kubernetes clusters. It defines container images, environment variables, health checks, and optional ingress (public URL) configuration.

### `deploy/kubernetes/base/`

Raw Kubernetes manifests (using Kustomize) for those who want a more traditional approach before embracing Helm. Includes namespace, deployments, and services.

### `deploy/argocd/application.yaml`

Tells ArgoCD (a GitOps tool) how to continuously deploy the Helm chart from this repo. Keeps the live environment in sync with Git changes.

### `deploy/ci/github-actions/ecr-deploy.yml`

Automation pipeline that:

1. Builds Docker images for frontend and backend.
2. Pushes them to Amazon ECR.
3. Optionally updates the Helm chart with the new image tags.
4. Triggers ArgoCD to deploy the update.

This is the “factory assembly line” for turning code changes into running features in the cloud.

---

## Supporting Files

- `README.md` – Developer guide with setup instructions, environment variables, and the “Next steps” roadmap.
- `project_structure.md` – This tour guide for non-technical stakeholders.

---

## Frequently Asked Questions

**Q: Where do we change copy or translations?**  
A: In the React frontend (`src/components`, `src/contexts/LanguageContext.tsx` for text in different languages).

**Q: How do we update the chatbot’s behavior?**  
A: Frontend changes go through `src/contexts/ChatWidgetContext.tsx`. Backend behavior (AI call, Supabase storage) lives under `backend/app/`.

**Q: How do we deploy a new version?**  
A: Merge changes into the main branch; the GitHub Actions workflow builds images and ArgoCD rolls them out (once cloud credentials are configured).

**Q: How can I confirm everything is healthy right now?**  
A: Run `python scripts/health_check.py` after Docker Compose or in a staging environment.

---

## TL;DR

- **Frontend** = showroom + Aqua AI button.
- **Backend** = brains of the assistant.
- **Docker Compose** = start both with one command.
- **Health script** = quick status check.
- **Deploy folder** = manuals for launching on cloud platforms and automating releases.

With these pieces, teams can confidently demonstrate AquaPump, customize messaging, and scale the experience from laptops to enterprise infrastructure.***

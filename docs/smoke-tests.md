# Smoke testing playbook

The `../scripts/smoke-tests.sh` helper exercises the deployed AquaPump stack with lightweight checks before promoting a build.

## Prerequisites

- Running backend (`http://localhost:8000` by default) and frontend (`http://localhost:5173`).
- Python dependencies installed via `pip install -r backend/requirements.txt` so pytest can import the FastAPI app.

## Usage

```bash
BACKEND_URL=https://api.aqua-pump.net \
FRONTEND_URL=https://aqua-pump.net \
../scripts/smoke-tests.sh
```

The script performs the following steps:

1. `curl` the backend `/health` endpoint and verify that the payload is valid JSON.
2. `curl` the frontend root route to ensure the SPA is reachable.
3. Invoke `pytest backend/tests/smoke` to run the FastAPI health-check test suite.

Override `PYTEST_TARGET` to run a different folder if desired:

```bash
PYTEST_TARGET=backend/tests pytest ../scripts/smoke-tests.sh
```

## CI integration

Add the script to GitHub Actions or any CI runner with:

```yaml
- name: Run smoke tests
  run: |
    pip install -r backend/requirements.txt
    npm install
    npm run build
    BACKEND_URL=$SERVICE_URL FRONTEND_URL=$SITE_URL ../scripts/smoke-tests.sh
```

Exit code `0` indicates success; any failure aborts the pipeline.

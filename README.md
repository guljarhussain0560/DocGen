# DocGen AI Agent 🤖

> AI-powered technical documentation that writes itself — from code, APIs, pull requests, and deployments.

Built with **FastAPI** + **Anthropic Claude** (claude-sonnet-4).

---

## What It Does

| Source | Generated Documentation |
|---|---|
| Source code files | Module docs, function signatures, usage examples, edge cases |
| REST API endpoints | Stripe-quality API reference with curl/Python/JS examples |
| Pull Requests | Changelogs, breaking change analysis, migration guides |
| Deployments | Runbooks, rollback procedures, release notes, on-call notes |

---

## Project Structure

```
DocGen/
├── backend/
│   ├── main.py                     # FastAPI app entry point
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Container build config
│   ├── docker-compose.yml          # Local container orchestration
│   ├── .env.example                # Template for env variables
│   ├── app/
│   │   ├── api/routes/             # API Router endpoints
│   │   ├── core/                   # Config, DB, and settings
│   │   ├── models/                 # Database schema models
│   │   └── services/               # LangGraph/AI pipeline services
│   └── generated_docs/             # Persisted generated documentation
│
└── frontend/
    ├── src/
    │   ├── app/                    # Next.js App Router pages
    │   ├── components/             # Reusable UI components
    │   └── lib/                    # Axios API configuration
    ├── package.json                # Node dependencies
    ├── next.config.ts              # Next.js configurations & API proxies
    └── tsconfig.json               # TypeScript configurations
```

---

## Quick Start

### 1. Clone & Set Up environment
```bash
git clone https://github.com/your-org/docgen-agent && cd docgen-agent
```

### 2. Run Backend (FastAPI)
```bash
cd backend
# Create virtual environment and install dependencies
python -m venv venv
source venv/Scripts/activate # Windows (or venv/bin/activate on Mac/Linux)
pip install -r requirements.txt

# Configure settings
cp .env.example .env
# Edit .env and supply your GROQ_API_KEY and other credentials

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

### 3. Run Frontend (Next.js)
In a new terminal window:
```bash
cd frontend
# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```

* **Frontend Dashboard**: Open [http://localhost:3000](http://localhost:3000)
* **Backend API Docs (Swagger UI)**: Open [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

## Run with Docker

To run the consolidated backend and SQLite database using Docker:
```bash
cd backend
docker-compose up --build
```
This automatically builds the application container and mounts the local sqlite database and generated documentation directory inside the container for persistence.

---

## API Endpoints

### Codebase
```
POST /api/v1/codebase/analyze          # Paste code → get docs
POST /api/v1/codebase/upload           # Upload file → get docs
POST /api/v1/codebase/detect-outdated  # Diff existing docs vs new code
GET  /api/v1/codebase/project/{id}     # List all codebase docs
```

### API Documentation
```
POST /api/v1/api-docs/generate         # Single endpoint
POST /api/v1/api-docs/import-openapi   # Bulk import OpenAPI 3.x spec
GET  /api/v1/api-docs/project/{id}     # List all API docs
```

### Pull Requests
```
POST /api/v1/pull-requests/generate           # Manual PR doc
POST /api/v1/pull-requests/webhook/github     # GitHub webhook (auto)
GET  /api/v1/pull-requests/project/{id}       # List PR docs
```

### Deployments
```
POST /api/v1/deployments/generate      # Generate runbook
GET  /api/v1/deployments/project/{id}  # List deployment docs
```

### Search & Projects
```
GET  /api/v1/search?q=keyword          # Full-text search
POST /api/v1/search/projects           # Create project
GET  /api/v1/search/projects           # List projects
GET  /api/v1/search/projects/{id}      # Project + all docs
```

---

## GitHub Webhook Setup

1. Repo → Settings → Webhooks → Add webhook
2. Payload URL: `https://your-domain.com/api/v1/pull-requests/webhook/github`
3. Content type: `application/json`
4. Secret: add to `.env` as `GITHUB_WEBHOOK_SECRET`
5. Events: select **Pull requests**

Every merged PR will automatically generate a changelog entry and migration guide.

---

## CI/CD Integration

Add this step to your deploy pipeline:

```yaml
# GitHub Actions example
- name: Generate Deployment Docs
  run: |
    curl -X POST ${{ vars.DOCGEN_URL }}/api/v1/deployments/generate \
      -H "Content-Type: application/json" \
      -d '{
        "project_id": "${{ vars.PROJECT_ID }}",
        "environment": "production",
        "version": "${{ github.ref_name }}",
        "service": "your-service-name",
        "deployed_by": "ci-bot",
        "changes": "${{ github.event.head_commit.message }}"
      }'
```

---

## Production Notes

- **Database**: Swap SQLite → PostgreSQL (`asyncpg` driver)
- **Async jobs**: Use Celery + Redis for large codebase analysis
- **Caching**: Redis cache for repeated file hash lookups
- **Auth**: Add JWT middleware to protect `/api/v1/*`
- **Migrations**: Use Alembic for schema evolution
- **Deploy**: `docker-compose up -d`

---

## Tech Stack

- **FastAPI** — async REST API framework
- **SQLAlchemy (async)** — ORM with `aiosqlite` / `asyncpg`
- **Anthropic Claude** — AI documentation generation (claude-sonnet-4)
- **Pydantic v2** — request/response validation
- **Uvicorn + Gunicorn** — ASGI server

---

## License

MIT

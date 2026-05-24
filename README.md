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
docgen-agent/
├── main.py                          # FastAPI app entry point
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
│
├── app/
│   ├── core/
│   │   ├── config.py                # Pydantic settings
│   │   └── database.py              # Async SQLAlchemy setup
│   │
│   ├── models/
│   │   ├── documentation.py         # Documentation ORM model
│   │   └── project.py               # Project ORM model
│   │
│   ├── services/
│   │   └── ai_service.py            # Claude API integration
│   │
│   └── api/routes/
│       ├── codebase.py              # POST /api/v1/codebase/analyze
│       ├── api_docs.py              # POST /api/v1/api-docs/generate
│       ├── pull_requests.py         # POST /api/v1/pull-requests/generate
│       ├── deployments.py           # POST /api/v1/deployments/generate
│       └── search.py                # GET  /api/v1/search
│
└── frontend/
    └── index.html                   # Dashboard UI
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/your-org/docgen-agent && cd docgen-agent

# 2. Install
pip install -r requirements.txt

# 3. Configure
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# 4. Run
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000 for the dashboard.  
Open http://localhost:8000/api/docs for Swagger UI.

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

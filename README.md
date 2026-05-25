# DocGen AI Agent 🤖

> AI-powered technical documentation that writes itself — from code, APIs, pull requests, and deployments.

Built with a split **Next.js** (TypeScript) frontend and a **FastAPI** (Python + LangGraph) AI backend.

---

## What It Does

| Source | Generated Documentation |
|---|---|
| **Source Code Files** | Module docs, function signatures, usage examples, and edge cases. |
| **REST API Endpoints** | Stripe-quality API reference with curl/Python/JS usage examples. |
| **Pull Requests** | Changelogs, breaking change analysis, and migration guides. |
| **Deployments** | Runbooks, rollback procedures, release notes, and on-call notes. |

---

## High-Level Architecture

DocGen is structured as a decoupled monorepo:
1. **Frontend (Port 3000)**: Next.js App Router SPA. Connects to the backend via a configurable URL or through Next.js proxy rewrites. Includes a custom **GitHub Copilot Chat** UI to query the agent.
2. **Backend (Port 8000)**: FastAPI server orchestrating directory parsing, SQLite/PostgreSQL storage, and AI generation graphs built using LangGraph.

---

## Quick Start (Run Both Components)

For detailed information on configuring and running each component individually, see their dedicated readmes:
* 💻 **[Frontend Setup & Configuration](file:///c:/Downloads/DocGen/frontend/README.md)**
* 🧠 **[Backend Setup & Configuration](file:///c:/Downloads/DocGen/backend/README.md)**

### Option A: Run Locally

#### 1. Start Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/Scripts/activate # Windows (or venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
cp .env.example .env          # Edit .env and add GROQ_API_KEY
uvicorn main:app --reload --port 8000
```

#### 2. Start Frontend (Next.js)
Open a new terminal window:
```bash
cd frontend
npm install
cp .env.example .env          # Edit .env and verify NEXT_PUBLIC_API_URL
npm run dev
```

* **Dashboard Web App**: [http://localhost:3000](http://localhost:3000)
* **Backend API Docs**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

### Option B: Run with Docker Compose

To orchestrate the backend server and its local database mappings in a Docker environment:
```bash
cd backend
docker-compose up --build
```
*Note: This hosts the backend container at `http://localhost:8000` and configures persistent volume folders.*

---

## GitHub Webhook Setup

1. Repository → **Settings** → **Webhooks** → **Add webhook**.
2. **Payload URL**: `https://your-domain.com/api/v1/pull-requests/webhook/github`
3. **Content type**: `application/json`
4. **Secret**: Define a value and set it as `GITHUB_WEBHOOK_SECRET` in `backend/.env`.
5. **Events**: Select **Pull requests**.

Every merged PR will automatically generate a changelog entry and migration guide inside the database.

---

## CI/CD Pipeline Integration

To automatically document deployments, insert this step into your deploy script:

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

* **Database**: Swap SQLite → PostgreSQL by modifying the `DATABASE_URL` settings in the backend `.env`.
* **Async Jobs**: For scanning massive repos, offload LangGraph pipelines to Celery + Redis workers.
* **Auth**: Add token-validation middlewares to protect the backend `/api/v1/*` endpoints.

---

## Tech Stack

* **Next.js 16** — Client-side React app router framework
* **FastAPI** — Async Python server
* **LangGraph** — AI Agent state graph pipeline
* **Tailwind CSS v4** — High-fidelity global styles
* **Pydantic v2 & SQLAlchemy** — Server validations and database ORM

---

## License

MIT

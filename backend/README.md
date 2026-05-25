# DocGen Backend 🧠

> FastAPI-powered AI Agent backend that indexes repositories, runs LangGraph documentation pipelines, and serves the REST API.

---

## Technical Stack
* **FastAPI** — high-performance async REST API framework.
* **LangGraph & Qwen/Llama** — AI-agent orchestration for scanning directories and generating markdown docs.
* **SQLAlchemy (Async)** — database ORM with `aiosqlite` (SQLite) and `asyncpg` (PostgreSQL) support.
* **Pydantic v2** — strict type-validation for settings and request/response models.

---

## Directory Structure

```
backend/
├── main.py                     # App entrypoint and middleware setup
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Production container configuration
├── docker-compose.yml          # Container orchestration (port 8000, volumes)
├── .env.example                # Template for server environments
│
└── app/
    ├── api/routes/             # Router controllers for endpoints
    │   ├── codebase.py         # Code indexing and manual file analysis
    │   ├── api_docs.py         # API reference & Swagger import pipeline
    │   ├── pull_requests.py    # GitHub webhooks & manual PR parsing
    │   ├── deployments.py      # Deployment runbooks and release notes
    │   ├── search.py           # Full-text SQLite/Postgres documentation search
    │   └── chat.py             # Codebase QA Chat API
    │
    ├── core/                   # Shared modules (config.py, database.py)
    ├── models/                 # SQLAlchemy Async model declarations
    │   ├── project.py          # Project meta-data schema
    │   └── documentation.py    # Generated markdown documents schema
    │
    └── services/               # Internal orchestrations and AI logic
        ├── ai_service.py       # LLM client wrappers
        ├── github_service.py   # GitHub repository files & commit fetchers
        └── agent_graph.py      # LangGraph state graph logic for code parsing
```

---

## Local Setup

### Prerequisites
* Python 3.12+ installed
* SQLite (default) or a PostgreSQL database

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   source venv/Scripts/activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
5. Configure the `.env` settings:
   * **`GROQ_API_KEY`**: Insert your Groq API token.
   * **`DATABASE_URL`**: Defaults to SQLite (`sqlite+aiosqlite:///./docgen.db`). For PostgreSQL, swap to `postgresql+asyncpg://user:password@localhost:5432/dbname`.
   * **`GITHUB_TOKEN`**: A GitHub Personal Access Token (PAT) for importing repositories and querying pull requests.

6. Run the database migrations & startup:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

* The backend will serve at `http://localhost:8000`.
* The Swagger interactive documentation will be available at `http://localhost:8000/api/docs`.

---

## Docker Orchestration

You can build and run the backend locally in a container with persistent storage:
```bash
cd backend
docker-compose up --build
```
This maps:
* The REST server to port `8000`.
* `./docgen.db` inside the container for database persistence.
* `./generated_docs` inside the container to persist generated Markdown files.

---

## API Reference & Endpoints

The API is versioned under `/api/v1` and organized into dedicated routers:

### 1. Codebase Analysis (`/api/v1/codebase`)
* **`POST /analyze`**: Generates structured documentation for a single raw code snippet.
  * *Request Body*: JSON containing `project_id`, `filename`, `language`, `code`, and optional `project_context`.
  * *Returns*: Generated documentation metadata, summary, and markdown description.
* **`POST /upload`**: Multipart file upload. Automatically reads source code files (up to 10MB) and submits them to the AI pipeline.
  * *Form Data*: `project_id` (string), `language` (string), and `file` upload.
* **`POST /detect-outdated`**: Compares current database documentation against a newly updated code snippet to evaluate stale definitions.
  * *Params*: `doc_id` (UUID), `new_code` (string).
* **`GET /project/{project_id}`**: Fetches a list of all codebase documents associated with a project.

### 2. API Reference Generator (`/api/v1/api-docs`)
* **`POST /generate`**: Generates Stripe-quality API reference files for a single REST endpoint.
  * *Request Body*: Endpoint info JSON containing HTTP `method` (GET, POST, etc.), `path`, `description`, `request_body` schema, `response_schema`, and `tags`.
* **`POST /import-openapi`**: Imports an entire OpenAPI 3.x schema and bulk-generates documentation for all defined endpoints.
  * *Request Body*: JSON containing `project_id` and the `openapi_spec` JSON dictionary.
* **`GET /project/{project_id}`**: Retrieves all generated API endpoint documents for a project.

### 3. Pull Request Handler (`/api/v1/pull-requests`)
* **`POST /generate`**: Manually processes pull request diffs, descriptions, and file changes to construct Keep-A-Changelog entries.
  * *Request Body*: JSON containing `project_id`, `pr_number`, `title`, `author`, `head_branch`, `base_branch`, `description`, and `diff_summary`.
* **`POST /webhook/github`**: GitHub webhook listener. Persists automatic changelogs when a PR event signature (matching your configured `GITHUB_WEBHOOK_SECRET`) triggers.
* **`GET /project/{project_id}`**: Retrieves all PR changelogs generated for a project.
* **`GET /list/{project_id}`**: Pulls the list of open/closed PRs directly from the project's linked GitHub repository.
* **`GET /details/{project_id}/{pull_number}`**: Fetches commit details and files changed in the specified PR from GitHub.

### 4. Deployments Tracker (`/api/v1/deployments`)
* **`POST /generate`**: Auto-generates release notes, checklists, rollback procedures, and on-call notes from deploy metadata.
  * *Request Body*: JSON containing `project_id`, `environment` (production, staging, dev), `version`, `service`, `deployed_by`, and optional `changes` / `config_changes`.
* **`GET /project/{project_id}`**: Retrieves all deployment runbooks created for a project.

### 5. Search & Project Workspaces (`/api/v1/search`)
* **`GET /`**: Performs full-text keyword search across titles, summaries, and contents of all project documents.
  * *Query Params*: `q` (search term), optional `project_id` and `doc_type` filters.
* **`POST /projects`**: Registers a new project workspace. Returns existing info if the repository URL is already registered.
* **`GET /projects`**: Lists all projects with metadata and count of generated documents.
* **`GET /projects/{project_id}`**: Fetches details for a single project and its associated files.
* **`GET /docs/{doc_id}`**: Retrieves the full contents, including raw markdown, of a single document.

### 6. GitHub Repository Integration (`/api/v1/github`)
* **`POST /analyze-repo`**: Triggers a background LangGraph agent scan task to crawl repository files and dynamically document the codebase.
* **`GET /stream/{project_id}`**: SSE (Server-Sent Events) endpoint to listen to live agent progress logs and step-by-step updates.
* **`GET /status/{project_id}`**: Fetches the current scan state (scanning/idle), progress percentage, and raw agent log.
* **`GET /history/{project_id}`**: Lists previous repository scans including completed dates and document counts.
* **`GET /commits/{project_id}`**: Fetches recent commits from the repository.
* **`POST /stop/{project_id}`**: Stops any active scan and marks the project status as idle.

### 7. Codebase Copilot Chat (`/api/v1/chat`)
* **`POST /ask`**: Context-aware Q&A. Takes your query, crawls all completed project documentation summaries and markdown content, and synthesizes an answer.
  * *Request Body*: JSON containing `project_id` and `question`.


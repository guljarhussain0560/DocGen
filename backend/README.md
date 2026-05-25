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

"""
Technical Documentation Generator - FastAPI Application
Auto-generates and updates documentation from codebases, APIs, PRs, and deployments.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
import uvicorn

from app.api.routes import codebase, api_docs, pull_requests, deployments, search, github, chat
from app.core.config import settings
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize resources on startup, cleanup on shutdown."""
    await init_db()
    yield


app = FastAPI(
    title="DocGen AI Agent",
    description="AI-powered Technical Documentation Generator",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(codebase.router, prefix="/api/v1/codebase", tags=["Codebase Analysis"])
app.include_router(api_docs.router, prefix="/api/v1/api-docs", tags=["API Documentation"])
app.include_router(pull_requests.router, prefix="/api/v1/pull-requests", tags=["Pull Requests"])
app.include_router(deployments.router, prefix="/api/v1/deployments", tags=["Deployments"])
app.include_router(search.router, prefix="/api/v1/search", tags=["Search"])
app.include_router(github.router, prefix="/api/v1/github", tags=["GitHub Integration"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Codebase Chat & QA"])




@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0", "agent": "DocGen AI"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

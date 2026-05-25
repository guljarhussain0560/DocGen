"""
Search & Project Management Routes.
Full-text search across all docs, plus project CRUD.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from pydantic import BaseModel
from typing import Optional
import uuid

from app.core.database import get_db
from app.models.documentation import Documentation
from app.models.project import Project
from app.core.config import settings
import os

router = APIRouter()


# ------------------------------------------------------------------ #
#  Search                                                             #
# ------------------------------------------------------------------ #

@router.get("/", summary="Full-text search across all documentation")
async def search_docs(
    q: str,
    project_id: Optional[str] = None,
    doc_type: Optional[str] = None,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """
    Search documentation by keyword.
    Optionally filter by project_id or doc_type (codebase | api | pull_request | deployment).
    """
    if len(q) < 2:
        raise HTTPException(status_code=400, detail="Query must be at least 2 characters.")

    query = select(Documentation).where(
        or_(
            Documentation.title.ilike(f"%{q}%"),
            Documentation.content_markdown.ilike(f"%{q}%"),
            Documentation.ai_summary.ilike(f"%{q}%"),
        )
    )

    if project_id:
        query = query.where(Documentation.project_id == project_id)
    if doc_type:
        query = query.where(Documentation.doc_type == doc_type)

    query = query.limit(limit)
    result = await db.execute(query)
    docs = result.scalars().all()

    return {
        "query": q,
        "count": len(docs),
        "results": [
            {
                "id": d.id,
                "title": d.title,
                "doc_type": d.doc_type.value,
                "source_ref": d.source_ref,
                "summary": d.ai_summary,
                "status": d.status.value,
                "project_id": d.project_id,
                "updated_at": d.updated_at.isoformat() if d.updated_at else None,
            }
            for d in docs
        ],
    }


# ------------------------------------------------------------------ #
#  Projects CRUD                                                      #
# ------------------------------------------------------------------ #

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    github_repo: Optional[str] = None    # owner/repo
    tech_stack: Optional[str] = None     # "Python, FastAPI, PostgreSQL"


@router.post("/projects", summary="Create a new project")
async def create_project(payload: ProjectCreate, db: AsyncSession = Depends(get_db)):
    """Create a project to group all its documentation."""
    # Check if project with the same name already exists
    result = await db.execute(select(Project).where(Project.name == payload.name))
    existing_project = result.scalar_one_or_none()
    
    if existing_project:
        # If the repository is the same, or if github_repo is not provided, return the existing project
        if not payload.github_repo or existing_project.github_repo == payload.github_repo:
            return {"id": existing_project.id, "name": existing_project.name, "status": existing_project.status or "idle"}
        else:
            raise HTTPException(
                status_code=400,
                detail=f"A project with the name '{payload.name}' already exists with a different repository ('{existing_project.github_repo}')."
            )

    project = Project(
        id=str(uuid.uuid4()),
        name=payload.name,
        description=payload.description,
        github_repo=payload.github_repo,
        tech_stack=payload.tech_stack,
    )
    db.add(project)
    await db.commit()
    return {"id": project.id, "name": project.name, "status": project.status or "idle"}


@router.get("/projects", summary="List all projects")
async def list_projects(db: AsyncSession = Depends(get_db)):
    """List all projects with their documentation counts."""
    result = await db.execute(select(Project))
    projects = result.scalars().all()

    output = []
    for p in projects:
        doc_result = await db.execute(
            select(Documentation).where(Documentation.project_id == p.id)
        )
        doc_count = len(doc_result.scalars().all())
        output.append(
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "github_repo": p.github_repo,
                "tech_stack": p.tech_stack,
                "status": p.status or "idle",
                "doc_count": doc_count,
                "created_at": p.created_at.isoformat(),
                "updated_at": p.updated_at.isoformat() if p.updated_at else None,
            }
        )
    return output


@router.get("/projects/{project_id}", summary="Get project details")
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    doc_result = await db.execute(
        select(Documentation).where(Documentation.project_id == project_id)
    )
    docs = doc_result.scalars().all()

    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "github_repo": project.github_repo,
        "tech_stack": project.tech_stack,
        "status": project.status or "idle",
        "created_at": project.created_at.isoformat(),
        "docs": [
            {
                "id": d.id,
                "title": d.title,
                "doc_type": d.doc_type.value,
                "status": d.status.value,
                "updated_at": d.updated_at.isoformat() if d.updated_at else None,
            }
            for d in docs
        ],
    }


@router.get("/docs/{doc_id}", summary="Get single document by ID")
async def get_document(doc_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve full details of a single documentation entry including markdown."""
    result = await db.execute(select(Documentation).where(Documentation.id == doc_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc.id,
        "project_id": doc.project_id,
        "title": doc.title,
        "doc_type": doc.doc_type.value,
        "status": doc.status.value,
        "source_ref": doc.source_ref,
        "content_markdown": doc.content_markdown,
        "ai_summary": doc.ai_summary,
        "version": doc.version,
        "updated_at": doc.updated_at.isoformat() if doc.updated_at else None,
    }


# ------------------------------------------------------------------ #
#  Settings & Configuration                                          #
# ------------------------------------------------------------------ #

class ConfigUpdateRequest(BaseModel):
    groq_api_key: Optional[str] = None
    ai_model: Optional[str] = None
    github_token: Optional[str] = None
    github_webhook_secret: Optional[str] = None


def mask_string(s: Optional[str], prefix_len: int = 6) -> str:
    if not s:
        return ""
    if len(s) <= prefix_len:
        return "*" * len(s)
    return s[:prefix_len] + "*" * (len(s) - prefix_len)


def update_env_file(updates: dict):
    env_path = ".env"
    if not os.path.exists(env_path):
        env_path = os.path.join("backend", ".env")
        if not os.path.exists(env_path):
            env_path = "../.env"

    lines = []
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            lines = f.readlines()

    new_lines = []
    keys_updated = set()
    for line in lines:
        stripped = line.strip()
        if stripped and not stripped.startswith("#") and "=" in stripped:
            parts = stripped.split("=", 1)
            key = parts[0].strip()
            if key in updates:
                new_val = updates[key]
                new_lines.append(f'{key}="{new_val}"\n')
                keys_updated.add(key)
                continue
        new_lines.append(line)

    for key, val in updates.items():
        if key not in keys_updated:
            new_lines.append(f'{key}="{val}"\n')

    with open(env_path, "w") as f:
        f.writelines(new_lines)


@router.get("/config", summary="Get current application configuration")
async def get_config():
    """Retrieve current environment settings (masked for safety)."""
    return {
        "groq_api_key": mask_string(settings.GROQ_API_KEY, 7),
        "ai_model": settings.AI_MODEL,
        "github_token": mask_string(settings.GITHUB_TOKEN, 11),
        "github_webhook_secret": mask_string(settings.GITHUB_WEBHOOK_SECRET, 3),
        "database_url": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else settings.DATABASE_URL
    }


@router.post("/config", summary="Update application settings")
async def update_config(payload: ConfigUpdateRequest):
    """Update settings and write them back to the server environment."""
    updates = {}
    
    # Update Groq key if provided and not masked
    if payload.groq_api_key and not payload.groq_api_key.endswith("*****") and "*" not in payload.groq_api_key:
        updates["GROQ_API_KEY"] = payload.groq_api_key.strip()
        settings.GROQ_API_KEY = payload.groq_api_key.strip()
        
    # Update AI Model
    if payload.ai_model:
        updates["AI_MODEL"] = payload.ai_model.strip()
        settings.AI_MODEL = payload.ai_model.strip()
        
    # Update GitHub Token if provided and not masked
    if payload.github_token and not payload.github_token.endswith("*****") and "*" not in payload.github_token:
        updates["GITHUB_TOKEN"] = payload.github_token.strip()
        settings.GITHUB_TOKEN = payload.github_token.strip()
        
    # Update Webhook Secret if provided and not masked
    if payload.github_webhook_secret and not payload.github_webhook_secret.endswith("*****") and "*" not in payload.github_webhook_secret:
        updates["GITHUB_WEBHOOK_SECRET"] = payload.github_webhook_secret.strip()
        settings.GITHUB_WEBHOOK_SECRET = payload.github_webhook_secret.strip()

    if updates:
        update_env_file(updates)
            
    return {"status": "success", "updated": list(updates.keys())}


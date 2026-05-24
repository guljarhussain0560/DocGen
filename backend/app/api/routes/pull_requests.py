"""
Pull Request Documentation Routes.
Auto-generate changelogs and migration guides from PRs.
"""

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
import uuid
import hmac
import hashlib
import json

from app.core.database import get_db
from app.core.config import settings
from app.models.documentation import Documentation, DocType, DocStatus
from app.services.ai_service import ai_service

router = APIRouter()


class PRDocRequest(BaseModel):
    project_id: str
    pr_number: int
    title: str
    author: str
    head_branch: str
    base_branch: str = "main"
    description: Optional[str] = None
    files_changed: Optional[str] = None   # Newline-separated list
    diff_summary: Optional[str] = None    # Git diff or summary
    labels: List[str] = []


@router.post("/generate", summary="Generate docs from a Pull Request")
async def generate_pr_documentation(
    request: PRDocRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate comprehensive PR documentation including:
    - Change summary
    - Breaking changes analysis
    - Migration guide
    - Changelog entry (Keep a Changelog format)
    """
    pr_data = {
        "title": request.title,
        "author": request.author,
        "head_branch": request.head_branch,
        "base_branch": request.base_branch,
        "description": request.description,
        "files_changed": request.files_changed,
        "diff_summary": request.diff_summary,
        "labels": ", ".join(request.labels),
    }

    try:
        ai_result = await ai_service.generate_pr_doc(pr_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    doc = Documentation(
        id=str(uuid.uuid4()),
        project_id=request.project_id,
        title=f"PR #{request.pr_number}: {request.title}",
        doc_type=DocType.PULL_REQUEST,
        status=DocStatus.COMPLETED,
        source_ref=f"PR #{request.pr_number}",
        content_markdown=ai_result["markdown"],
        ai_summary=ai_result["summary"],
    )
    db.add(doc)
    await db.commit()

    return {
        "doc_id": doc.id,
        "pr_number": request.pr_number,
        "title": request.title,
        "status": "completed",
        "summary": ai_result["summary"],
        "markdown": ai_result["markdown"],
    }


@router.post("/webhook/github", summary="GitHub webhook for auto PR documentation")
async def github_pr_webhook(
    payload: dict,
    x_hub_signature_256: Optional[str] = Header(None),
    x_github_event: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    """
    GitHub webhook endpoint. Configure in your repo Settings → Webhooks.
    Automatically generates documentation when a PR is opened or merged.
    
    Set the webhook secret in your .env as GITHUB_WEBHOOK_SECRET.
    """
    # Verify webhook signature
    if settings.GITHUB_WEBHOOK_SECRET and x_hub_signature_256:
        expected = hmac.new(
            settings.GITHUB_WEBHOOK_SECRET.encode(),
            json.dumps(payload).encode(),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(f"sha256={expected}", x_hub_signature_256):
            raise HTTPException(status_code=401, detail="Invalid webhook signature")

    # Only handle PR open and merge events
    if x_github_event != "pull_request":
        return {"status": "ignored", "event": x_github_event}

    action = payload.get("action")
    if action not in ["opened", "closed"]:
        return {"status": "ignored", "action": action}

    pr = payload.get("pull_request", {})
    repo = payload.get("repository", {})

    # Find or create project by repo name
    project_name = repo.get("full_name", "unknown")

    pr_data = {
        "title": pr.get("title", ""),
        "author": pr.get("user", {}).get("login", "unknown"),
        "head_branch": pr.get("head", {}).get("ref", ""),
        "base_branch": pr.get("base", {}).get("ref", "main"),
        "description": pr.get("body", ""),
        "diff_summary": f"Lines changed: +{pr.get('additions', 0)} -{pr.get('deletions', 0)}, files: {pr.get('changed_files', 0)}",
    }

    ai_result = await ai_service.generate_pr_doc(pr_data)

    return {
        "status": "documentation_generated",
        "pr_number": pr.get("number"),
        "summary": ai_result["summary"],
    }


@router.get("/project/{project_id}", summary="List all PR docs for a project")
async def list_pr_docs(project_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve all PR documentation entries for a project."""
    result = await db.execute(
        select(Documentation).where(
            Documentation.project_id == project_id,
            Documentation.doc_type == DocType.PULL_REQUEST,
        )
    )
    docs = result.scalars().all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "pr_ref": d.source_ref,
            "summary": d.ai_summary,
            "status": d.status.value,
            "created_at": d.created_at.isoformat(),
        }
        for d in docs
    ]

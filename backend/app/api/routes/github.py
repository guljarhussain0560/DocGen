"""
GitHub Repository Integration Routes.
Handles repo scanning via LangGraph agent pipeline with SSE live streaming.
"""

import asyncio
import re
import os
from datetime import datetime
import aiofiles
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import AsyncSessionLocal, get_db
from app.core.config import settings
from app.services.github_service import github_service
from app.services.ai_service import ai_service
from app.services.sse_manager import sse_manager
from app.services.agent_graph import run_agent_pipeline
from app.models.project import Project, RepoScanHistory
from app.models.documentation import Documentation, DocType, DocStatus
import uuid

router = APIRouter()


class RepoSubmission(BaseModel):
    project_id: str
    repo_url: str
    commit_sha: Optional[str] = None
    since_date: Optional[str] = None
    until_date: Optional[str] = None


@router.post("/analyze-repo", summary="Scan an entire GitHub repository")
async def analyze_repo(
    submission: RepoSubmission,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Submit a GitHub repository URL to be scanned via the LangGraph agent pipeline."""
    # Check if project exists
    result = await db.execute(select(Project).where(Project.id == submission.project_id))
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    # Parse URL
    match = re.match(r"https?://github\.com/([^/]+)/([^/]+)/?", submission.repo_url)
    if not match:
        raise HTTPException(status_code=400, detail="Invalid GitHub URL format")

    owner, repo = match.groups()
    repo = repo.replace(".git", "")
    repo_url_full = f"{owner}/{repo}"

    # Update project repo metadata and reset agent status
    proj.github_repo = repo_url_full
    proj.status = "scanning"
    proj.progress = 0
    proj.agent_phase = "Starting"
    proj.current_file = "Initializing Agent Pipeline"
    proj.agent_log = ""
    await db.commit()

    # Create RepoScanHistory log entry
    scan_history = RepoScanHistory(
        id=str(uuid.uuid4()),
        project_id=submission.project_id,
        repo_url=repo_url_full,
        status="scanning",
        doc_count=0,
        scanned_at=datetime.utcnow()
    )
    db.add(scan_history)
    await db.commit()
    scan_history_id = scan_history.id

    # Fire off LangGraph agent pipeline as background task
    background_tasks.add_task(
        run_agent_pipeline,
        submission.project_id, owner, repo, scan_history_id,
        commit_sha=submission.commit_sha,
        since_date=submission.since_date,
        until_date=submission.until_date
    )

    return {
        "status": "processing",
        "message": f"Started LangGraph agent scan for {repo_url_full}.",
        "repo": repo_url_full,
        "history_id": scan_history_id
    }


@router.get("/stream/{project_id}", summary="SSE stream of agent scanning events")
async def stream_agent_events(project_id: str):
    """Server-Sent Events endpoint for real-time agent log streaming."""
    return StreamingResponse(
        sse_manager.subscribe(project_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.get("/status/{project_id}", summary="Get agent scanning progress and logs")
async def get_agent_status(
    project_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve the live agentic progress status and logs for a project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    return {
        "project_id": proj.id,
        "name": proj.name,
        "status": proj.status,
        "progress": proj.progress,
        "agent_phase": proj.agent_phase,
        "current_file": proj.current_file,
        "agent_log": proj.agent_log
    }


@router.get("/history/{project_id}", summary="Get previous repository scans history")
async def get_repo_history(
    project_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all historical scans recorded for a project."""
    result = await db.execute(
        select(RepoScanHistory)
        .where(RepoScanHistory.project_id == project_id)
        .order_by(RepoScanHistory.scanned_at.desc())
    )
    scans = result.scalars().all()
    return [
        {
            "id": s.id,
            "repo_url": s.repo_url,
            "status": s.status,
            "doc_count": s.doc_count,
            "scanned_at": s.scanned_at.isoformat() if s.scanned_at else None,
            "completed_at": s.completed_at.isoformat() if s.completed_at else None
        }
        for s in scans
    ]


@router.get("/commits/{project_id}", summary="Get recent commits of project's repository")
async def get_project_commits(
    project_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve the recent commits for the repository configured for the project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    if not proj.github_repo:
        raise HTTPException(status_code=400, detail="No GitHub repository configured for this project")

    repo_str = proj.github_repo
    if "github.com" in repo_str:
        match = re.match(r"https?://github\.com/([^/]+)/([^/]+)/?", repo_str)
        if match:
            owner, repo = match.groups()
            repo = repo.replace(".git", "")
        else:
            raise HTTPException(status_code=400, detail="Invalid GitHub URL format in project settings")
    else:
        parts = repo_str.split("/")
        if len(parts) >= 2:
            owner, repo = parts[0], parts[1].replace(".git", "")
        else:
            raise HTTPException(status_code=400, detail="Invalid GitHub repository structure")

    try:
        commits = await github_service.get_recent_commits(owner, repo)
        return commits
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch commits from GitHub: {str(e)}")


@router.post("/stop/{project_id}", summary="Stop a running repository scan")
async def stop_repo_scan(
    project_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Stop the active LangGraph agent scan for a project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    if proj.status != "scanning":
        return {"status": "ignored", "message": "Project is not currently scanning"}

    proj.status = "idle"
    proj.agent_phase = "Stopped"
    proj.current_file = None
    proj.agent_log = (proj.agent_log or "") + f"[{datetime.utcnow().strftime('%H:%M:%S')}] Stop requested by user.\n"
    await db.commit()

    # Also update active scan history entry to failed/stopped
    history_result = await db.execute(
        select(RepoScanHistory)
        .where(RepoScanHistory.project_id == project_id, RepoScanHistory.status == "scanning")
    )
    history = history_result.scalars().all()
    for h in history:
        h.status = "failed"
        h.completed_at = datetime.utcnow()
    await db.commit()

    # Publish SSE stopped event
    sse_manager.publish(project_id, {
        "type": "status",
        "status": "idle",
        "progress": proj.progress,
        "phase": "Stopped",
        "current_file": None,
        "log": "Scan stopped by user.",
        "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
    })

    return {"status": "stopped", "message": "Scan stop request registered successfully"}



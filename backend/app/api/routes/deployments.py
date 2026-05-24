"""
Deployment Documentation Routes.
Auto-generate runbooks and release notes from deployment events.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime, timezone

from app.core.database import get_db
from app.models.documentation import Documentation, DocType, DocStatus
from app.services.ai_service import ai_service

router = APIRouter()


class DeploymentDocRequest(BaseModel):
    project_id: str
    environment: str                     # production, staging, dev
    version: str                         # v2.1.0
    service: str                         # api-gateway, auth-service
    deployed_by: str
    timestamp: Optional[str] = None
    changes: Optional[str] = None        # What changed
    config_changes: Optional[str] = None # Config/env var changes
    infra_changes: Optional[str] = None  # Infrastructure changes


@router.post("/generate", summary="Generate deployment runbook and release notes")
async def generate_deployment_doc(
    request: DeploymentDocRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate deployment documentation including:
    - Release notes
    - Pre/post-deployment checklists  
    - Rollback procedures
    - On-call monitoring notes
    """
    deployment_data = {
        "environment": request.environment,
        "version": request.version,
        "service": request.service,
        "deployed_by": request.deployed_by,
        "timestamp": request.timestamp or datetime.now(timezone.utc).isoformat(),
        "changes": request.changes,
        "config_changes": request.config_changes,
        "infra_changes": request.infra_changes,
    }

    try:
        ai_result = await ai_service.generate_deployment_doc(deployment_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    doc = Documentation(
        id=str(uuid.uuid4()),
        project_id=request.project_id,
        title=f"Deploy {request.version} → {request.environment} ({request.service})",
        doc_type=DocType.DEPLOYMENT,
        status=DocStatus.COMPLETED,
        source_ref=f"{request.service}@{request.version}",
        content_markdown=ai_result["markdown"],
        ai_summary=ai_result["summary"],
        version=request.version,
    )
    db.add(doc)
    await db.commit()

    return {
        "doc_id": doc.id,
        "service": request.service,
        "version": request.version,
        "environment": request.environment,
        "status": "completed",
        "summary": ai_result["summary"],
        "markdown": ai_result["markdown"],
    }


@router.get("/project/{project_id}", summary="List all deployment docs for a project")
async def list_deployment_docs(project_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve all deployment documentation for a project, newest first."""
    result = await db.execute(
        select(Documentation).where(
            Documentation.project_id == project_id,
            Documentation.doc_type == DocType.DEPLOYMENT,
        )
    )
    docs = result.scalars().all()
    return sorted(
        [
            {
                "id": d.id,
                "title": d.title,
                "version": d.version,
                "service": d.source_ref,
                "summary": d.ai_summary,
                "status": d.status.value,
                "created_at": d.created_at.isoformat(),
            }
            for d in docs
        ],
        key=lambda x: x["created_at"],
        reverse=True,
    )

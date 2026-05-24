"""
Codebase Analysis Routes.
Upload source files or paste code to auto-generate documentation.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime, timezone

from app.core.database import get_db
from app.models.documentation import Documentation, DocType, DocStatus
from app.models.project import Project
from app.services.ai_service import ai_service

router = APIRouter()


class CodeSubmission(BaseModel):
    project_id: str
    filename: str
    language: str
    code: str
    project_context: Optional[str] = None


class CodebaseDocResponse(BaseModel):
    doc_id: str
    title: str
    status: str
    summary: str
    markdown: str
    created_at: str


@router.post("/analyze", response_model=CodebaseDocResponse, summary="Generate docs from code")
async def analyze_code(
    submission: CodeSubmission,
    db: AsyncSession = Depends(get_db),
):
    """
    Submit source code for AI documentation generation.
    
    Supports any programming language. Provide the code, filename, and language
    to receive comprehensive documentation including function signatures,
    usage examples, and edge cases.
    """
    # Verify project exists
    result = await db.execute(select(Project).where(Project.id == submission.project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Generate AI documentation
    try:
        ai_result = await ai_service.generate_codebase_doc(
            code=submission.code,
            filename=submission.filename,
            language=submission.language,
            project_context=submission.project_context,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # Save to database
    doc = Documentation(
        id=str(uuid.uuid4()),
        project_id=submission.project_id,
        title=f"Documentation: {submission.filename}",
        doc_type=DocType.CODEBASE,
        status=DocStatus.COMPLETED,
        source_ref=submission.filename,
        content_markdown=ai_result["markdown"],
        ai_summary=ai_result["summary"],
    )
    db.add(doc)
    await db.commit()

    return CodebaseDocResponse(
        doc_id=doc.id,
        title=doc.title,
        status=doc.status.value,
        summary=ai_result["summary"],
        markdown=ai_result["markdown"],
        created_at=doc.created_at.isoformat(),
    )


@router.post("/upload", summary="Upload a source file for documentation")
async def upload_file(
    project_id: str = Form(...),
    language: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload a source file (Python, JS, Go, etc.) to generate documentation automatically.
    Max file size: 10MB.
    """
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Max 10MB.")

    code = content.decode("utf-8", errors="replace")
    submission = CodeSubmission(
        project_id=project_id,
        filename=file.filename,
        language=language,
        code=code,
    )
    return await analyze_code(submission, db)


@router.post("/detect-outdated", summary="Detect outdated documentation")
async def detect_outdated(
    doc_id: str,
    new_code: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Compare existing documentation against updated code.
    Returns a detailed report of what's stale and recommended updates.
    """
    result = await db.execute(select(Documentation).where(Documentation.id == doc_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Documentation not found")

    ai_result = await ai_service.detect_outdated_docs(
        existing_doc=doc.content_markdown,
        new_code=new_code,
    )

    # Mark as outdated in DB
    doc.status = DocStatus.OUTDATED
    doc.updated_at = datetime.utcnow()
    await db.commit()

    return {
        "doc_id": doc_id,
        "original_title": doc.title,
        "outdated_analysis": ai_result["markdown"],
        "status": "outdated",
    }


@router.get("/project/{project_id}", summary="List all codebase docs for a project")
async def list_project_docs(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve all code documentation entries for a given project."""
    result = await db.execute(
        select(Documentation).where(
            Documentation.project_id == project_id,
            Documentation.doc_type == DocType.CODEBASE,
        )
    )
    docs = result.scalars().all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "source_ref": d.source_ref,
            "status": d.status.value,
            "summary": d.ai_summary,
            "version": d.version,
            "updated_at": d.updated_at.isoformat() if d.updated_at else None,
        }
        for d in docs
    ]

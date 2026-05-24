"""
Chat and QA Router.
Enables interactive, context-aware codebase Q&A using generated documentation.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_db
from app.models.project import Project
from app.models.documentation import Documentation, DocStatus
from app.services.ai_service import ai_service

router = APIRouter()

class AskRequest(BaseModel):
    project_id: str
    question: str

@router.post("/ask", summary="Ask a question about the project codebase")
async def ask_codebase_question(
    request: AskRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Ask a question about the selected project.
    
    The agent searches all generated documentation (Overviews, Architecture Guides, API specs,
    and Module docs) for the project, compiles the context, and answers the query.
    """
    # Verify project exists
    proj_result = await db.execute(select(Project).where(Project.id == request.project_id))
    project = proj_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Fetch completed documentation entries
    docs_result = await db.execute(
        select(Documentation).where(
            Documentation.project_id == request.project_id,
            Documentation.status == DocStatus.COMPLETED
        )
    )
    docs = docs_result.scalars().all()
    
    if not docs:
        raise HTTPException(
            status_code=400, 
            detail="No documentation found for this project yet. Please generate some docs first!"
        )

    # Compile context from documents (titles, summaries, and snippet of contents)
    context_blocks = []
    for doc in docs:
        block = f"--- Document: {doc.title} ({doc.doc_type.value}) ---\n"
        if doc.ai_summary:
            block += f"Summary: {doc.ai_summary}\n"
        # Include snippet of full content
        if doc.content_markdown:
            # First 1500 chars of markdown to avoid blowing up context size
            block += f"Content Snippet:\n{doc.content_markdown[:1500]}\n"
        context_blocks.append(block)

    context_str = "\n".join(context_blocks)
    # Truncate context string to safety limit (e.g. 15,000 characters)
    if len(context_str) > 15000:
        context_str = context_str[:15000] + "\n...[TRUNCATED CONTEXT]..."

    try:
        answer = await ai_service.answer_codebase_question(
            question=request.question,
            doc_context=context_str
        )
        return {
            "question": request.question,
            "answer": answer,
            "context_sources": [{"title": d.title, "type": d.doc_type.value} for d in docs]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate answer: {str(e)}")

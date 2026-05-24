"""
API Documentation Routes.
Generate docs from OpenAPI specs, endpoint definitions, or manual descriptions.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
import uuid
import json

from app.core.database import get_db
from app.models.documentation import Documentation, DocType, DocStatus
from app.models.project import Project
from app.services.ai_service import ai_service

router = APIRouter()


class EndpointInfo(BaseModel):
    method: str                          # GET, POST, PUT, DELETE, PATCH
    path: str                            # /api/v1/users/{id}
    description: Optional[str] = None
    request_body: Optional[dict] = None
    response_schema: Optional[dict] = None
    auth_required: bool = False
    tags: List[str] = []


class APIDocRequest(BaseModel):
    project_id: str
    endpoint: EndpointInfo
    project_context: Optional[str] = None


class OpenAPIImportRequest(BaseModel):
    project_id: str
    openapi_spec: dict                   # Full OpenAPI 3.x JSON


@router.post("/generate", summary="Generate docs for a single API endpoint")
async def generate_endpoint_doc(
    request: APIDocRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate complete API documentation for a single endpoint.
    Include request/response schemas for the richest output.
    """
    result = await db.execute(select(Project).where(Project.id == request.project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    endpoint_str = json.dumps(request.endpoint.model_dump(), indent=2)

    try:
        ai_result = await ai_service.generate_api_doc(
            endpoint_info=endpoint_str,
            project_context=request.project_context,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    doc = Documentation(
        id=str(uuid.uuid4()),
        project_id=request.project_id,
        title=f"{request.endpoint.method.upper()} {request.endpoint.path}",
        doc_type=DocType.API,
        status=DocStatus.COMPLETED,
        source_ref=f"{request.endpoint.method.upper()} {request.endpoint.path}",
        content_markdown=ai_result["markdown"],
        ai_summary=ai_result["summary"],
    )
    db.add(doc)
    await db.commit()

    return {
        "doc_id": doc.id,
        "endpoint": f"{request.endpoint.method.upper()} {request.endpoint.path}",
        "status": "completed",
        "summary": ai_result["summary"],
        "markdown": ai_result["markdown"],
    }


@router.post("/import-openapi", summary="Bulk-generate docs from OpenAPI spec")
async def import_openapi_spec(
    request: OpenAPIImportRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Import an OpenAPI 3.x specification and generate documentation
    for all defined endpoints automatically.
    """
    result = await db.execute(select(Project).where(Project.id == request.project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    spec = request.openapi_spec
    paths = spec.get("paths", {})
    generated = []

    for path, path_item in paths.items():
        for method, operation in path_item.items():
            if method.upper() not in ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]:
                continue

            endpoint_info = {
                "method": method.upper(),
                "path": path,
                "description": operation.get("summary", ""),
                "request_body": operation.get("requestBody"),
                "response_schema": operation.get("responses"),
                "tags": operation.get("tags", []),
            }

            try:
                ai_result = await ai_service.generate_api_doc(
                    endpoint_info=json.dumps(endpoint_info, indent=2)
                )
                doc = Documentation(
                    id=str(uuid.uuid4()),
                    project_id=request.project_id,
                    title=f"{method.upper()} {path}",
                    doc_type=DocType.API,
                    status=DocStatus.COMPLETED,
                    source_ref=f"{method.upper()} {path}",
                    content_markdown=ai_result["markdown"],
                    ai_summary=ai_result["summary"],
                )
                db.add(doc)
                generated.append({"endpoint": f"{method.upper()} {path}", "doc_id": doc.id})
            except Exception as e:
                generated.append({"endpoint": f"{method.upper()} {path}", "error": str(e)})

    await db.commit()
    return {"imported": len(generated), "results": generated}


@router.get("/project/{project_id}", summary="List all API docs for a project")
async def list_api_docs(project_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve all generated API endpoint documentation for a project."""
    result = await db.execute(
        select(Documentation).where(
            Documentation.project_id == project_id,
            Documentation.doc_type == DocType.API,
        )
    )
    docs = result.scalars().all()
    return [
        {
            "id": d.id,
            "endpoint": d.source_ref,
            "summary": d.ai_summary,
            "status": d.status.value,
            "updated_at": d.updated_at.isoformat() if d.updated_at else None,
        }
        for d in docs
    ]

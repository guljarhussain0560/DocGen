"""SQLAlchemy ORM models for Documentation."""

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum

from app.core.database import Base


class DocType(str, enum.Enum):
    CODEBASE = "codebase"
    API = "api"
    PULL_REQUEST = "pull_request"
    DEPLOYMENT = "deployment"
    CHANGELOG = "changelog"


class DocStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    OUTDATED = "outdated"


class Documentation(Base):
    __tablename__ = "documentation"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    title = Column(String(500), nullable=False)
    doc_type = Column(SAEnum(DocType, native_enum=False), nullable=False)
    status = Column(SAEnum(DocStatus, native_enum=False), default=DocStatus.PENDING)
    source_ref = Column(String(500))          # file path, PR number, endpoint
    content_markdown = Column(Text)           # Generated markdown content
    content_html = Column(Text)               # Rendered HTML
    ai_summary = Column(Text)                 # Short AI-generated summary
    version = Column(String(50), default="1.0")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="docs")

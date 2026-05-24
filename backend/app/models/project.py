"""SQLAlchemy ORM model for Projects."""

from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False, unique=True)
    description = Column(Text)
    github_repo = Column(String(500))         # owner/repo format
    tech_stack = Column(String(500))          # comma-separated list
    status = Column(String(50), default="idle")  # idle, scanning, completed, failed
    progress = Column(Integer, default=0)       # 0 to 100
    agent_phase = Column(String(100), default="")  # e.g., discovery, architecture, etc.
    agent_log = Column(Text, default="")
    current_file = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    docs = relationship("Documentation", back_populates="project",
                        cascade="all, delete-orphan")
    scans = relationship("RepoScanHistory", back_populates="project",
                         cascade="all, delete-orphan")


class RepoScanHistory(Base):
    __tablename__ = "repo_scans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    repo_url = Column(String(500), nullable=False)
    status = Column(String(50), default="pending")  # scanning, completed, failed
    doc_count = Column(Integer, default=0)
    scanned_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="scans")

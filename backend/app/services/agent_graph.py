"""
LangGraph-based Agent Pipeline for repository documentation generation.
Defines a state machine with structured phases:
  Discovery → Overview → Architecture → Dependencies → Module Docs → API Extraction → Completion
"""

import asyncio
import os
import re
import uuid
from datetime import datetime
from typing import Optional, TypedDict, List, Dict, Any

import aiofiles
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.core.config import settings
from app.models.project import Project, RepoScanHistory
from app.models.documentation import Documentation, DocType, DocStatus
from app.services.github_service import github_service
from app.services.ai_service import ai_service
from app.services.sse_manager import sse_manager


# ── LangGraph State Schema ──────────────────────────────────────────── #

class AgentState(TypedDict, total=False):
    """Typed state flowing through the LangGraph pipeline."""
    project_id: str
    project_name: str
    owner: str
    repo: str
    scan_history_id: str
    phase: str          # discovery | overview | architecture | dependencies | documenting | api_extraction | completed | failed
    progress: int       # 0-100
    logs: List[str]
    current_file: Optional[str]
    file_tree_str: str
    main_coding_files: List[Dict]
    dependency_files: List[Dict]
    configs_str: str
    overview_markdown: str
    docs_count: int
    error: Optional[str]
    commit_sha: Optional[str]
    since_date: Optional[str]
    until_date: Optional[str]


# ── Helper Functions ─────────────────────────────────────────────────── #

async def _update_db_status(project_id: str, status: str, progress: int, phase: str, log_message: str, current_file: Optional[str] = None):
    """Update project status in the database and publish SSE event."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Project).where(Project.id == project_id))
        proj = result.scalar_one_or_none()
        if proj:
            if proj.status != "scanning" and status == "scanning":
                # Keep the user's stopped/idle status, do not reset to scanning
                pass
            else:
                proj.status = status
            proj.progress = progress
            proj.agent_phase = phase
            proj.current_file = current_file
            timestamp = datetime.utcnow().strftime("%H:%M:%S")
            new_log = f"[{timestamp}] {log_message}"
            proj.agent_log = (proj.agent_log or "") + new_log + "\n"
            await db.commit()

    # Publish real-time SSE event
    sse_manager.publish(project_id, {
        "type": "status",
        "status": status,
        "progress": progress,
        "phase": phase,
        "current_file": current_file,
        "log": log_message,
        "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
    })


async def _write_to_disk(project_name: str, repo: str, filepath: str, content: str):
    """Write generated markdown to disk under generated_docs/."""
    try:
        project_name_safe = re.sub(r'[^a-zA-Z0-9_-]', '_', project_name)
        repo_name_safe = re.sub(r'[^a-zA-Z0-9_-]', '_', repo)
        base_dir = os.path.abspath(settings.DOCS_OUTPUT_DIR)
        output_dir = os.path.join(base_dir, project_name_safe, repo_name_safe)
        target_path = os.path.join(output_dir, filepath)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        async with aiofiles.open(target_path, "w", encoding="utf-8") as f:
            await f.write(content)
    except Exception as e:
        print(f"Failed to write file to disk: {e}")


async def _save_doc(project_id: str, title: str, doc_type: DocType, source_ref: str, markdown: str, summary: str) -> str:
    """Persist a Documentation record (updates if source_ref exists, otherwise inserts)."""
    async with AsyncSessionLocal() as db:
        from sqlalchemy import and_
        result = await db.execute(
            select(Documentation)
            .where(and_(Documentation.project_id == project_id, Documentation.source_ref == source_ref))
        )
        doc = result.scalar_one_or_none()
        
        if doc:
            doc.title = title
            doc.doc_type = doc_type
            doc.content_markdown = markdown
            doc.ai_summary = summary
            doc.status = DocStatus.COMPLETED
            doc.updated_at = datetime.utcnow()
            doc_id = doc.id
        else:
            doc_id = str(uuid.uuid4())
            doc = Documentation(
                id=doc_id,
                project_id=project_id,
                title=title,
                doc_type=doc_type,
                status=DocStatus.COMPLETED,
                source_ref=source_ref,
                content_markdown=markdown,
                ai_summary=summary,
            )
            db.add(doc)
        await db.commit()
    return doc_id


async def _is_stopped(project_id: str) -> bool:
    """Check if the scan has been stopped by the user."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Project).where(Project.id == project_id))
        proj = result.scalar_one_or_none()
        return not proj or proj.status != "scanning"



# ── LangGraph Node Functions ────────────────────────────────────────── #

async def discovery_node(state: AgentState) -> AgentState:
    """Phase 1: Fetch repo tree, filter files, build file list."""
    pid = state["project_id"]
    if await _is_stopped(pid):
        state["phase"] = "completed"
        return state
    owner, repo = state["owner"], state["repo"]

    await _update_db_status(pid, "scanning", 5, "Discovery", "Initializing agentic scan...")
    await _update_db_status(pid, "scanning", 10, "Discovery", "Scanning remote codebase tree structure...")

    files = await github_service.get_repo_tree(owner, repo)

    commit_sha = state.get("commit_sha")
    since_date = state.get("since_date")
    until_date = state.get("until_date")

    changed_paths = None
    removed_paths = set()
    if commit_sha:
        await _update_db_status(pid, "scanning", 10, "Discovery", f"Fetching changes for commit {commit_sha[:8]}...")
        try:
            changes = await github_service.get_commit_changes(owner, repo, commit_sha)
            changed_paths = {c["path"] for c in changes}
            removed_paths = {c["path"] for c in changes if c["status"] == "removed"}
        except Exception as e:
            await _update_db_status(pid, "scanning", 10, "Discovery", f"[WARN] Failed to fetch commit changes: {e}")
    elif since_date or until_date:
        await _update_db_status(pid, "scanning", 10, "Discovery", "Fetching changes within date range...")
        try:
            changes = await github_service.get_date_range_changes(owner, repo, since_date, until_date)
            changed_paths = {c["path"] for c in changes}
            removed_paths = {c["path"] for c in changes if c["status"] == "removed"}
        except Exception as e:
            await _update_db_status(pid, "scanning", 10, "Discovery", f"[WARN] Failed to fetch date range changes: {e}")

    # Remove documentation records for deleted files
    if removed_paths:
        async with AsyncSessionLocal() as db:
            from sqlalchemy import delete
            await db.execute(
                delete(Documentation)
                .where(Documentation.project_id == pid)
                .where(Documentation.source_ref.in_(list(removed_paths)))
            )
            await db.commit()
        await _update_db_status(pid, "scanning", 12, "Discovery", f"Removed documentation for {len(removed_paths)} deleted files.")

    valid_extensions = {".py", ".js", ".ts", ".jsx", ".tsx", ".go", ".rs", ".java", ".cpp", ".c", ".h", ".rb", ".php", ".cs", ".swift", ".kt", ".scala", ".vue", ".svelte"}
    dependency_basenames = {"requirements.txt", "package.json", "go.mod", "Cargo.toml", "setup.py", "Pipfile", "Makefile", "pyproject.toml", "pom.xml", "build.gradle", "composer.json", "Gemfile"}
    exclude_patterns = {"test", "spec", "mock", "lock", ".min.", "node_modules", "venv", "__pycache__", "dist", "build", ".git", ".github", "vendor", ".vscode", ".idea"}

    main_coding_files = []
    dependency_files = []

    for f in files:
        path = f.get("path", "")
        path_lower = path.lower()
        if any(pat in path_lower for pat in exclude_patterns):
            continue

        # If running an incremental scan, only process changed files
        if changed_paths is not None and path not in changed_paths:
            continue

        basename = path.split("/")[-1]
        if basename in dependency_basenames:
            dependency_files.append(f)
        elif any(path.endswith(ext) for ext in valid_extensions):
            main_coding_files.append(f)

    # Limit coding files to avoid rate limits
    main_coding_files = main_coding_files[:15]

    file_tree_lines = [f"{f.get('type', 'file')}: {f.get('path', '')}" for f in main_coding_files + dependency_files]
    file_tree_str = "\n".join(file_tree_lines)

    await _update_db_status(pid, "scanning", 15, "Discovery",
                            f"Found {len(main_coding_files)} coding files and {len(dependency_files)} dependency files.")

    # Read dependency configs (limit to first 5 config files and 800 chars to avoid rate limits)
    configs_str = ""
    for f in dependency_files[:5]:
        path = f.get("path", "")
        content = await github_service.get_file_content(owner, repo, path)
        if content:
            configs_str += f"\nFile: {path}\n```\n{content[:800]}\n```\n"

    state["file_tree_str"] = file_tree_str
    state["main_coding_files"] = main_coding_files
    state["dependency_files"] = dependency_files
    state["configs_str"] = configs_str
    state["phase"] = "overview"
    return state


async def overview_node(state: AgentState) -> AgentState:
    """Phase 2: Generate project overview document."""
    pid = state["project_id"]
    if await _is_stopped(pid):
        state["phase"] = "completed"
        return state
    if state.get("commit_sha") or state.get("since_date") or state.get("until_date"):
        await _update_db_status(pid, "scanning", 25, "Overview", "Skipping project overview for incremental scan.")
        state["phase"] = "architecture"
        return state

    await _update_db_status(pid, "scanning", 20, "Overview", "Generating high-level project overview...")

    overview_res = await ai_service.generate_project_overview(state["file_tree_str"], state["configs_str"])

    await _save_doc(pid, "Project Overview & Tech Stack Guide", DocType.CODEBASE,
                    "GitHub Repository Overview", overview_res["markdown"], overview_res["summary"])
    await _write_to_disk(state["project_name"], state["repo"], "Project_Overview.md", overview_res["markdown"])

    state["overview_markdown"] = overview_res["markdown"]
    state["docs_count"] = state.get("docs_count", 0) + 1
    state["phase"] = "architecture"

    await _update_db_status(pid, "scanning", 28, "Overview", "[OK] Project Overview generated successfully.")
    return state


async def architecture_node(state: AgentState) -> AgentState:
    """Phase 3: Generate system architecture guide."""
    pid = state["project_id"]
    if await _is_stopped(pid):
        state["phase"] = "completed"
        return state
    if state.get("commit_sha") or state.get("since_date") or state.get("until_date"):
        await _update_db_status(pid, "scanning", 35, "Architecture", "Skipping architecture guide for incremental scan.")
        state["phase"] = "dependencies"
        return state

    await _update_db_status(pid, "scanning", 30, "Architecture", "Mapping system architecture & generating diagrams...")

    arch_res = await ai_service.generate_system_architecture(
        state["file_tree_str"], state["configs_str"], state["overview_markdown"]
    )

    await _save_doc(pid, "System Architecture Guide", DocType.CODEBASE,
                    "GitHub System Architecture", arch_res["markdown"], arch_res["summary"])
    await _write_to_disk(state["project_name"], state["repo"], "System_Architecture.md", arch_res["markdown"])

    state["docs_count"] = state.get("docs_count", 0) + 1
    state["phase"] = "dependencies"

    await _update_db_status(pid, "scanning", 40, "Architecture", "[OK] System Architecture guide generated.")
    return state


async def dependency_node(state: AgentState) -> AgentState:
    """Phase 4: Analyze dependency files (conditional — skipped if none)."""
    pid = state["project_id"]
    if await _is_stopped(pid):
        state["phase"] = "completed"
        return state
    if state.get("commit_sha") or state.get("since_date") or state.get("until_date"):
        await _update_db_status(pid, "scanning", 45, "Dependencies", "Skipping dependency analysis for incremental scan.")
        state["phase"] = "documenting"
        return state

    if not state["configs_str"]:
        await _update_db_status(pid, "scanning", 48, "Dependencies", "No dependency files found - skipping.")
        state["phase"] = "documenting"
        return state

    await _update_db_status(pid, "scanning", 45, "Dependencies", "Analyzing codebase dependency libraries...")

    dep_res = await ai_service.generate_dependency_analysis(state["configs_str"])

    await _save_doc(pid, "Dependency & Package Analysis", DocType.CHANGELOG,
                    "Dependencies Configuration", dep_res["markdown"], dep_res["summary"])
    await _write_to_disk(state["project_name"], state["repo"], "Dependency_Analysis.md", dep_res["markdown"])

    state["docs_count"] = state.get("docs_count", 0) + 1
    state["phase"] = "documenting"

    await _update_db_status(pid, "scanning", 48, "Dependencies", "[OK] Dependency analysis complete.")
    return state


async def documenting_node(state: AgentState) -> AgentState:
    """Phase 5: Generate per-file documentation for each main coding file."""
    pid = state["project_id"]
    owner, repo = state["owner"], state["repo"]
    main_files = state["main_coding_files"]

    if not main_files:
        await _update_db_status(pid, "scanning", 85, "Documenting", "No main coding files identified.")
        state["phase"] = "api_extraction"
        return state

    total = len(main_files)
    await _update_db_status(pid, "scanning", 50, "Documenting",
                            f"Starting documentation for {total} coding files...")

    for idx, file_node in enumerate(main_files):
        progress = 50 + int((idx / total) * 35)
        if await _is_stopped(pid):
            await _update_db_status(pid, "idle", progress, "Documenting", "Scan stopped by user.")
            state["phase"] = "completed"
            return state
        path = file_node["path"]
        
        await _update_db_status(pid, "scanning", progress, "Documenting",
                                f"Analyzing: {path}", current_file=path)

        code = await github_service.get_file_content(owner, repo, path)
        if not code or len(code.strip()) == 0:
            continue

        ext = path.split('.')[-1]
        language_map = {
            "py": "python", "js": "javascript", "jsx": "javascript",
            "ts": "typescript", "tsx": "typescript",
            "go": "go", "rs": "rust", "java": "java",
            "cpp": "cpp", "c": "c", "h": "c", "rb": "ruby", "php": "php",
            "cs": "csharp", "swift": "swift", "kt": "kotlin",
            "scala": "scala", "vue": "vue", "svelte": "svelte",
        }
        language = language_map.get(ext, "unknown")

        try:
            ai_result = await ai_service.generate_codebase_doc(
                code=code, filename=path, language=language,
                project_context=state.get("overview_markdown", "")[:2000]
            )

            await _save_doc(pid, f"Doc: {path}", DocType.CODEBASE,
                            path, ai_result["markdown"], ai_result["summary"])

            disk_filepath = os.path.join("codebase", f"{path}.md")
            await _write_to_disk(state["project_name"], repo, disk_filepath, ai_result["markdown"])

            state["docs_count"] = state.get("docs_count", 0) + 1

            await _update_db_status(pid, "scanning", progress, "Documenting",
                                    f"[OK] Documented: {path}")

        except Exception as e:
            await _update_db_status(pid, "scanning", progress, "Documenting",
                                    f"[WARN] Failed to document {path}: {str(e)[:100]}")

        await asyncio.sleep(1.5)  # Rate limit protection

    state["phase"] = "api_extraction"
    return state


async def api_extraction_node(state: AgentState) -> AgentState:
    """Phase 6: Generate API reference if web project detected."""
    pid = state["project_id"]
    if await _is_stopped(pid):
        state["phase"] = "completed"
        return state
    await _update_db_status(pid, "scanning", 90, "API Extraction",
                            "Checking for web project patterns...", current_file="API Reference")

    # Check if it's a web project
    web_indicators = ["main.py", "app.js", "server.js", "index.js", "routes.py", "urls.py", "app.py"]
    is_web = any(
        f.get("path", "").split("/")[-1].lower() in web_indicators
        for f in state["main_coding_files"]
    )

    if is_web:
        try:
            await _update_db_status(pid, "scanning", 92, "API Extraction",
                                    "Generating API reference documentation...")
            api_info = {
                "method": "GET/POST",
                "path": "/api/*",
                "description": "Auto-extracted API routes from project codebase"
            }
            ai_api_res = await ai_service.generate_api_doc(
                api_info, project_context=state.get("overview_markdown", "")[:2000]
            )
            await _save_doc(pid, "API Reference Guide", DocType.API,
                            "Auto-Generated API Reference", ai_api_res["markdown"], ai_api_res["summary"])
            await _write_to_disk(state["project_name"], state["repo"], "API_Reference.md", ai_api_res["markdown"])
            state["docs_count"] = state.get("docs_count", 0) + 1

            await _update_db_status(pid, "scanning", 95, "API Extraction",
                                    "[OK] API Reference guide generated.")
        except Exception as e:
            await _update_db_status(pid, "scanning", 95, "API Extraction",
                                    f"[WARN] Could not generate API Reference: {str(e)[:80]}")
    else:
        await _update_db_status(pid, "scanning", 95, "API Extraction",
                                "No web project patterns detected - skipping API reference.")

    state["phase"] = "completed"
    return state


async def completion_node(state: AgentState) -> AgentState:
    """Phase 7: Finalize scan, mark complete."""
    pid = state["project_id"]
    docs_count = state.get("docs_count", 0)

    await _update_db_status(pid, "completed", 100, "Completed",
                            f"[OK] Agent scan complete! Generated {docs_count} documentation files.",
                            current_file=None)

    # Update scan history
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(RepoScanHistory).where(RepoScanHistory.id == state["scan_history_id"])
        )
        history = result.scalar_one_or_none()
        if history:
            history.status = "completed"
            history.doc_count = docs_count
            history.completed_at = datetime.utcnow()
            await db.commit()

    # Publish completion event
    sse_manager.publish(pid, {
        "type": "complete",
        "status": "completed",
        "progress": 100,
        "phase": "Completed",
        "docs_count": docs_count,
    })

    state["phase"] = "completed"
    return state


# ── Pipeline Orchestrator ──────────────────────────────────────────── #

async def run_agent_pipeline(
    project_id: str, owner: str, repo: str, scan_history_id: str,
    commit_sha: Optional[str] = None,
    since_date: Optional[str] = None,
    until_date: Optional[str] = None
):
    """
    Execute the full LangGraph-style documentation agent pipeline.
    Uses a sequential state machine with conditional edges.
    """
    # Fetch project name
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Project).where(Project.id == project_id))
        proj = result.scalar_one_or_none()
        if not proj:
            raise Exception("Project not found")
        project_name = proj.name

    # Initialize state
    state: AgentState = {
        "project_id": project_id,
        "project_name": project_name,
        "owner": owner,
        "repo": repo,
        "scan_history_id": scan_history_id,
        "phase": "discovery",
        "progress": 0,
        "logs": [],
        "current_file": None,
        "file_tree_str": "",
        "main_coding_files": [],
        "dependency_files": [],
        "configs_str": "",
        "overview_markdown": "",
        "docs_count": 0,
        "error": None,
        "commit_sha": commit_sha,
        "since_date": since_date,
        "until_date": until_date,
    }

    # Define the pipeline as an ordered node sequence
    pipeline = [
        ("discovery", discovery_node),
        ("overview", overview_node),
        ("architecture", architecture_node),
        ("dependencies", dependency_node),
        ("documenting", documenting_node),
        ("api_extraction", api_extraction_node),
        ("completion", completion_node),
    ]

    try:
        for node_name, node_fn in pipeline:
            state = await node_fn(state)
            # Check for early termination
            if state.get("phase") == "failed":
                break
    except Exception as e:
        # Handle pipeline failure
        await _update_db_status(
            project_id, "failed", 100, "Failed",
            f"Agent pipeline error: {str(e)}", current_file=None
        )
        # Update scan history
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(RepoScanHistory).where(RepoScanHistory.id == scan_history_id)
            )
            history = result.scalar_one_or_none()
            if history:
                history.status = "failed"
                history.completed_at = datetime.utcnow()
                await db.commit()

        sse_manager.publish(project_id, {
            "type": "error",
            "status": "failed",
            "progress": 100,
            "phase": "Failed",
            "error": str(e),
        })

"""
AI Documentation Generation Service.
Uses LangChain + NVIDIA API (ChatNVIDIA) to generate, update, and summarize technical documentation.
"""

import requests
from typing import Optional
from app.core.config import settings


class AIDocService:
    """Wraps NVIDIA API calls for documentation tasks via LangChain ChatNVIDIA."""

    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.model = settings.AI_MODEL
        self.invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        self._llm = None

    def _get_llm(self):
        """Lazy-init LangChain ChatNVIDIA model."""
        if self._llm is None:
            try:
                from langchain_nvidia_ai_endpoints import ChatNVIDIA
                self._llm = ChatNVIDIA(
                    model=self.model,
                    api_key=self.api_key,
                    temperature=0.20,
                    top_p=0.70,
                    max_tokens=settings.AI_MAX_TOKENS,
                )
            except Exception:
                # Fallback: use raw API if langchain-nvidia not available
                self._llm = None
        return self._llm

    def _call_llm(self, prompt: str) -> str:
        """Call LLM — tries LangChain ChatNVIDIA first, falls back to raw REST."""
        llm = self._get_llm()
        if llm is not None:
            try:
                from langchain_core.messages import HumanMessage
                response = llm.invoke([HumanMessage(content=prompt)])
                return response.content
            except Exception:
                pass  # Fall through to raw API

        # Fallback: raw REST API call
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": settings.AI_MAX_TOKENS,
            "temperature": 0.20,
            "top_p": 0.70,
            "stream": False
        }
        response = requests.post(self.invoke_url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]

    # ------------------------------------------------------------------ #
    #  Codebase Documentation                                             #
    # ------------------------------------------------------------------ #

    async def generate_codebase_doc(
        self,
        code: str,
        filename: str,
        language: str,
        project_context: Optional[str] = None,
    ) -> dict:
        """Generate full documentation for a source file."""
        context_block = f"\nProject Context:\n{project_context}" if project_context else ""

        prompt = f"""You are an expert technical writer and senior software engineer.
Analyze the following {language} code from file `{filename}` and generate comprehensive documentation.{context_block}

Code:
```{language}
{code}
```

Generate documentation in Markdown with these sections:
1. **Overview** – What this module/file does and its role in the system
2. **Functions/Classes** – Each function/class with signature, parameters, return values, and a usage example
3. **Dependencies** – External imports and why they're used
4. **Usage Examples** – Real-world code examples showing how to use this module
5. **Edge Cases & Warnings** – Gotchas, known limitations, or things developers should watch out for

Be specific, accurate, and developer-friendly. Use code blocks for examples."""

        content = self._call_llm(prompt)
        summary = await self._generate_summary(content)

        return {"markdown": content, "summary": summary}

    # ------------------------------------------------------------------ #
    #  API Endpoint Documentation                                         #
    # ------------------------------------------------------------------ #

    async def generate_api_doc(
        self,
        endpoint_info: dict,
        project_context: Optional[str] = None,
    ) -> dict:
        """Generate documentation for a REST API endpoint."""
        context_block = f"\nProject Context:\n{project_context}" if project_context else ""

        prompt = f"""You are an expert API documentation writer.
Generate clear, complete API documentation for the following endpoint.{context_block}

Endpoint Details:
{endpoint_info}

Generate documentation in Markdown with:
1. **Endpoint Summary** – One-line description
2. **Request** – Method, URL, headers, path params, query params, request body (with JSON schema)
3. **Response** – Status codes, response body schema with field descriptions
4. **Authentication** – Required auth method if any
5. **Examples** – cURL, Python (requests), and JavaScript (fetch) examples
6. **Error Handling** – Common error codes and what they mean
7. **Rate Limiting** – Any rate limit info

Format it like Stripe or Twilio docs – developer-first and copy-paste ready."""

        content = self._call_llm(prompt)
        summary = await self._generate_summary(content)

        return {"markdown": content, "summary": summary}

    # ------------------------------------------------------------------ #
    #  Pull Request Documentation                                         #
    # ------------------------------------------------------------------ #

    async def generate_pr_doc(self, pr_data: dict) -> dict:
        """Generate documentation entry and changelog from a PR."""
        prompt = f"""You are a technical writer analyzing a GitHub Pull Request.
Generate clear documentation and a changelog entry for this PR.

PR Data:
Title: {pr_data.get('title')}
Author: {pr_data.get('author')}
Branch: {pr_data.get('head_branch')} → {pr_data.get('base_branch')}
Description: {pr_data.get('description', 'No description provided')}

Files Changed:
{pr_data.get('files_changed', 'Not provided')}

Diff Summary:
{pr_data.get('diff_summary', 'Not provided')}

Generate in Markdown:
1. **PR Summary** – What this PR changes and why
2. **Breaking Changes** – Any backward-incompatible changes (or "None")
3. **New Features** – New functionality added
4. **Bug Fixes** – Bugs resolved
5. **Migration Guide** – Steps for developers to update their code (if needed)
6. **Changelog Entry** – A concise, user-facing changelog entry in Keep a Changelog format
7. **Documentation Updates Needed** – List any docs that should be updated as a result"""

        content = self._call_llm(prompt)
        summary = await self._generate_summary(content)

        return {"markdown": content, "summary": summary}

    # ------------------------------------------------------------------ #
    #  Deployment Documentation                                           #
    # ------------------------------------------------------------------ #

    async def generate_deployment_doc(self, deployment_data: dict) -> dict:
        """Generate deployment runbook and release notes."""
        prompt = f"""You are a DevOps engineer and technical writer.
Generate deployment documentation and release notes for the following deployment.

Deployment Details:
Environment: {deployment_data.get('environment')}
Version: {deployment_data.get('version')}
Service: {deployment_data.get('service')}
Deployed By: {deployment_data.get('deployed_by')}
Timestamp: {deployment_data.get('timestamp')}
Changes: {deployment_data.get('changes', 'Not specified')}
Config Changes: {deployment_data.get('config_changes', 'None')}
Infrastructure Changes: {deployment_data.get('infra_changes', 'None')}

Generate in Markdown:
1. **Release Notes** – What changed in this deployment (user-facing language)
2. **Deployment Summary** – Environment, version, what was deployed
3. **Pre-Deployment Checklist** – What to verify before deploying this change
4. **Rollback Procedure** – Step-by-step guide to revert if something goes wrong
5. **Post-Deployment Verification** – How to confirm the deployment succeeded
6. **Impact Assessment** – Services affected, expected downtime, performance impact
7. **On-Call Notes** – What to watch for in the next 24 hours"""

        content = self._call_llm(prompt)
        summary = await self._generate_summary(content)

        return {"markdown": content, "summary": summary}

    # ------------------------------------------------------------------ #
    #  Outdated Documentation Detector                                    #
    # ------------------------------------------------------------------ #

    async def detect_outdated_docs(
        self, existing_doc: str, new_code: str
    ) -> dict:
        """Compare existing docs against new code to flag what's stale."""
        prompt = f"""You are a documentation auditor.
Compare the existing documentation against the updated code and identify what's outdated.

Existing Documentation:
{existing_doc}

Updated Code:
{new_code}

Respond in Markdown:
1. **Outdated Sections** – List each section that is no longer accurate and explain why
2. **Missing Documentation** – New code features/functions not yet documented
3. **Recommended Updates** – Specific, actionable changes to make the docs current
4. **Severity** – Rate each issue: Critical / High / Medium / Low
5. **Updated Documentation** – The fully corrected documentation"""

        content = self._call_llm(prompt)
        return {"markdown": content, "has_changes": True}

    # ------------------------------------------------------------------ #
    #  Internal Helpers                                                   #
    # ------------------------------------------------------------------ #

    async def _generate_summary(self, doc_content: str) -> str:
        """Generate a one-paragraph AI summary of generated documentation."""
        prompt = f"Write a single concise paragraph (max 3 sentences) summarizing this technical documentation for a developer dashboard:\n\n{doc_content[:2000]}"
        # Temporarily override max_tokens for summary
        original_max = settings.AI_MAX_TOKENS
        settings.AI_MAX_TOKENS = 200
        try:
            return self._call_llm(prompt)
        finally:
            settings.AI_MAX_TOKENS = original_max

    # ------------------------------------------------------------------ #
    #  Agentic Architecture & Overview Helpers                            #
    # ------------------------------------------------------------------ #

    async def generate_project_overview(self, file_tree: str, configs_str: str) -> dict:
        """Generate high-level codebase structure and tech stack overview."""
        prompt = f"""You are an expert software architect AI agent.
Analyze this repository's file structure and configuration files to build a comprehensive Project Overview.

Repository File Structure:
{file_tree}

Configuration Files & Dependencies:
{configs_str}

Please generate a high-level overview in Markdown format containing:
1. **Tech Stack & Architecture Style** - Primary programming languages, main frameworks, database, libraries, and design patterns.
2. **Directory Breakdown** - Explaining the directory tree and where key modules live (e.g. routes, configuration, database, logic).
3. **Core Entrypoints** - How the application starts, entry files, how files import each other.
4. **Setup & Dependencies Summary** - Summary of key environment variables and dependencies needed to run the project.

Make it clean, detailed, and highly technical."""

        content = self._call_llm(prompt)
        summary = await self._generate_summary(content)
        return {"markdown": content, "summary": summary}

    async def generate_system_architecture(self, file_tree: str, configs_str: str, overview_content: str) -> dict:
        """Generate a deep dive System Architecture Guide including a Mermaid diagram."""
        prompt = f"""You are a principal software architect.
Generate a comprehensive System Architecture Guide for this project based on its directory layout, dependencies, and project overview.

File Structure:
{file_tree}

Config Content:
{configs_str}

Project Overview Context:
{overview_content}

Generate a Markdown document with:
1. **Component Architecture** - Breakdown of key software layers (e.g. Presentation/API Layer, Core Business Logic, Data Access Layer, Background Jobs, External Integrations).
2. **Database & Data Flow Model** - Inferred database tables, key entities, and data flows.
3. **Component Interaction Diagram (Mermaid)** - Generate a detailed, valid Mermaid.js flowchart (using `graph TD` or `graph LR`) visualizing the components, routes, databases, and dependencies.
   *(Make sure to use correct Mermaid syntax, avoid special characters in labels without quotes, and do NOT use HTML tags)*
4. **Key Integration Flows** - Explain how key operations (e.g., authentication, external API calls, webhook handling) flow through the system.

Make the architecture document descriptive, formal, and visual."""

        content = self._call_llm(prompt)
        summary = await self._generate_summary(content)
        return {"markdown": content, "summary": summary}

    async def answer_codebase_question(self, question: str, doc_context: str) -> str:
        """Answer user questions using codebase documentation context."""
        prompt = f"""You are the DocGen AI Agent, an interactive technical co-pilot for this codebase.
Use the following generated documentation context to answer the user's question about the repository.

Documentation Context:
{doc_context}

User's Question:
{question}

Provide a clear, detailed, and accurate answer. If the context contains specific filenames, functions, config keys, or code snippets, reference them in your answer. If you cannot answer based on the context, politely explain what information is missing. Keep your explanation developer-friendly and helpful."""

        return self._call_llm(prompt)

    async def generate_dependency_analysis(self, dependency_files_content: str) -> dict:
        """Generate documentation analyzing external dependencies and packages."""
        prompt = f"""You are a senior DevOps engineer and developer auditor.
Analyze the following project dependency configurations and construct a comprehensive Dependency & Package Analysis Guide.

Dependency Files Content:
{dependency_files_content}

Please generate a Markdown guide containing:
1. **Third-Party Libraries Breakdown** - Core frameworks, libraries, utilities, and development packages utilized.
2. **Security & Version Assessment** - Note any deprecated or potentially risky packages, or major version choices.
3. **Environment Setup Requirements** - Detailed instructions on installation commands (e.g. npm install, pip install) and configuration variables needed.

Make it clean, clear, and actionable for onboarding developers."""

        content = self._call_llm(prompt)
        summary = await self._generate_summary(content)
        return {"markdown": content, "summary": summary}


# Singleton instance
ai_service = AIDocService()

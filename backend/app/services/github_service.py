import httpx
from typing import List, Dict, Optional
import base64
from app.core.config import settings

class GitHubService:
    def __init__(self):
        self.base_url = "https://api.github.com"

    def _get_headers(self) -> dict:
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if settings.GITHUB_TOKEN:
            headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
        return headers

    async def get_repo_tree(self, owner: str, repo: str, branch: str = "main") -> List[Dict]:
        """Fetch all files in the repository recursively."""
        async with httpx.AsyncClient() as client:
            # Get latest commit of the branch to get the tree sha
            url = f"{self.base_url}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
            response = await client.get(url, headers=self._get_headers())
            
            if response.status_code == 404:
                # Try 'master' if 'main' fails
                if branch == "main":
                    return await self.get_repo_tree(owner, repo, "master")
                raise Exception(f"Repository or branch not found: {owner}/{repo}")
                
            response.raise_for_status()
            data = response.json()
            
            # Filter only blobs (files)
            files = [item for item in data.get("tree", []) if item.get("type") == "blob"]
            return files

    async def get_file_content(self, owner: str, repo: str, path: str) -> Optional[str]:
        """Fetch the raw content of a specific file."""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/repos/{owner}/{repo}/contents/{path}"
            response = await client.get(url, headers=self._get_headers())
            
            if response.status_code == 404:
                return None
                
            response.raise_for_status()
            data = response.json()
            
            if data.get("encoding") == "base64":
                content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
                return content
            return None

    async def get_commit_changes(self, owner: str, repo: str, sha: str) -> List[Dict]:
        """Fetch files changed in a specific commit."""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/repos/{owner}/{repo}/commits/{sha}"
            response = await client.get(url, headers=self._get_headers())
            
            if response.status_code == 404:
                raise Exception(f"Commit not found: {sha}")
                
            response.raise_for_status()
            data = response.json()
            
            files = [
                {"path": f.get("filename", ""), "status": f.get("status", "")}
                for f in data.get("files", [])
            ]
            return files

    async def get_date_range_changes(self, owner: str, repo: str, since: Optional[str] = None, until: Optional[str] = None) -> List[Dict]:
        """Fetch files changed in commits within a specific date range."""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/repos/{owner}/{repo}/commits"
            params = {}
            if since:
                params["since"] = since
            if until:
                params["until"] = until
                
            response = await client.get(url, params=params, headers=self._get_headers())
            
            if response.status_code == 404:
                raise Exception(f"Repository or branch not found: {owner}/{repo}")
                
            response.raise_for_status()
            commits = response.json()
            
            if not commits:
                return []
                
            changed_files = {}
            # Limit to at most 15 commits to avoid overloading
            for c in commits[:15]:
                sha = c.get("sha")
                if not sha:
                    continue
                try:
                    files = await self.get_commit_changes(owner, repo, sha)
                    for f in files:
                        path = f["path"]
                        status = f["status"]
                        changed_files[path] = status
                except Exception as e:
                    print(f"Error fetching changes for commit {sha}: {e}")
                    
            return [
                {"path": path, "status": status}
                for path, status in changed_files.items()
            ]

    async def get_recent_commits(self, owner: str, repo: str, per_page: int = 30) -> List[Dict]:
        """Fetch recent commits of a repository."""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/repos/{owner}/{repo}/commits"
            params = {"per_page": per_page}
            response = await client.get(url, params=params, headers=self._get_headers())
            
            if response.status_code == 404:
                raise Exception(f"Repository or branch not found: {owner}/{repo}")
                
            response.raise_for_status()
            commits = response.json()
            
            result = []
            for item in commits:
                sha = item.get("sha", "")
                commit_info = item.get("commit", {})
                message = commit_info.get("message", "")
                author_info = commit_info.get("author", {})
                author_name = author_info.get("name", "")
                date = author_info.get("date", "")
                result.append({
                    "sha": sha,
                    "message": message,
                    "author_name": author_name,
                    "date": date
                })
            return result

    async def get_recent_pull_requests(self, owner: str, repo: str, state: str = "open", per_page: int = 30) -> List[Dict]:
        """Fetch recent pull requests from the repository."""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/repos/{owner}/{repo}/pulls"
            params = {"state": state, "per_page": per_page}
            response = await client.get(url, params=params, headers=self._get_headers())
            
            if response.status_code == 404:
                raise Exception(f"Repository or branch not found: {owner}/{repo}")
                
            response.raise_for_status()
            pulls = response.json()
            
            result = []
            for item in pulls:
                result.append({
                    "number": item.get("number"),
                    "title": item.get("title"),
                    "state": item.get("state"),
                    "user": item.get("user", {}).get("login"),
                    "head_ref": item.get("head", {}).get("ref"),
                    "base_ref": item.get("base", {}).get("ref"),
                    "body": item.get("body"),
                    "created_at": item.get("created_at"),
                    "html_url": item.get("html_url")
                })
            return result

    async def get_pull_request_details(self, owner: str, repo: str, pull_number: int) -> Dict:
        """Fetch details of a specific pull request including files changed."""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/repos/{owner}/{repo}/pulls/{pull_number}"
            response = await client.get(url, headers=self._get_headers())
            
            if response.status_code == 404:
                raise Exception(f"Pull request #{pull_number} not found in {owner}/{repo}")
                
            response.raise_for_status()
            pr_data = response.json()
            
            # Fetch files
            files_url = f"{self.base_url}/repos/{owner}/{repo}/pulls/{pull_number}/files"
            files_response = await client.get(files_url, headers=self._get_headers())
            files_response.raise_for_status()
            files_data = files_response.json()
            
            files_changed = "\n".join([f.get("filename", "") for f in files_data])
            
            additions = pr_data.get("additions", 0)
            deletions = pr_data.get("deletions", 0)
            changed_files_count = pr_data.get("changed_files", 0)
            diff_summary = f"Lines changed: +{additions} -{deletions}, files: {changed_files_count}"
            
            return {
                "number": pr_data.get("number"),
                "title": pr_data.get("title"),
                "author": pr_data.get("user", {}).get("login"),
                "head_branch": pr_data.get("head", {}).get("ref"),
                "base_branch": pr_data.get("base", {}).get("ref"),
                "description": pr_data.get("body", ""),
                "files_changed": files_changed,
                "diff_summary": diff_summary,
            }

github_service = GitHubService()



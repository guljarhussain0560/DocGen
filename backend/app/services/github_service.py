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

github_service = GitHubService()

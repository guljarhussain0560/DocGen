"""
Server-Sent Events (SSE) Manager for real-time agent log streaming.
Maintains per-project event queues so multiple browser tabs can subscribe.
"""

import asyncio
import json
from typing import AsyncGenerator, Dict
from collections import defaultdict


class SSEManager:
    """Manages SSE event queues per project for real-time streaming."""

    def __init__(self):
        self._queues: Dict[str, list[asyncio.Queue]] = defaultdict(list)

    def publish(self, project_id: str, event_data: dict):
        """Push an event to all subscribers of a project."""
        message = json.dumps(event_data)
        dead_queues = []
        for q in self._queues[project_id]:
            try:
                q.put_nowait(message)
            except asyncio.QueueFull:
                dead_queues.append(q)
        # Clean up any full/dead queues
        for dq in dead_queues:
            self._queues[project_id].remove(dq)

    async def subscribe(self, project_id: str) -> AsyncGenerator[str, None]:
        """Yields SSE-formatted strings as events arrive for this project."""
        q: asyncio.Queue = asyncio.Queue(maxsize=200)
        self._queues[project_id].append(q)
        try:
            while True:
                data = await q.get()
                yield f"data: {data}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            if q in self._queues[project_id]:
                self._queues[project_id].remove(q)

    def disconnect_all(self, project_id: str):
        """Remove all subscriber queues for a project."""
        self._queues.pop(project_id, None)


# Singleton
sse_manager = SSEManager()

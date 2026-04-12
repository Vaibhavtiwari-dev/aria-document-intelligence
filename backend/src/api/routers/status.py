import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter(prefix="/status", tags=["Status"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, workspace_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[workspace_id] = websocket

    def disconnect(self, workspace_id: str):
        if workspace_id in self.active_connections:
            del self.active_connections[workspace_id]

    async def send_status(self, workspace_id: str, message: dict):
        if workspace_id in self.active_connections:
            await self.active_connections[workspace_id].send_json(message)

manager = ConnectionManager()

@router.websocket("/{workspace_id}")
async def websocket_endpoint(websocket: WebSocket, workspace_id: str):
    await manager.connect(workspace_id, websocket)
    try:
        while True:
            # Keep connection alive, listen for client messages if necessary
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(workspace_id)

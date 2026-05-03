import asyncio
import json
import logging
import redis.asyncio as redis
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException, Depends
from typing import Dict
from jose import jwt, JWTError
from src.core.config import settings
from src.core.database import engine
from src.models.workspace import Workspace
from sqlmodel import Session

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/status", tags=["Status"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.redis = redis.from_url(settings.REDIS_URL)

    async def connect(self, workspace_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[workspace_id] = websocket

    def disconnect(self, workspace_id: str):
        if workspace_id in self.active_connections:
            del self.active_connections[workspace_id]

    async def send_status(self, workspace_id: str, message: dict):
        if workspace_id in self.active_connections:
            try:
                await self.active_connections[workspace_id].send_json(message)
            except Exception as e:
                logger.error(f"Error sending WebSocket message: {e}")

    async def redis_listener(self):
        """
        Listen to Redis Pub/Sub and forward messages to the correct WebSockets.
        """
        pubsub = self.redis.pubsub()
        await pubsub.psubscribe("workspace:*")
        
        logger.info("Started Redis Pub/Sub listener for workspace status updates")
        
        try:
            async for message in pubsub.listen():
                if message["type"] == "pmessage":
                    try:
                        channel = message["channel"].decode()
                        workspace_id = channel.split(":")[1]
                        data = json.loads(message["data"].decode())
                        await self.send_status(workspace_id, data)
                    except Exception as e:
                        logger.error(f"Error processing Redis message: {e}")
        except Exception as e:
            logger.error(f"Redis listener error: {e}")
        finally:
            await pubsub.close()

manager = ConnectionManager()

def verify_ws_token(token: str) -> str:
    if not settings.CLERK_PEM_PUBLIC_KEY:
        logger.error("CLERK_PEM_PUBLIC_KEY is not configured")
        return None
    try:
        payload = jwt.decode(token, settings.CLERK_PEM_PUBLIC_KEY, algorithms=["RS256"], options={"verify_aud": False})
        return payload.get("sub")
    except JWTError as e:
        logger.error(f"WebSocket token verification failed: {e}")
        return None

@router.websocket("/{workspace_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    workspace_id: str,
    token: str = Query(...)
):
    user_id = verify_ws_token(token)
    if not user_id:
        await websocket.close(code=1008) # Policy Violation
        return

    # Verify workspace ownership
    with Session(engine) as db:
        ws = db.get(Workspace, workspace_id)
        if not ws or ws.owner_id != user_id:
            await websocket.close(code=1008)
            return

    await manager.connect(workspace_id, websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(workspace_id)

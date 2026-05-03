import asyncio
import json
import logging
import redis.asyncio as redis
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
from src.core.config import settings

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

@router.websocket("/{workspace_id}")
async def websocket_endpoint(websocket: WebSocket, workspace_id: str):
    await manager.connect(workspace_id, websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(workspace_id)

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session

from src.core.database import get_session
from src.models.workspace import Workspace
from src.services.qa import ask_question
from src.api.middleware.auth import get_current_user

router = APIRouter(prefix="/workspaces/{workspace_id}/qa", tags=["QA"])

class QueryRequest(BaseModel):
    query: str

@router.post("/")
async def stream_qa(
    workspace_id: str, 
    request: QueryRequest,
    db: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    ws = db.get(Workspace, workspace_id)
    if not ws or ws.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    return StreamingResponse(ask_question(workspace_id, request.query), media_type="text/event-stream")

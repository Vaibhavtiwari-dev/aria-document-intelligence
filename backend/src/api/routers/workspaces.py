from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from src.core.database import get_session
from src.models.workspace import Workspace
from src.api.middleware.auth import get_current_user

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])

@router.post("/", response_model=Workspace)
def create_workspace(
    name: str, 
    db: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    ws = Workspace(name=name, owner_id=user_id)
    db.add(ws)
    db.commit()
    db.refresh(ws)
    return ws

@router.get("/", response_model=List[Workspace])
def get_workspaces(
    db: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    workspaces = db.exec(select(Workspace).where(Workspace.owner_id == user_id)).all()
    return workspaces

@router.get("/{workspace_id}", response_model=Workspace)
def get_workspace(
    workspace_id: str, 
    db: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    ws = db.get(Workspace, workspace_id)
    if not ws or ws.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return ws

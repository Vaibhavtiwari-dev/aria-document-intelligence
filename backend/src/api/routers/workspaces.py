from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from src.core.database import get_session
from src.models.workspace import Workspace

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])

@router.post("/", response_model=Workspace)
def create_workspace(name: str, db: Session = Depends(get_session)):
    ws = Workspace(name=name)
    db.add(ws)
    db.commit()
    db.refresh(ws)
    return ws

@router.get("/", response_model=List[Workspace])
def get_workspaces(db: Session = Depends(get_session)):
    workspaces = db.exec(select(Workspace)).all()
    return workspaces

@router.get("/{workspace_id}", response_model=Workspace)
def get_workspace(workspace_id: str, db: Session = Depends(get_session)):
    ws = db.get(Workspace, workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return ws

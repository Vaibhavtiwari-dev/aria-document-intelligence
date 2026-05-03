import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
from typing import List

from src.core.database import get_session
from src.models.document import Document
from src.models.workspace import Workspace
from src.services.storage import upload_file
from src.services.tasks import ingest_document_task
from src.api.middleware.auth import get_current_user

router = APIRouter(prefix="/workspaces/{workspace_id}/documents", tags=["Documents"])

@router.post("/")
async def upload_document(
    workspace_id: str, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    # Verify workspace ownership
    ws = db.get(Workspace, workspace_id)
    if not ws or ws.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # Sanitize filename to prevent path traversal
    safe_filename = os.path.basename(file.filename)
    
    # 1. Upload to storage (Streaming implementation in storage service)
    # We pass the file object directly to allow streaming if possible
    # but for simplicity in this MVP storage service, we'll use file.file
    s3_key = await upload_file(file.file, safe_filename, workspace_id)

    # 2. Create DB record
    doc = Document(
        workspace_id=workspace_id,
        filename=safe_filename,
        s3_key=s3_key,
        status="pending"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # 3. Trigger async ingestion pipeline via Celery
    ingest_document_task.delay(str(doc.id), workspace_id)

    return {"message": "Document uploaded and ingestion started", "document": doc}

@router.get("/", response_model=List[Document])
def list_documents(
    workspace_id: str, 
    db: Session = Depends(get_session),
    user_id: str = Depends(get_current_user)
):
    # Verify workspace ownership
    ws = db.get(Workspace, workspace_id)
    if not ws or ws.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Workspace not found")

    docs = db.exec(select(Document).where(Document.workspace_id == workspace_id)).all()
    return docs

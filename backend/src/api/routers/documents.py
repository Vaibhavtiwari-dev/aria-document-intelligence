import asyncio
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlmodel import Session, select
from typing import List

from src.core.database import get_session
from src.models.document import Document
from src.models.workspace import Workspace
from src.services.storage import upload_file
from src.services.tasks import ingest_document_task

router = APIRouter(prefix="/workspaces/{workspace_id}/documents", tags=["Documents"])

@router.post("/")
async def upload_document(
    workspace_id: str, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_session)
):
    # Verify workspace
    ws = db.get(Workspace, workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")

    content = await file.read()
    
    # 1. Upload to storage
    s3_key = await upload_file(content, file.filename, workspace_id)

    # 2. Create DB record
    doc = Document(
        workspace_id=workspace_id,
        filename=file.filename,
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
def list_documents(workspace_id: str, db: Session = Depends(get_session)):
    docs = db.exec(select(Document).where(Document.workspace_id == workspace_id)).all()
    return docs

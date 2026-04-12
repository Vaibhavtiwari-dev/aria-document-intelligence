import uuid
from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional

def utc_now():
    return datetime.now(timezone.utc)

class Document(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    workspace_id: str = Field(foreign_key="workspace.id", index=True)
    filename: str
    s3_key: str  # For R2/S3 mapping
    status: str = Field(default="pending") # pending, processing, completed, failed
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

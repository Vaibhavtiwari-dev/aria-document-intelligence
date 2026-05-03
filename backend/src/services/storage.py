import os
import shutil
import boto3
from botocore.exceptions import NoCredentialsError
from dotenv import load_dotenv

load_dotenv()

# Cloudflare R2 / AWS S3 Config
# R2 uses S3 compatible API
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID", "local-mock")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "aria-documents")

# Use local storage fallback if mock
FILES_DIR = os.path.join(os.getcwd(), "local_storage")
if R2_ACCOUNT_ID == "local-mock":
    os.makedirs(FILES_DIR, exist_ok=True)

def get_s3_client():
    if R2_ACCOUNT_ID == "local-mock":
        return None
    endpoint_url = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
    return boto3.client(
        "s3",
        endpoint_url=endpoint_url,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )

async def upload_file(file_obj, filename: str, workspace_id: str) -> str:
    """
    Uploads a file using streaming to minimize memory usage.
    file_obj should be a file-like object (e.g., from UploadFile.file)
    """
    # Sanitize inputs for security
    safe_workspace_id = os.path.basename(workspace_id)
    safe_filename = os.path.basename(filename)
    s3_key = f"{safe_workspace_id}/{safe_filename}"
    
    s3 = get_s3_client()
    if s3:
        # boto3's upload_fileobj handles streaming
        s3.upload_fileobj(file_obj, BUCKET_NAME, s3_key)
    else:
        # Mock behavior with streaming to disk
        workspace_dir = os.path.join(FILES_DIR, safe_workspace_id)
        os.makedirs(workspace_dir, exist_ok=True)
        file_path = os.path.join(workspace_dir, safe_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file_obj, buffer)
            
    return s3_key

def get_file_path(s3_key: str) -> str:
    """Returns local file path if mocked, or downloads and returns temp path"""
    # Sanitize s3_key parts to prevent path traversal even in keys
    parts = s3_key.split("/")
    if len(parts) != 2:
        return None
        
    safe_workspace_id = os.path.basename(parts[0])
    safe_filename = os.path.basename(parts[1])

    if R2_ACCOUNT_ID == "local-mock":
        return os.path.join(FILES_DIR, safe_workspace_id, safe_filename)
    else:
        # For actual S3, we would download to temp file here
        # Implementation left out for brevity, focusing on local mock MVP
        pass

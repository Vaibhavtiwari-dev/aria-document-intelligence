import os
import boto3
from botocore.exceptions import NoCredentialsError
from dotenv import load_dotenv

load_dotenv()

# Cloudflare R2 / AWS S3 Config
# R2 uses S3 compatible API
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID", "local-mock")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "mock-key")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "mock-secret")
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

async def upload_file(file_content: bytes, filename: str, workspace_id: str) -> str:
    s3_key = f"{workspace_id}/{filename}"
    s3 = get_s3_client()
    if s3:
        s3.put_object(Bucket=BUCKET_NAME, Key=s3_key, Body=file_content)
    else:
        # Mock behavior
        workspace_dir = os.path.join(FILES_DIR, workspace_id)
        os.makedirs(workspace_dir, exist_ok=True)
        with open(os.path.join(workspace_dir, filename), "wb") as f:
            f.write(file_content)
    return s3_key

def get_file_path(s3_key: str) -> str:
    """Returns local file path if mocked, or downloads and returns temp path"""
    if R2_ACCOUNT_ID == "local-mock":
        workspace_id, filename = s3_key.split("/", 1)
        return os.path.join(FILES_DIR, workspace_id, filename)
    else:
        # For actual S3, we would download to temp file here
        # Implementation left out for brevity, focusing on local mock MVP
        pass

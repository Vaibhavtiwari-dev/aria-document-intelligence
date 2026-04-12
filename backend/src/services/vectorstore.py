import os
import chromadb
from chromadb.config import Settings
from dotenv import load_dotenv

load_dotenv()

# We use persistent client for the MVP running locally
CHROMA_DATA_PATH = os.path.join(os.getcwd(), "chroma_data")

chroma_client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)

def get_collection(workspace_id: str):
    """
    Get or create a ChromaDB collection for the specific workspace.
    This enforces vector data isolation (namespacing).
    """
    collection_name = f"workspace_{workspace_id.replace('-', '_')}"
    return chroma_client.get_or_create_collection(name=collection_name)

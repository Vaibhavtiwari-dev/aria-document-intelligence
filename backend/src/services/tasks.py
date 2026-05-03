import os
import logging
import json
import redis
import fitz  # PyMuPDF
from sqlmodel import Session
from langchain_core.documents import Document as LCDocument
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from src.core.celery_app import celery_app
from src.core.config import settings
from src.core.database import engine
from src.models.document import Document
from src.services.storage import get_file_path
from src.services.vectorstore import get_collection

logger = logging.getLogger(__name__)

# Default Gemini embedding model via Langchain Google GenAI
embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Initialize Redis client for status updates
redis_client = redis.from_url(settings.REDIS_URL)

def send_status_update(workspace_id: str, message: dict):
    """
    Publish a status update to Redis Pub/Sub for the FastAPI bridge.
    """
    channel = f"workspace:{workspace_id}"
    try:
        redis_client.publish(channel, json.dumps(message))
    except Exception as e:
        logger.error(f"Failed to publish to Redis: {e}")

@celery_app.task(bind=True, name="src.services.tasks.ingest_document_task")
def ingest_document_task(self, doc_id: str, workspace_id: str):
    """
    Ingest a document: parse -> chunk -> embed -> store
    This is a Celery task running in a worker process.
    """
    with Session(engine) as db:
        doc = db.get(Document, doc_id)
        if not doc:
            logger.warning("Document %s not found — skipping ingestion", doc_id)
            return

        try:
            # Update status
            doc.status = "processing"
            db.add(doc)
            db.commit()
            
            send_status_update(workspace_id, {
                "document_id": str(doc.id),
                "filename": doc.filename,
                "status": "processing",
                "progress": 0,
                "message": "Starting background file processing"
            })

            # 1. Get file
            file_path = get_file_path(doc.s3_key)
            if not file_path or not os.path.exists(file_path):
                raise Exception("File not found.")

            # 2. Extract Text via PyMuPDF
            text_content = ""
            with fitz.open(file_path) as pdf_doc:
                for page_num in range(len(pdf_doc)):
                    page = pdf_doc.load_page(page_num)
                    text_content += page.get_text()
                    
            send_status_update(workspace_id, {
                "document_id": str(doc.id),
                "filename": doc.filename,
                "status": "processing",
                "progress": 25,
                "message": "Text extracted, starting chunking"
            })

            # 3. Chunking
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=settings.CHUNK_SIZE,
                chunk_overlap=settings.CHUNK_OVERLAP,
                length_function=len,
            )
            texts = text_splitter.split_text(text_content)
            
            # Format as Langchain Docs with metadata
            lc_docs = [
                LCDocument(page_content=t, metadata={"source": doc.filename, "document_id": str(doc.id)})
                for t in texts
            ]

            send_status_update(workspace_id, {
                "document_id": str(doc.id),
                "filename": doc.filename,
                "status": "processing",
                "progress": 50,
                "message": "Chunking complete, starting embedding"
            })

            # 4. Embed and Store
            collection = get_collection(doc.workspace_id)
            
            # Batch upload to ChromaDB
            ids = [f"{str(doc.id)}-chunk-{i}" for i in range(len(lc_docs))]
            documents = [d.page_content for d in lc_docs]
            metadatas = [d.metadata for d in lc_docs]
            
            # Embed using the Google model (synchronous call in worker)
            embedded_vectors = embeddings_model.embed_documents(documents)

            send_status_update(workspace_id, {
                "document_id": str(doc.id),
                "filename": doc.filename,
                "status": "processing",
                "progress": 75,
                "message": "Storing vectors in ChromaDB"
            })

            # Collection add
            collection.add(
                ids=ids,
                embeddings=embedded_vectors,
                documents=documents,
                metadatas=metadatas
            )

            # 5. Mark as complete
            doc.status = "completed"
            db.add(doc)
            db.commit()

            send_status_update(workspace_id, {
                "document_id": str(doc.id),
                "filename": doc.filename,
                "status": "completed",
                "progress": 100,
                "message": "Processing complete"
            })

        except Exception as e:
            doc.status = "failed"
            doc.error_message = str(e)
            db.add(doc)
            db.commit()
            logger.error("Error processing document %s: %s", doc.id, e, exc_info=True)
            send_status_update(workspace_id, {
                "document_id": str(doc.id),
                "filename": doc.filename,
                "status": "failed",
                "progress": 0,
                "message": f"Error: {str(e)}"
            })

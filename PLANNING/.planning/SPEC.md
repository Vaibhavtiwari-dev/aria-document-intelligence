# Specification: Aria

## Architecture Overview

### Frontend
- Next.js 15 + React 19
- Tailwind CSS + shadcn/ui components
- react-pdf, Plotly.js

### API Layer
- FastAPI (Python 3.11)
- WebSocket streaming for ingest and query chunking
- Clerk JWT auth middleware

### AI / ML Core
- LangChain RAG pipeline
- Gemini 2.0 Flash LLM
- Google text-embedding-004

### Document Processing & Storage
- PyMuPDF, pandas, python-docx, python-pptx
- ChromaDB (vectors), PostgreSQL (metadata), Cloudflare R2 (raw files)
- Async processing via Celery + Redis

## Core Workflows

### Ingestion Pipeline
1. Multi-format upload via FastAPI to Cloudflare R2.
2. Async Celery task queued.
3. Parsing (PyMuPDF/pandas/etc.).
4. RecursiveCharacterTextSplitter chunking (512 tokens, 64 overlap).
5. Embedding via Google API (batch size 100).
6. Vector DB Upsert to ChromaDB with metadata. WebSockets emit progress.

### Query Pipeline
1. Natural language query processing via Gemini 2.0 Flash.
2. Embedding to vector and ChromaDB similarity search (top-k=5, threshold=0.75).
3. Retrieval with metadata mapping and namespace filtering.
4. Streaming response through WebSocket, JSON tags parsed as UI citation badges `[CITE:doc_id:chunk_id]`.

### Data Analysis Mode (Pandas)
Limited execution Sandbox (`RestrictedPython`) to convert user queries to pandas dataframe outputs. Returns computed answers, chart data, and transparent pandas code.

<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/status-In%20Development-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/python-3.11-blue?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/LangChain-RAG-1C3C3C?style=for-the-badge" />

<br /><br />

# Aria — AI Document Intelligence Platform

### Ask questions across any document. Get cited answers.

*Upload your PDFs, reports, and spreadsheets. Ask anything in plain English. Aria retrieves the exact answer with source citations — powered by a production-grade RAG pipeline.*

<br />

[**Live Demo**](#) · [**API Docs**](#) · [**PRD**](#) · [**Report a Bug**](../../issues) · [**Request Feature**](../../issues)

<br />

---

</div>

## What is Aria?

Knowledge workers spend **2.5+ hours a day** hunting for information buried across documents. Existing tools force you to read everything manually, ctrl+F for keywords, and guess at cross-document synthesis.

**Aria turns any document collection into a conversational knowledge base.**

Upload a folder of PDFs, CSVs, or Word docs. Ask:

> *"What did the Q3 report say about churn compared to what this research paper recommends?"*

Aria retrieves the answer with exact source citations — `[Report A, p.12]` — using a RAG pipeline built from the ground up with LangChain, ChromaDB, and Gemini 2.0 Flash.

---

## Demo

> *(Recording coming in Week 3 — post-deployment)*

---

## Features

| Feature | Status | Description |
|--------|--------|-------------|
| Multi-format upload | ✅ v1 | PDF, CSV, XLSX, DOCX, TXT, PPTX — up to 50MB |
| RAG Q&A with citations | ✅ v1 | Semantic search + streamed answers with `[Source, Page]` refs |
| Document collections | ✅ v1 | Isolated workspaces, each with their own vector namespace |
| Streaming responses | ✅ v1 | First token in < 800ms via WebSocket |
| Smart document summary | ✅ v1 | Map-reduce summarization for long documents |
| CSV / Excel analysis | ✅ v1 | Natural language → pandas queries + Plotly charts |
| Export (MD / PDF) | ✅ v1 | Full session export with citations preserved |
| Source viewer | ✅ v1 | Click any citation → see the highlighted chunk in-document |
| Real-time collaboration | 🔜 v2 | Multi-user workspaces |
| OCR for scanned PDFs | 🔜 v2 | Tesseract integration |
| Fine-tuned embeddings | 🔜 v3 | Custom embedding model training |

---

## Tech Stack

```
Frontend        Next.js 15 · React 19 · Tailwind CSS · shadcn/ui · Plotly.js
API Layer       FastAPI (Python 3.11) · WebSocket · Clerk JWT Auth
AI / ML         LangChain · Gemini 2.0 Flash · Google text-embedding-004
Doc Processing  PyMuPDF · pandas · python-docx · python-pptx
Vector Store    ChromaDB (namespaced by user + collection)
Task Queue      Celery + Redis (async document processing)
Database        PostgreSQL + SQLAlchemy (metadata, chat history)
File Storage    Cloudflare R2 (S3-compatible, private buckets + signed URLs)
Auth            Clerk
Deployment      Railway (backend) · Vercel (frontend)
```

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│  Next.js 15 Frontend                             │
│  Upload UI · Chat Interface · Source Viewer      │
└────────────────────┬─────────────────────────────┘
                     │ HTTPS + WebSocket
┌────────────────────▼─────────────────────────────┐
│  FastAPI — Python 3.11                           │
│  REST endpoints · WebSocket streaming            │
│  Clerk JWT middleware · Rate limiting (Redis)    │
└──────┬─────────────┬────────────────┬────────────┘
       │             │                │
┌──────▼──────┐ ┌────▼────┐  ┌───────▼──────────┐
│  Celery     │ │  RAG    │  │  PostgreSQL       │
│  + Redis    │ │  Core   │  │  Collections      │
│  Async jobs │ │         │  │  Doc metadata     │
└──────┬──────┘ │LangChain│  │  Chat history     │
       │        │ChromaDB │  └───────────────────┘
┌──────▼──────┐ │Gemini   │
│  Cloudflare │ └────┬────┘
│  R2         │      │
│  Raw files  │ ┌────▼────────────────────────────┐
└─────────────┘ │  ChromaDB Vector Store           │
                │  Namespaced: user_id → coll_id  │
                └─────────────────────────────────┘
```

---

## RAG Pipeline

Aria's retrieval pipeline is the engineering core of the product.

**Ingestion (async via Celery)**
```
File Upload
  → Cloudflare R2 storage
  → Celery task queued
  → PyMuPDF / pandas parse
  → RecursiveCharacterTextSplitter (512 tokens, 64 overlap)
  → Google embedding API (batch = 100)
  → ChromaDB upsert with metadata {doc_id, page, char_start, char_end, filename}
```

**Query (real-time, streamed)**
```
User query
  → Embed query (text-embedding-004)
  → ChromaDB cosine similarity search (top-k = 5, threshold = 0.75)
  → Filter by collection namespace
  → Retrieve chunks + metadata
  → Construct prompt with citation anchors
  → Gemini 2.0 Flash (streaming)
  → Parse [CITE:doc_id:chunk_id] tags
  → Stream to frontend via WebSocket
```

**Key design decisions:**
- **512-token chunks, 64-token overlap** — overlap prevents context boundary sentences from being lost
- **Separator hierarchy:** paragraph → sentence → word (never mid-word splits)
- **Citation format:** `[CITE:doc_id:chunk_id]` — parsed frontend-side into interactive badges
- **Confidence scoring:** cosine similarity score exposed as High / Medium / Low per citation

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- Redis
- PostgreSQL
- A [Clerk](https://clerk.com) account
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini + embeddings)
- A [Cloudflare R2](https://cloudflare.com/r2) bucket

### 1. Clone the repo

```bash
git clone https://github.com/vaibhav09012007-design/ARIA-.git
cd aria
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Fill in your keys (see Environment Variables below)

# Run database migrations
alembic upgrade head

# Start the API server
uvicorn main:app --reload --port 8000

# In a separate terminal — start Celery worker
celery -A tasks worker --loglevel=info
```

### 3. Frontend setup

```bash
cd frontend
npm install

cp .env.local.example .env.local
# Fill in your Clerk + API keys

npm run dev
```

App will be running at `http://localhost:3000`

---

## Environment Variables

### Backend (`.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aria

# Redis
REDIS_URL=redis://localhost:6379

# Google AI
GOOGLE_API_KEY=your_google_api_key

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=aria-uploads

# Clerk
CLERK_SECRET_KEY=sk_live_...

# ChromaDB
CHROMA_PERSIST_DIR=./chroma_data

# App
SECRET_KEY=your_random_secret_key
ENVIRONMENT=development
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## Project Structure

```
aria/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── api/
│   │   ├── routes/
│   │   │   ├── upload.py        # Document upload endpoints
│   │   │   ├── query.py         # RAG Q&A endpoints
│   │   │   ├── collections.py   # Workspace management
│   │   │   └── export.py        # Export endpoints
│   │   └── middleware/
│   │       ├── auth.py          # Clerk JWT validation
│   │       └── rate_limit.py    # Redis sliding window
│   ├── rag/
│   │   ├── pipeline.py          # Core RAG orchestration
│   │   ├── chunker.py           # RecursiveCharacterTextSplitter config
│   │   ├── embedder.py          # Google embedding API wrapper
│   │   ├── retriever.py         # ChromaDB retrieval + namespace filtering
│   │   └── citation_parser.py   # [CITE:] tag parsing
│   ├── processing/
│   │   ├── pdf.py               # PyMuPDF ingestion
│   │   ├── spreadsheet.py       # pandas CSV/Excel processing
│   │   ├── docx.py              # python-docx processing
│   │   └── sandbox.py           # RestrictedPython execution
│   ├── tasks/
│   │   └── celery_tasks.py      # Async document processing jobs
│   ├── models/
│   │   └── schema.py            # SQLAlchemy models
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Landing / hero
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Collections overview
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Collection chat interface
│   │   └── layout.tsx
│   ├── components/
│   │   ├── UploadZone.tsx       # Drag-and-drop with progress
│   │   ├── ChatInterface.tsx    # Streaming chat UI
│   │   ├── CitationBadge.tsx    # Inline citation renderer
│   │   ├── SourceViewer.tsx     # Side panel PDF/table viewer
│   │   └── CollectionCard.tsx
│   └── package.json
│
└── README.md
```

---

## Roadmap

```
Week 1  ████████████████████  M1 — Core RAG Pipeline
                               FastAPI · PDF upload · ChromaDB · Q&A · WebSocket

Week 2  ████████████████████  M2 — Frontend + Auth
                               Next.js · Upload UI · Chat · Collections · Clerk

Week 3  ░░░░░░░░░░░░░░░░░░░░  M3 — Data Analysis + Deploy
                               CSV mode · Plotly · Summary · Export · Railway + Vercel

Month 2 ░░░░░░░░░░░░░░░░░░░░  M4 — V2 Features
                               OCR · Cross-collection · Team workspaces · Reranking
```

---

## Non-Functional Specs

| Requirement | Target | Implementation |
|------------|--------|----------------|
| Answer latency (p95) | < 3 seconds | Async embedding + pre-indexed vectors + streaming |
| 10-page PDF processing | < 15 seconds | Celery async — never blocks the UI |
| 100-page PDF processing | < 90 seconds | Celery async — never blocks the UI |
| Security | Zero cross-user leakage | ChromaDB namespaced by `user_id`. Signed R2 URLs. JWT on every request |
| Rate limiting | 10 queries/min, 5 uploads/hr | Redis sliding window counters |
| Sandbox safety | Restricted execution | RestrictedPython — no FS, no network, 10s timeout |
| File safety | Multi-layer validation | Magic byte validation + 50MB gateway enforcement |

---

## Why I Built This

RAG is the dominant pattern in production AI right now. Every company shipping LLM-powered products is implementing retrieval-augmented generation — but most developers only know how to call a model API, not how to build the retrieval layer underneath it.

This project is my attempt to build it properly:

- **From-scratch chunking strategy** — not just default settings
- **Namespaced vector storage** — security-aware multi-tenant design
- **Async ingestion pipeline** — production-grade, not a prototype
- **Sandboxed code execution** — for the CSV analysis mode
- **Streaming end-to-end** — WebSocket from LLM to browser

It's the kind of system I'd build at work. So I built it to show that.

---

## Contributing

This is a portfolio project but PRs and issues are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Built by **Vaibhav Tiwari** · April 2026

*If this project helped you understand RAG pipelines, leave a star. It helps.*

⭐

</div>

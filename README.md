# Project Aria

Aria is an AI Document Intelligence Platform built with Next.js, FastAPI, SQLModel, and ChromaDB.

## Architecture

- **Frontend**: Next.js 15, Tailwind, `shadcn/ui`, Clerk (v7) Authentication.
- **Backend**: FastAPI, SQLModel (ORM), ChromaDB for Vector RAG mapping, WebSockets for UI telemetry.
- **RAG Services**: Splitting at 512 chunks (64 overlap) leveraging PyMuPDF `fitz`.

## Getting Started

1. **Frontend Setup**:
   - `cd frontend`
   - `npm install`
   - Create an `.env.local` with CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.
   - `npm run dev`

2. **Backend Setup**:
   - `cd backend`
   - Activate the virtual surroundings `venv\Scripts\Activate.ps1`
   - `pip install -r requirements.txt`
   - `fastapi dev src/main.py`

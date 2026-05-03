# Roadmap: Aria

**Project Goal:** Complete MVP for Aria AI Document Intelligence Platform in 3 weeks.

## Phase 1: Core RAG Pipeline
**Focus:** Backend API, ML Pipeline, Storage Integration
- [x] Set up FastAPI project and PostgreSQL schema
- [x] Connect Cloudflare R2 for raw file upload (Local fallback active)
- [x] Initialize ChromaDB vector storage with namespace boundaries
- [x] Implement PyMuPDF document chunking and embedding pipeline
- [x] Build Q&A endpoint with LangChain and Gemini streaming
- [x] Expose WebSocket for ingestion parsing status updates

## Phase 2: Frontend & Core UI
**Focus:** Application Shell, Client Auth, Document Uploads
- [x] Spin up Next.js 15, Tailwind, shadcn/ui
- [x] Integrate Clerk authentication and FastAPI middleware
- [x] Build document collection management (Workspaces UI)
- [x] Build drag/drop upload zone with async WebSocket progress
- [x] Build chat interface and format streaming inline citation chunks

## Phase 3: Async Infrastructure (Celery & Redis)
**Focus:** Background Tasks, Pub/Sub Bridge, Robustness
**Plans:** 3 plans
- [x] 03-01-PLAN.md — Async Infrastructure Foundation
- [x] 03-02-PLAN.md — Task Migration & WebSocket Bridge
- [x] 03-03-PLAN.md — Integration & Robustness

## Phase 4: Data Analysis & Polish
**Focus:** Pandas Querying, Summaries, Exporting
- [ ] Implement CSV/Excel RestrictedPython Pandas querying mode
- [ ] Connect Plotly for numerical query auto-chart generation
- [ ] Implement map-reduce one-click smart document summaries
- [ ] Add session export to Markdown/PDF
- [ ] Final end-to-end deployment to Railway (Backend) + Vercel (Frontend)

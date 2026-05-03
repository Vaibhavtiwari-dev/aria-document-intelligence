# Aria

## What This Is

Aria is an AI Document Intelligence Platform that serves as the interface between humans and their documents. It allows users to upload any file (PDF, CSV, Excel, Word, PPT), ask natural language questions, and get verified, cited answers in under 3 seconds.

## Core Value

Anyone should be able to upload any file, ask any question, and get a verified, cited answer grounded in their documents in under 3 seconds.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Ask natural language questions with full source citations (RAG pipeline)
- [ ] Multi-format async document ingestion (PDF, CSV, XLSX, DOCX, TXT, PPTX)
- [ ] Create and isolate multiple document collections (Workspaces)
- [ ] Smart document summaries (map-reduce summarization)
- [ ] CSV/Excel data analysis mode using pandas
- [ ] Export Q&A sessions and answers to PDF/Markdown

### Out of Scope

- Real-time collaboration — scoped out for MVP focus
- Custom embedding fine-tuning — requires training data pipeline
- Mobile app — web-first; responsive is sufficient for v1
- OCR for scanned documents — requires Tesseract integration, defer to V2

## Context

Aria is being built as a python-heavy, AI/ML-focused product (FastAPI, LangChain, ChromaDB) to position alongside Mind-Sync (TypeScript-heavy, full-stack) in a professional portfolio. This proves Python backend engineering, AI/ML pipeline design, data engineering, and system architecture skills, complementing existing full-stack capabilities.

## Constraints

- **Tech Stack**: Next.js 15, FastAPI, LangChain, ChromaDB, PostgreSQL, Gemini 2.0 Flash — carefully selected for fast development, generous free tiers, and solid AI/ML fundamentals.
- **Latency**: < 3 seconds from query to first streamed token — critical for perception of speed.
- **File Limits**: 50 MB per upload for v1.
- **Security**: Zero cross-user leakage with vector namespacing. Strict File and Sandbox safety measures needed.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| FastAPI | Async-first, automatic OpenAPI docs, fastest Python framework | ✅ Implemented |
| LangChain | Industry standard, strong retriever abstractions | ✅ Implemented |
| ChromaDB | Local-first, no infra setup, embeds in Python | ✅ Implemented |   
| Cloudflare R2 | S3-compatible, generous free tier, cheap egress | ⚠️ Using Local Storage (Boto3 ready) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? — None.
2. Requirements validated? — Phase 1 & 2 requirements validated via functional testing.
3. New requirements emerged? — Need for local storage fallback before R2.
4. Decisions to log? — Moved from Celery/Redis to asyncio.to_thread temporarily.
5. "What This Is" still accurate? — Yes.

---
*Last updated: 2026-05-03 after Phase 2 completion*

# Requirements: Aria

**Defined:** 2026-04-11
**Core Value:** Anyone should be able to upload any file, ask any question, and get a verified, cited answer grounded in their documents in under 3 seconds.

## v1 Requirements

### RAG & Querying
- [ ] **RAG-01**: User can ask natural language questions and stream answers in < 3s (p95)
- [ ] **RAG-02**: Every answer includes interactive citations linking to the exact source
- [ ] **RAG-03**: Cross-document synthesis across multiple uploaded files simultaneously
- [ ] **RAG-04**: Conversational context maintained for follow-up questions
- [ ] **RAG-05**: Graceful fallback when info is not in documents

### Document Processing
- [ ] **DOC-01**: Async upload pipeline for PDF, CSV, XLSX, DOCX, TXT, PPTX (up to 50MB)
- [ ] **DOC-02**: Real-time WebSocket extraction progress indicator
- [ ] **DOC-03**: 512-token chunking with 64-token overlap and duplicate sha256 detection
- [ ] **DOC-04**: Map-reduce summarization generated on upload
- [ ] **DOC-05**: CSV/Excel uploads automatically utilize pandas execution environment for query computation

### Infrastructure & Scaling
- [ ] **INFRA-01**: Celery + Redis for true background processing (transition from threads)
- [ ] **INFRA-02**: Redis Pub/Sub for cross-process WebSocket status bridge

### Workspaces & UI
- [ ] **WKS-01**: User signs in and manages account via Clerk
- [ ] **WKS-02**: User can create, rename, and delete collections
- [ ] **WKS-03**: Query and chat history isolated to specific collections  
- [ ] **WKS-04**: User can export chat sessions as Markdown or PDF
- [ ] **WKS-05**: User can share read-only links to Q&A sessions

## v2 Requirements

### Advanced Documents
- **ADV-01**: OCR for scanned documents using Tesseract
- **ADV-02**: Source viewer sidebar showing exact chunk highlighted inside PDF renderer

### Advanced Capabilities
- **ADV-03**: Cross-collection queries
- **ADV-04**: Team workspaces and sharing
- **ADV-05**: Reranking (Cohere) to improve retrieval precision

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time collaboration | Scoped out for MVP focus |
| Custom embedding fine-tuning | Requires training data pipeline |
| Mobile app | Web-first; responsive is sufficient for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| RAG-01 | Phase 1 | ✅ Completed |
| RAG-02 | Phase 1 | ✅ Completed |
| RAG-03 | Phase 1 | ✅ Completed |
| RAG-04 | Phase 1 | ✅ Completed |
| RAG-05 | Phase 1 | ✅ Completed |
| DOC-01 | Phase 1/3 | 🔄 Infrastructure Upgrade |
| DOC-02 | Phase 1/3 | 🔄 Infrastructure Upgrade |
| DOC-03 | Phase 1 | ✅ Completed |
| INFRA-01 | Phase 3 | Pending |
| INFRA-02 | Phase 3 | Pending |
| DOC-04 | Phase 4 | Pending |
| DOC-05 | Phase 4 | Pending |
| WKS-01 | Phase 2 | ✅ Completed |
| WKS-02 | Phase 2 | ✅ Completed |
| WKS-03 | Phase 2 | ✅ Completed |
| WKS-04 | Phase 4 | Pending |
| WKS-05 | Phase 4 | Pending |

---
*Requirements defined: 2026-04-11*
*Last updated: 2026-05-03*

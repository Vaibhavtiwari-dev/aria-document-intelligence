<div align="center">

# Aria

### Document intelligence with retrieval, citations, and streamed answers

[![Status](https://img.shields.io/badge/status-active%20development-F59E0B?style=flat-square)](#project-status)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](backend)
[![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=flat-square&logo=fastapi&logoColor=white)](backend)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)](frontend)
[![LangChain](https://img.shields.io/badge/LangChain-RAG-1C3C3C?style=flat-square)](backend/src/services)

</div>

## Overview

Aria is a full-stack document Q&A project for exploring files through natural-language questions. It combines a Next.js workspace UI with a FastAPI backend, asynchronous ingestion, vector retrieval, and streamed responses.

This repository documents the implementation as it exists today. Planned features and performance targets are kept separate from completed work.

## What Is Implemented

- Workspace creation and document organization
- Document upload and ingestion endpoints
- Background processing with Celery
- ChromaDB-backed vector storage
- Retrieval and question-answering services
- WebSocket-based streamed responses
- Clerk authentication middleware
- Next.js dashboard and workspace interfaces
- PostgreSQL models for workspaces and documents

## Architecture

```text
Next.js client
    |
    | HTTPS / WebSocket
    v
FastAPI API
    |-- PostgreSQL: workspace and document metadata
    |-- Cloud storage service: uploaded files
    |-- Celery: asynchronous ingestion tasks
    `-- RAG services
          |-- document parsing and chunking
          |-- embedding generation
          |-- ChromaDB retrieval
          `-- grounded answer generation
```

## Repository Structure

```text
ARIA-/
|-- backend/
|   |-- src/api/          API routes and authentication middleware
|   |-- src/core/         configuration, database, and Celery setup
|   |-- src/models/       workspace and document models
|   `-- src/services/     ingestion, retrieval, storage, and Q&A
|-- frontend/
|   |-- src/app/          landing page, dashboard, and workspace routes
|   |-- src/components/   reusable interface components
|   `-- src/hooks/        chat and workspace-status hooks
|-- PLANNING/             product requirements
`-- README.md
```

## Technology

| Layer | Tools |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| API | FastAPI, Python 3.11, WebSockets |
| Retrieval | LangChain, ChromaDB, Google Generative AI |
| Processing | PyMuPDF, Celery, Redis |
| Data | PostgreSQL, SQLModel |
| Storage | S3-compatible object storage through Boto3 |
| Authentication | Clerk JWT middleware |

## Run Locally

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL
- Redis
- Google AI API credentials
- Clerk credentials
- S3-compatible storage credentials

### Backend

```bash
git clone https://github.com/Vaibhavtiwari-dev/aria-document-intelligence.git
cd aria-document-intelligence/backend

python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
```

Configure the environment variables required by `backend/src/core/config.py`, then run:

```bash
uvicorn src.main:app --reload --port 8000
```

Start Redis and a Celery worker in a separate terminal for background ingestion.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project Status

Aria is under active development. The core workspace, ingestion, retrieval, and chat structure is present; deployment polish, broader file-format support, evaluation datasets, and production performance validation remain ongoing work.

## Engineering Priorities

- Add automated retrieval-quality evaluations
- Expand backend and frontend test coverage
- Add reranking and stronger citation validation
- Document deployment and environment configuration
- Publish a recorded end-to-end demonstration

## Author

Built by [Vaibhav Tiwari](https://github.com/Vaibhavtiwari-dev) as an applied AI and full-stack engineering project.

# Phase 3, Wave 2 Summary: Task Migration & WebSocket Bridge

## Work Completed
- **Task Migration**: Migrated document ingestion logic from `src/services/ingestion.py` to a dedicated Celery task in `src/services/tasks.py`.
- **Redis Pub/Sub**: Implemented a progress reporting mechanism using Redis Pub/Sub. Workers now publish progress to `workspace:{workspace_id}` channels.
- **WebSocket Bridge**: Refactored the FastAPI `ConnectionManager` in `src/api/routers/status.py` to include a `redis_listener` that subscribes to Redis channels and forwards messages to the corresponding WebSockets.
- **Async Redis**: Switched to `redis.asyncio` for the FastAPI side to ensure non-blocking concurrent operations.

## Verification Results
- Celery task `src.services.tasks.ingest_document_task` is discoverable and ready for execution.
- `ConnectionManager` is prepared to bridge Redis updates to the UI.

## Next Steps
Proceed to **Wave 3: Integration & Robustness** (03-03-PLAN.md).

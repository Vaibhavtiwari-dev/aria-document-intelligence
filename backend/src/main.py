from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.core.database import create_db_and_tables
from src.api.routers import workspaces, documents, qa, status

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup DB on startup
    create_db_and_tables()
    yield

app = FastAPI(title="Aria Backend API", lifespan=lifespan)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In MVP restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(workspaces.router)
app.include_router(documents.router)
app.include_router(qa.router)
app.include_router(status.router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Aria API is running"}

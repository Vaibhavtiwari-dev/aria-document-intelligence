import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Aria"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aria.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    CLERK_PEM_PUBLIC_KEY: str = os.getenv("CLERK_PEM_PUBLIC_KEY") # For JWT verification
    CLERK_AUDIENCE: str = os.getenv("CLERK_AUDIENCE") # For JWT audience verification
    
    # Ingestion Config
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 64
    MAX_FILE_SIZE: int = 50 * 1024 * 1024 # 50MB in bytes
    
    # AI Models
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-2.0-flash")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "models/embedding-001")

settings = Settings()

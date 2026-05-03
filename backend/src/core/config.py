import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Aria"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aria.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    
    # Ingestion Config
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 64

settings = Settings()

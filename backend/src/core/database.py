from sqlmodel import SQLModel, create_engine, Session
import os
from dotenv import load_dotenv

load_dotenv()

# We will use sqlite for MVP if PostgreSQL URI is missing, perfectly fine for testing.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aria.db")

# Add standard connection arguments for SQLite if used
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

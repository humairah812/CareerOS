"""
CareerOS Database Module
SQLAlchemy 2.0 configuration with PostgreSQL and local SQLite fallback.
"""
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

# For sqlite, check if connect_args needs check_same_thread
connect_args = {}
db_url = settings.SYNC_DATABASE_URL
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    echo=False,
    future=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for yielding database session with auto-cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all tables in the database."""
    # Import all models so that Base.metadata recognizes them
    import app.models  # noqa: F401
    Base.metadata.create_all(bind=engine)

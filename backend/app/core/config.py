"""
CareerOS Configuration Module
Handles environment variables, API keys, database URLs, and default constants.
"""
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerOS"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security & Auth
    SECRET_KEY: str = "careeros-production-super-secret-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    # Database: Supports Postgres with pgvector, falls back to local SQLite for instant zero-dependency execution
    DATABASE_URL: str = "sqlite+aiosqlite:///./careeros.db"
    SYNC_DATABASE_URL: str = "sqlite:///./careeros.db"

    # Redis: Supports live Redis or in-memory fallback
    REDIS_URL: Optional[str] = None

    # LLM Providers (supports OpenAI, Anthropic, Gemini, or Mock for zero-key local operation)
    LLM_PROVIDER: str = "mock"  # "openai" | "anthropic" | "gemini" | "mock"
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    LLM_MODEL: str = "gpt-4o-mini"
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 120

    # File Uploads
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".txt", ".md", ".json"]

    # GitHub Integration
    GITHUB_TOKEN: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()

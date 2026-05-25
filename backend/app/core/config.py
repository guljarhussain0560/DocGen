"""Application configuration using Pydantic Settings."""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "DocGen AI Agent"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Groq AI
    GROQ_API_KEY: str = "your-groq-api-key"
    AI_MODEL: str = "qwen/qwen3-32b"
    AI_MAX_TOKENS: int = 4096

    # Database (PostgreSQL with asyncpg driver)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:assam@localhost:5432/docgen"

    # GitHub Integration
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_WEBHOOK_SECRET: Optional[str] = None

    # Storage
    DOCS_OUTPUT_DIR: str = "./generated_docs"
    MAX_FILE_SIZE_MB: int = 10

    # Rate limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

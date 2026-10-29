try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        from pydantic import BaseModel as BaseSettings
from pydantic import Field
from typing import List, Optional
import os

class Settings(BaseSettings):
    APP_ENV: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    DATABASE_URL: str = Field(default="postgresql+asyncpg://suraksha:suraksha@localhost:5432/suraksha")
    JWT_SECRET: str = Field(default="dev-jwt-secret-suraksha-sih26265")
    JWT_ALGORITHM: str = Field(default="HS256")
    JWT_EXPIRES_IN: int = Field(default=3600)
    DOCUMENT_MASTER_KEY: str = Field(default="")
    DOCUMENT_STORAGE_DIR: str = Field(default="./storage/documents")
    GEMINI_API_KEY: Optional[str] = Field(default=None)
    GEMINI_OCR_MODEL: str = Field(default="gemini-2.5-flash")
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"])
    DEMO_MODE: bool = Field(default=True)
    SEED_DATASET: str = Field(default="demo_v1")
    AP_SCHEDULER_API_ENABLED: bool = Field(default=True)
    ARGON2ID_COST: int = Field(default=12)

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Derived values
DEBUG_MODE = settings.DEBUG if settings.APP_ENV == "development" else False
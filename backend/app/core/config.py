from typing import List
import json

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration"""
    
    # Database
    database_url: str = "postgresql://user:password@postgres:5432/ai_cv_db"
    
    # JWT
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # App
    debug: bool = True
    app_name: str = "AI CV App"
    version: str = "1.0.0"
    
    # AI
    openai_api_key: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value):
        """
        Accept JSON array or comma-separated env values for ALLOWED_ORIGINS.
        """
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            raw = value.strip()
            if not raw:
                return []
            if raw.startswith("["):
                try:
                    parsed = json.loads(raw)
                    if isinstance(parsed, list):
                        return parsed
                except Exception:
                    pass
            return [item.strip() for item in raw.split(",") if item.strip()]
        return value


settings = Settings()

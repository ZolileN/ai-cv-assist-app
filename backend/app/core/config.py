from pydantic_settings import BaseSettings
from typing import List


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
        "http://localhost:8000",
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


settings = Settings()

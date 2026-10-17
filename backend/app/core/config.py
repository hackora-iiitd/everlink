"""Configuration and environment variables."""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment."""

    # Neo4j
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_username: str = "neo4j"
    neo4j_password: str = "everlink_dev_2024"
    neo4j_database: str = "neo4j"

    # Backend
    backend_port: int = 8000
    backend_host: str = "0.0.0.0"
    debug: bool = False

    # Optional integrations
    gemini_api_key: Optional[str] = None
    linkedin_client_id: Optional[str] = None
    linkedin_client_secret: Optional[str] = None
    linkedin_redirect_uri: str = "http://localhost:5173/auth/linkedin/callback"

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"
        extra = "allow"
        case_sensitive = False


settings = Settings()

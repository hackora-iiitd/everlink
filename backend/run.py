#!/usr/bin/env python3
"""Run the FastAPI development server."""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

import uvicorn
from app.main import app
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=settings.backend_host,
        port=settings.backend_port,
        reload=settings.debug,
        log_level="info",
    )

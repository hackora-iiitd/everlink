"""Main FastAPI application."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import uuid

from .core.config import settings
from .graph.connection import Neo4jConnection
from .graph.schema import GraphSchema
from .models.response import HealthCheckResponse, ApiResponse
from . import __version__


# Initialize FastAPI app
app = FastAPI(
    title="Everlink",
    description="University ecosystem discovery platform",
    version=__version__,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize Neo4j connection on startup."""
    print("Starting Everlink backend...")
    Neo4jConnection.initialize()
    GraphSchema.create_constraints_and_indexes()


@app.on_event("shutdown")
async def shutdown_event():
    """Close Neo4j connection on shutdown."""
    print("Shutting down Everlink backend...")
    Neo4jConnection.close()


@app.get("/api/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint."""
    driver = Neo4jConnection.get_driver()
    neo4j_connected = False

    if driver:
        try:
            with driver.session(database=settings.neo4j_database) as session:
                session.run("RETURN 1")
            neo4j_connected = True
        except Exception as e:
            print(f"Neo4j health check failed: {e}")

    status = "healthy" if neo4j_connected else "degraded"

    return HealthCheckResponse(
        status=status,
        backend_version=__version__,
        neo4j_connected=neo4j_connected,
        timestamp=datetime.utcnow(),
    )


@app.get("/api/meta")
async def metadata():
    """Return application metadata."""
    return {
        "name": "Everlink",
        "version": __version__,
        "description": "University ecosystem discovery platform",
        "timestamp": datetime.utcnow(),
    }


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "error_code": "HTTP_ERROR",
            "timestamp": datetime.utcnow().isoformat(),
        },
    )

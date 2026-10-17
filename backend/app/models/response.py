"""API response models."""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Generic, TypeVar
from datetime import datetime


T = TypeVar("T")


class RecommendationResult(BaseModel):
    """Single recommendation result."""

    candidate_id: str
    candidate_name: str
    candidate_role: str
    headline: Optional[str] = None
    score: float = Field(..., ge=0, le=100)
    matching_mode: str
    score_breakdown: Dict[str, float] = {}
    matched_skills: List[str] = []
    matched_topics: List[str] = []
    relevant_achievements: List[str] = []
    relevant_projects: List[str] = []
    evidence_path: List[str] = []
    explanation: str
    filters_applied: List[str] = []

    class Config:
        json_schema_extra = {
            "example": {
                "candidate_id": "person_5",
                "candidate_name": "Dr. James Wilson",
                "candidate_role": "professor",
                "headline": "Medical AI Researcher",
                "score": 88.5,
                "matching_mode": "mentor",
                "explanation": "Strong match: 8+ years healthcare AI research, active projects, Python expertise.",
                "matched_skills": ["python", "tensorflow"],
                "matched_topics": ["healthcare-ai", "computer-vision"],
            }
        }


class ApiResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""

    success: bool
    data: Optional[T] = None
    error: Optional[str] = None
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {"results": []},
                "timestamp": "2026-10-17T18:45:23.998Z",
            }
        }


class HealthCheckResponse(BaseModel):
    """Health check response."""

    status: str  # healthy, degraded, unhealthy
    backend_version: str
    neo4j_connected: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)

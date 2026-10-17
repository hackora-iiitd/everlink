"""Search and recommendation models."""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class SearchIntent(BaseModel):
    """Structured search intent extracted from user query."""

    intent_type: str  # mentor, research, senior, teammate, opportunity, general
    query_text: str
    target_role: Optional[List[str]] = None
    skills: List[str] = []
    topics: List[str] = []
    companies_or_organizations: List[str] = []
    achievement_types: List[str] = []
    minimum_experience_months: Optional[int] = None
    preferred_experience_months: Optional[int] = None
    preferred_graduation_year: Optional[int] = None
    availability_required: bool = False
    limit: int = 20
    filters: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        json_schema_extra = {
            "example": {
                "intent_type": "mentor",
                "query_text": "Find a mentor with healthcare AI experience who can guide me",
                "target_role": ["senior", "alumnus"],
                "skills": ["healthcare-ai", "python"],
                "topics": ["healthcare-ai"],
                "minimum_experience_months": 12,
                "limit": 20,
            }
        }


class RecommendationScore(BaseModel):
    """Score breakdown for a recommendation."""

    overall_score: float = Field(..., ge=0, le=100, description="Overall score 0-100")
    matching_mode: str
    criterion_scores: Dict[str, float] = {}
    matched_skills: List[str] = []
    matched_topics: List[str] = []
    relevant_achievements: List[str] = []
    relevant_projects: List[str] = []
    evidence_path: List[str] = []
    missing_criteria: List[str] = []
    explanation: str = ""

    class Config:
        json_schema_extra = {
            "example": {
                "overall_score": 85.0,
                "matching_mode": "mentor",
                "criterion_scores": {
                    "topic_experience": 30,
                    "achievement_evidence": 20,
                    "skill_overlap": 18,
                    "role_fit": 12,
                    "experience_duration": 5,
                },
                "matched_skills": ["python", "machine-learning"],
                "matched_topics": ["healthcare-ai"],
                "explanation": "Strong match due to 24 months healthcare AI experience and Python expertise.",
            }
        }

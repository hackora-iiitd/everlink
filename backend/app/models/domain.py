"""Domain models for graph entities."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Skill(BaseModel):
    """Skill entity."""

    id: str
    name: str
    category: Optional[str] = None


class ResearchTopic(BaseModel):
    """Research topic entity."""

    id: str
    name: str
    description: Optional[str] = None


class ResearchProject(BaseModel):
    """Research project entity."""

    id: str
    name: str
    description: Optional[str] = None
    status: str = "active"
    required_skills: List[str] = []
    topics: List[str] = []


class Achievement(BaseModel):
    """Achievement entity."""

    id: str
    name: str
    type: str  # hackathon, internship, open-source, publication, etc.
    year: int
    description: Optional[str] = None
    verification_status: str = "unverified"


class Organization(BaseModel):
    """Organization entity."""

    id: str
    name: str
    industry: Optional[str] = None


class Venture(BaseModel):
    """Startup or venture entity."""

    id: str
    name: str
    description: Optional[str] = None
    skills_needed: List[str] = []


class Opportunity(BaseModel):
    """Opportunity entity (internship, hackathon, etc.)."""

    id: str
    name: str
    type: str
    description: Optional[str] = None
    skills_required: List[str] = []
    eligible_roles: List[str] = []


class Person(BaseModel):
    """Person entity (student, senior, alumni, professor)."""

    id: str
    name: str
    role: str  # student, senior, alumnus, professor
    headline: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None
    current_position: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    research_topics: List[str] = []
    preferred_mentorship_topics: List[str] = []
    years_of_experience: int = 0
    profile_completeness: float = 0.0
    availability: Optional[str] = None
    visibility_settings: dict = Field(default_factory=lambda: {"contact_visible": False})
    data_origin: str = "synthetic_demo"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "person_1",
                "name": "Alice Chen",
                "role": "student",
                "headline": "ML enthusiast exploring healthcare AI",
                "department": "Computer Science",
                "graduation_year": 2025,
                "bio": "Passionate about machine learning and its applications in healthcare.",
                "skills": ["python", "machine-learning", "tensorflow"],
                "interests": ["healthcare-ai", "computer-vision"],
                "years_of_experience": 0,
                "profile_completeness": 0.75,
                "data_origin": "synthetic_demo",
            }
        }

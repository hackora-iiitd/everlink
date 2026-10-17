"""Intent parsing and matching logic."""

from typing import List
from ..models.search import SearchIntent


class IntentParser:
    """Rule-based intent parser for natural language queries."""

    # Intent recognition keywords
    MENTOR_KEYWORDS = ["mentor", "guide", "help", "advise", "coach", "teach"]
    RESEARCH_KEYWORDS = [
        "research",
        "project",
        "investigate",
        "study",
        "academic",
        "paper",
    ]
    SENIOR_KEYWORDS = ["senior", "alumni", "alumnus", "alumni", "achievement", "succeeded"]
    TEAMMATE_KEYWORDS = ["team", "teammate", "partner", "co-founder", "collaborate"]
    OPPORTUNITY_KEYWORDS = [
        "opportunity",
        "position",
        "role",
        "internship",
        "hackathon",
        "program",
    ]

    @classmethod
    def parse(cls, query: str, limit: int = 20) -> SearchIntent:
        """Parse natural language query into structured intent."""

        # Determine intent type
        query_lower = query.lower()
        intent_type = "general"

        for keyword in cls.MENTOR_KEYWORDS:
            if keyword in query_lower:
                intent_type = "mentor"
                break

        for keyword in cls.RESEARCH_KEYWORDS:
            if keyword in query_lower:
                intent_type = "research"
                break

        for keyword in cls.SENIOR_KEYWORDS:
            if keyword in query_lower:
                intent_type = "senior"
                break

        for keyword in cls.TEAMMATE_KEYWORDS:
            if keyword in query_lower:
                intent_type = "teammate"
                break

        for keyword in cls.OPPORTUNITY_KEYWORDS:
            if keyword in query_lower:
                intent_type = "opportunity"
                break

        # Extract skills and topics (simple keyword matching)
        skills = cls._extract_keywords(query_lower, ["python", "java", "ml", "ai", "backend", "frontend"])
        topics = cls._extract_keywords(
            query_lower,
            ["healthcare", "healthcare-ai", "open-source", "computer-vision"],
        )

        # Extract duration requirements
        minimum_experience = cls._extract_duration(query)

        # Extract role preferences
        target_role = []
        if intent_type == "mentor":
            target_role = ["senior", "alumnus", "professor"]
        elif intent_type == "research":
            target_role = ["professor", "research-project"]
        elif intent_type == "senior":
            target_role = ["senior", "alumnus"]

        return SearchIntent(
            intent_type=intent_type,
            query_text=query,
            target_role=target_role if target_role else None,
            skills=skills,
            topics=topics,
            minimum_experience_months=minimum_experience,
            limit=limit,
        )

    @staticmethod
    def _extract_keywords(text: str, keywords: List[str]) -> List[str]:
        """Extract matching keywords from text."""
        found = []
        for keyword in keywords:
            if keyword.lower() in text:
                found.append(keyword)
        return found

    @staticmethod
    def _extract_duration(text: str) -> int:
        """Extract minimum experience duration (in months) from text."""
        import re

        # Look for patterns like "18 months", "2 years", etc.
        duration_pattern = r"(\d+)\s*(months?|years?)"
        matches = re.findall(duration_pattern, text.lower())

        if matches:
            value, unit = matches[0]
            value = int(value)
            if "year" in unit:
                return value * 12
            else:
                return value

        return 0

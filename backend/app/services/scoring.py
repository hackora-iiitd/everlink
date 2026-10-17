"""Recommendation scoring engine."""

from typing import List, Dict, Optional, Tuple
from ..models.domain import Person


class ScoringEngine:
    """Weighted scoring and ranking engine for recommendations."""

    # Configurable weights by matching mode
    WEIGHTS = {
        "mentor": {
            "topic_experience": 0.30,
            "achievement_evidence": 0.20,
            "skill_overlap": 0.20,
            "role_fit": 0.15,
            "experience_duration": 0.10,
            "availability": 0.05,
        },
        "research": {
            "research_topic_alignment": 0.35,
            "project_relevance": 0.25,
            "relevant_skills": 0.20,
            "experience_duration": 0.10,
            "role_fit": 0.10,
        },
        "senior": {
            "achievement_match": 0.35,
            "experience_relevance": 0.25,
            "relevant_skills": 0.20,
            "role_fit": 0.10,
            "topic_alignment": 0.10,
        },
        "teammate": {
            "skill_coverage": 0.30,
            "complementary_skills": 0.25,
            "project_experience": 0.20,
            "domain_alignment": 0.15,
            "availability": 0.10,
        },
        "opportunity": {
            "topic_alignment": 0.30,
            "eligibility_fit": 0.25,
            "skill_alignment": 0.20,
            "experience_relevance": 0.15,
            "timing_fit": 0.10,
        },
    }

    @classmethod
    def score_candidate(
        cls,
        candidate: Person,
        intent_query: Dict,
        mode: str = "general",
    ) -> Tuple[float, Dict]:
        """
        Score a candidate based on intent and matching mode.

        Returns:
            Tuple of (score, breakdown_dict)
        """

        if mode not in cls.WEIGHTS:
            mode = "general"
            weights = cls.WEIGHTS.get("mentor", {})
        else:
            weights = cls.WEIGHTS[mode]

        breakdown = {}
        total_score = 0.0
        applicable_weights = 0.0

        # Calculate individual criterion scores
        for criterion, weight in weights.items():
            criterion_score = cls._calculate_criterion_score(
                criterion, candidate, intent_query, mode
            )

            if criterion_score >= 0:  # -1 means not applicable
                breakdown[criterion] = criterion_score
                total_score += criterion_score * weight
                applicable_weights += weight

        # Renormalize if some criteria are not applicable
        if applicable_weights > 0 and applicable_weights < 1.0:
            total_score = total_score / applicable_weights * 100
        else:
            total_score = total_score * 100

        # Clamp to 0-100
        total_score = max(0, min(100, total_score))

        return total_score, breakdown

    @classmethod
    def _calculate_criterion_score(
        cls, criterion: str, candidate: Person, intent: Dict, mode: str
    ) -> float:
        """Calculate score for a single criterion (0-1 scale)."""

        if criterion == "topic_experience":
            return cls._score_topic_experience(candidate, intent)

        elif criterion == "achievement_evidence":
            return cls._score_achievement_evidence(candidate, intent)

        elif criterion == "skill_overlap":
            return cls._score_skill_overlap(candidate, intent)

        elif criterion == "role_fit":
            return cls._score_role_fit(candidate, intent)

        elif criterion == "experience_duration":
            return cls._score_experience_duration(candidate, intent)

        elif criterion == "availability":
            return cls._score_availability(candidate)

        elif criterion == "achievement_match":
            return cls._score_achievement_evidence(candidate, intent)

        elif criterion == "complementary_skills":
            return cls._score_complementary_skills(candidate, intent)

        # Default: not applicable
        return -1

    @staticmethod
    def _score_topic_experience(candidate: Person, intent: Dict) -> float:
        """Score based on research topic experience."""
        requested_topics = intent.get("topics", [])
        if not requested_topics:
            return 0.5  # Neutral if no topics requested

        candidate_topics = set(candidate.research_topics or [])
        requested_topics_set = set(requested_topics)
        overlap = len(candidate_topics & requested_topics_set)

        if not candidate_topics:
            return 0.0

        return min(1.0, overlap / len(requested_topics_set))

    @staticmethod
    def _score_achievement_evidence(candidate: Person, intent: Dict) -> float:
        """Score based on achievements relevant to query."""
        # Simplified: check if candidate has any achievements
        # In full implementation, would cross-reference with Neo4j achievements
        if candidate.years_of_experience > 0:
            return min(1.0, candidate.years_of_experience / 10)
        return 0.3

    @staticmethod
    def _score_skill_overlap(candidate: Person, intent: Dict) -> float:
        """Score based on skill overlap."""
        requested_skills = intent.get("skills", [])
        if not requested_skills:
            return 0.5

        candidate_skills = set(candidate.skills or [])
        requested_skills_set = set(requested_skills)
        overlap = len(candidate_skills & requested_skills_set)

        if not candidate_skills:
            return 0.0

        return min(1.0, overlap / len(requested_skills_set))

    @staticmethod
    def _score_role_fit(candidate: Person, intent: Dict) -> float:
        """Score based on role match."""
        target_roles = intent.get("target_role")
        if not target_roles:
            return 0.8  # Neutral

        if candidate.role in target_roles:
            return 1.0

        return 0.2

    @staticmethod
    def _score_experience_duration(candidate: Person, intent: Dict) -> float:
        """Score based on experience duration."""
        minimum_months = intent.get("minimum_experience_months")
        if not minimum_months:
            return 0.5

        candidate_months = candidate.years_of_experience * 12
        if candidate_months >= minimum_months:
            return 1.0
        elif candidate_months == 0:
            return 0.0
        else:
            return candidate_months / minimum_months

    @staticmethod
    def _score_availability(candidate: Person) -> float:
        """Score based on availability."""
        if candidate.availability == "available":
            return 1.0
        elif candidate.availability == "limited":
            return 0.6
        else:
            return 0.3

    @staticmethod
    def _score_complementary_skills(candidate: Person, intent: Dict) -> float:
        """Score for team building — how well they fill gaps."""
        team_skills = set(intent.get("team_skills", []))
        candidate_skills = set(candidate.skills or [])

        if not team_skills:
            return 0.5

        # Score based on new skills candidate brings
        new_skills = candidate_skills - team_skills
        if not new_skills:
            return 0.2

        return min(1.0, len(new_skills) / len(team_skills))

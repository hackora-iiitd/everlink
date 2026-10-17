"""Test suite for scoring engine and intent parser."""

import pytest
from app.services.intent_parser import IntentParser
from app.services.scoring import ScoringEngine
from app.models.domain import Person


class TestIntentParser:
    """Test natural language intent parsing."""

    def test_parse_mentor_query(self):
        """Parse mentor request."""
        query = "Find a mentor with healthcare AI experience"
        intent = IntentParser.parse(query)

        assert intent.intent_type == "mentor"
        assert "healthcare" in intent.topics or "healthcare-ai" in intent.topics
        assert intent.target_role is not None

    def test_parse_research_query(self):
        """Parse research project request."""
        query = "Show me professors working on computer vision"
        intent = IntentParser.parse(query)

        assert intent.intent_type == "research"
        assert intent.target_role is not None

    def test_parse_duration_extraction(self):
        """Extract duration from query."""
        query = "Find someone with at least 18 months of experience"
        intent = IntentParser.parse(query)

        assert intent.minimum_experience_months == 18

    def test_parse_duration_years(self):
        """Extract duration in years."""
        query = "Someone with 3 years of experience"
        intent = IntentParser.parse(query)

        assert intent.minimum_experience_months == 36

    def test_parse_skill_extraction(self):
        """Extract skills from query."""
        query = "Find a Python developer"
        intent = IntentParser.parse(query)

        assert "python" in intent.skills


class TestScoringEngine:
    """Test recommendation scoring."""

    def test_mentor_scoring_perfect_match(self):
        """Score perfect mentor match."""
        candidate = Person(
            id="test_1",
            name="Dr. Expert",
            role="professor",
            skills=["python", "tensorflow"],
            interests=["healthcare-ai"],
            research_topics=["healthcare-ai"],
            years_of_experience=8,
        )

        intent = {
            "intent_type": "mentor",
            "skills": ["python", "tensorflow"],
            "topics": ["healthcare-ai"],
            "target_role": ["professor", "senior"],
        }

        score, breakdown = ScoringEngine.score_candidate(
            candidate, intent, mode="mentor"
        )

        assert score > 80  # High score for perfect match
        assert "topic_experience" in breakdown
        assert "skill_overlap" in breakdown

    def test_mentor_scoring_partial_match(self):
        """Score partial mentor match."""
        candidate = Person(
            id="test_2",
            name="Junior Developer",
            role="student",
            skills=["python"],
            interests=[],
            research_topics=[],
            years_of_experience=0,
        )

        intent = {
            "intent_type": "mentor",
            "skills": ["python", "tensorflow"],
            "topics": ["healthcare-ai"],
            "target_role": ["professor"],
        }

        score, breakdown = ScoringEngine.score_candidate(
            candidate, intent, mode="mentor"
        )

        assert score < 50  # Low score — wrong role, no experience
        assert breakdown["role_fit"] < 1.0

    def test_skill_overlap_calculation(self):
        """Test skill overlap scoring."""
        candidate = Person(
            id="test_3",
            name="Test",
            role="senior",
            skills=["python", "java", "golang"],
            interests=[],
            research_topics=[],
            years_of_experience=2,
        )

        intent = {"skills": ["python", "java", "c++"]}

        score = ScoringEngine._score_skill_overlap(candidate, intent)

        # 2 out of 3 requested skills match
        assert score == pytest.approx(2/3, abs=0.01)

    def test_experience_duration_meets_minimum(self):
        """Score experience meeting minimum requirement."""
        candidate = Person(
            id="test_4",
            name="Experienced",
            role="alumnus",
            skills=[],
            interests=[],
            research_topics=[],
            years_of_experience=3,  # 36 months
        )

        intent = {"minimum_experience_months": 18}

        score = ScoringEngine._score_experience_duration(candidate, intent)

        assert score == 1.0  # Meets requirement

    def test_experience_duration_below_minimum(self):
        """Score experience below minimum requirement."""
        candidate = Person(
            id="test_5",
            name="Junior",
            role="student",
            skills=[],
            interests=[],
            research_topics=[],
            years_of_experience=1,  # 12 months
        )

        intent = {"minimum_experience_months": 18}

        score = ScoringEngine._score_experience_duration(candidate, intent)

        assert score == pytest.approx(12/18, abs=0.01)

    def test_role_fit_exact_match(self):
        """Test exact role matching."""
        candidate = Person(
            id="test_6",
            name="Prof",
            role="professor",
            skills=[],
            interests=[],
            research_topics=[],
            years_of_experience=0,
        )

        intent = {"target_role": ["professor"]}

        score = ScoringEngine._score_role_fit(candidate, intent)

        assert score == 1.0

    def test_role_fit_wrong_role(self):
        """Test non-matching role."""
        candidate = Person(
            id="test_7",
            name="Student",
            role="student",
            skills=[],
            interests=[],
            research_topics=[],
            years_of_experience=0,
        )

        intent = {"target_role": ["professor"]}

        score = ScoringEngine._score_role_fit(candidate, intent)

        assert score < 1.0  # Not a perfect match


class TestScoringWeightNormalization:
    """Test weight normalization when data is missing."""

    def test_missing_criteria_renormalization(self):
        """Verify weights renormalize when criteria unavailable."""
        candidate = Person(
            id="test_8",
            name="Partial",
            role="senior",
            skills=["python"],
            interests=[],
            research_topics=[],
            years_of_experience=0,
        )

        intent = {
            "intent_type": "mentor",
            "skills": ["python"],
            "topics": ["healthcare-ai"],
            "target_role": ["senior"],
        }

        score, breakdown = ScoringEngine.score_candidate(
            candidate, intent, mode="mentor"
        )

        # Score should still be valid (0-100 range)
        assert 0 <= score <= 100

        # Some criteria should be unavailable
        applicable_scores = [v for v in breakdown.values() if v >= 0]
        assert len(applicable_scores) >= 2  # At least some scores calculated


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

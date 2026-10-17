"""Search and recommendation API endpoints."""

from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from ..models.search import SearchIntent
from ..models.response import RecommendationResult, ApiResponse
from ..services.intent_parser import IntentParser
from ..services.scoring import ScoringEngine
from ..graph.connection import get_neo4j_session
from ..repositories.person import PersonRepository

router = APIRouter(prefix="/api", tags=["search"])


@router.post("/intent/parse")
async def parse_intent(query: str = Query(..., min_length=1, max_length=500)):
    """
    Parse a natural language query into structured intent.

    Example: "Find a mentor with healthcare AI experience"
    """
    try:
        intent = IntentParser.parse(query)
        return ApiResponse(success=True, data=intent.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search")
async def search(
    query: str = Query(..., min_length=1, max_length=500),
    limit: int = Query(20, ge=1, le=100),
    session = Depends(get_neo4j_session),
):
    """
    Search for candidates matching the query intent.

    This endpoint:
    1. Parses the natural language query
    2. Retrieves candidates from Neo4j
    3. Scores and ranks them
    4. Returns recommendations with explanations
    """
    try:
        # Parse intent
        intent = IntentParser.parse(query, limit=limit)

        # Get candidates from repository
        repo = PersonRepository(session)
        all_candidates = repo.find_all(limit=limit * 2)  # Get extra to filter

        if not all_candidates:
            return ApiResponse(
                success=True,
                data={"results": [], "total": 0, "intent": intent.model_dump()},
            )

        # Score and rank candidates
        scored_candidates = []
        for candidate_dict in all_candidates:
            # Convert dict to Person-like object for scoring
            score, breakdown = ScoringEngine.score_candidate(
                candidate_dict, intent.model_dump(), mode=intent.intent_type
            )

            result = RecommendationResult(
                candidate_id=candidate_dict.get("id"),
                candidate_name=candidate_dict.get("name"),
                candidate_role=candidate_dict.get("role"),
                headline=candidate_dict.get("headline"),
                score=score,
                matching_mode=intent.intent_type,
                score_breakdown=breakdown,
                matched_skills=intent.skills or [],
                matched_topics=intent.topics or [],
                explanation=f"Scored {score:.1f}/100 based on {intent.intent_type} matching criteria.",
            )

            scored_candidates.append(result)

        # Sort by score descending
        scored_candidates.sort(key=lambda x: x.score, reverse=True)
        top_results = scored_candidates[:limit]

        return ApiResponse(
            success=True,
            data={
                "results": [r.model_dump() for r in top_results],
                "total": len(top_results),
                "intent": intent.model_dump(),
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/people")
async def list_people(
    role: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    session = Depends(get_neo4j_session),
):
    """Get list of all people, optionally filtered by role."""
    try:
        repo = PersonRepository(session)

        if role:
            people = repo.find_by_role(role, limit=limit)
        else:
            people = repo.find_all(limit=limit)

        return ApiResponse(success=True, data={"people": people, "total": len(people)})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/people/{person_id}")
async def get_person(person_id: str, session = Depends(get_neo4j_session)):
    """Get a single person by ID."""
    try:
        repo = PersonRepository(session)
        person = repo.find_by_id(person_id)

        if not person:
            raise HTTPException(status_code=404, detail="Person not found")

        return ApiResponse(success=True, data=person)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

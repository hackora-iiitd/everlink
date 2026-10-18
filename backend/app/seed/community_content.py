"""Idempotent Neo4j seeding for fictional career-community development content."""

import json
import re
from pathlib import Path
from typing import Any


CONTENT_PATH = Path(__file__).resolve().parents[3] / "frontend" / "public" / "community-content.json"


def load_community_content() -> dict[str, Any]:
    with CONTENT_PATH.open(encoding="utf-8") as content_file:
        return json.load(content_file)


def _slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.casefold()).strip("-")


def seed_community_content(session) -> dict[str, int]:
    """MERGE development personas, stories, opportunities, posts, and supported links."""
    content = load_community_content()
    profiles = content["profiles"]
    stories = content["stories"]
    opportunities = content["opportunities"]
    posts = content["posts"]

    session.run(
        """
        UNWIND $profiles AS item
        MERGE (p:Person {id: item.id})
        SET p.name = item.name, p.role = item.role, p.headline = item.headline,
            p.department = item.department, p.graduation_year = item.graduationYear,
            p.current_position = item.currentRole, p.bio = item.headline,
            p.skills = item.skills, p.interests = item.interests,
            p.data_origin = 'fictional_development'
        WITH p, item
        MERGE (department:Department {name: item.department})
        MERGE (p)-[:STUDIED_IN]->(department)
        MERGE (organization:Organization {id: item.organizationId})
        SET organization.name = item.organization, organization.data_origin = 'fictional_development'
        MERGE (p)-[:WORKS_AT]->(organization)
        WITH p, item
        UNWIND item.skills AS skill_name
        MERGE (skill:Skill {id: toLower(replace(skill_name, ' ', '-'))})
        SET skill.name = skill_name
        MERGE (p)-[:HAS_SKILL]->(skill)
        """,
        profiles=[
            {
                **profile,
                "organizationId": _slug(profile["organization"]),
            }
            for profile in profiles
        ],
    ).consume()

    session.run(
        """
        UNWIND $opportunities AS item
        MERGE (op:Opportunity {id: item.id})
        SET op.name = item.title, op.type = item.type, op.description = item.description,
            op.skills_required = item.skills, op.eligible_roles = ['student'],
            op.status = item.status, op.deadline = item.deadline,
            op.application_url = item.applicationUrl,
            op.data_origin = 'fictional_development'
        MERGE (organization:Organization {id: item.organizationId})
        SET organization.name = item.organization, organization.data_origin = 'fictional_development'
        MERGE (op)-[:AT_ORGANIZATION]->(organization)
        WITH op, item
        UNWIND item.skills AS skill_name
        MERGE (skill:Skill {id: toLower(replace(skill_name, ' ', '-'))})
        SET skill.name = skill_name
        MERGE (op)-[:REQUIRES_SKILL]->(skill)
        """,
        opportunities=[
            {
                **opportunity,
                "organizationId": _slug(opportunity["organization"]),
            }
            for opportunity in opportunities
        ],
    ).consume()

    session.run(
        """
        UNWIND $stories AS item
        MERGE (story:SeniorSuccessStory {id: item.id})
        SET story.title = item.title, story.summary = item.summary,
            story.year = item.year, story.type = item.opportunityType,
            story.starting_point = item.startingPoint, story.preparation = item.preparation,
            story.resources = item.resources, story.challenges = item.challenges,
            story.lessons = item.lessons, story.advice = item.advice,
            story.data_origin = 'fictional_development'
        WITH story, item
        MATCH (author:Person {id: item.authorPersonId})
        MERGE (author)-[:AUTHORED]->(story)
        WITH story, item
        MATCH (op:Opportunity {id: item.relatedOpportunityId})
        MERGE (story)-[:RELATES_TO]->(op)
        WITH story, item
        UNWIND item.skills AS skill_name
        MATCH (skill:Skill {id: toLower(replace(skill_name, ' ', '-'))})
        MERGE (story)-[:RELATES_TO]->(skill)
        """,
        stories=stories,
    ).consume()

    session.run(
        """
        UNWIND $posts AS item
        MERGE (post:CommunityPost {id: item.id})
        SET post.type = item.type, post.title = item.title, post.summary = item.summary,
            post.content = item.content, post.tags = item.tags,
            post.status = item.status, post.published_at = item.publishedAt,
            post.data_origin = 'fictional_development'
        FOREACH (_ IN CASE WHEN item.type = 'blog' THEN [1] ELSE [] END | SET post:BlogPost)
        FOREACH (_ IN CASE WHEN item.type <> 'blog' THEN [1] ELSE [] END | SET post:Opportunity)
        WITH post, item
        MATCH (author:Person {id: item.authorPersonId})
        MERGE (author)-[:PUBLISHED]->(post)
        WITH post, item
        UNWIND item.skills AS skill_name
        MATCH (skill:Skill {id: toLower(replace(skill_name, ' ', '-'))})
        MERGE (post)-[:COVERS]->(skill)
        """,
        posts=posts,
    ).consume()

    return {
        "profiles": len(profiles),
        "stories": len(stories),
        "opportunities": len(opportunities),
        "posts": len(posts),
    }

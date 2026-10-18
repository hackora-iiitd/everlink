"""Neo4j repository for graph operations."""

from typing import List, Optional, Dict, Any
from ..models.domain import Person


class PersonRepository:
    """Repository for Person entities."""

    def __init__(self, session):
        self.session = session

    def create_person(self, person: Person) -> bool:
        """Create a person node."""
        query = """
        MERGE (p:Person {id: $id})
        SET p.name = $name,
            p.role = $role,
            p.headline = $headline,
            p.department = $department,
            p.graduation_year = $graduation_year,
            p.current_position = $current_position,
            p.bio = $bio,
            p.skills = $skills,
            p.interests = $interests,
            p.research_topics = $research_topics,
            p.years_of_experience = $years_of_experience,
            p.profile_completeness = $profile_completeness,
            p.data_origin = $data_origin,
            p.created_at = datetime($created_at),
            p.updated_at = datetime($updated_at)
        RETURN p
        """
        try:
            self.session.run(
                query,
                id=person.id,
                name=person.name,
                role=person.role,
                headline=person.headline,
                department=person.department,
                graduation_year=person.graduation_year,
                current_position=person.current_position,
                bio=person.bio,
                skills=person.skills,
                interests=person.interests,
                research_topics=person.research_topics,
                years_of_experience=person.years_of_experience,
                profile_completeness=person.profile_completeness,
                data_origin=person.data_origin,
                created_at=person.created_at.isoformat(),
                updated_at=person.updated_at.isoformat(),
            )
            return True
        except Exception as e:
            print(f"Error creating person: {e}")
            return False

    def find_by_id(self, person_id: str) -> Optional[Dict]:
        """Find a person by ID."""
        query = "MATCH (p:Person {id: $id}) RETURN p"
        try:
            result = self.session.run(query, id=person_id)
            record = result.single()
            if record:
                return dict(record["p"])
            return None
        except Exception as e:
            print(f"Error finding person: {e}")
            return None

    def find_all(self, limit: int = 100) -> List[Dict]:
        """Find all people."""
        query = "MATCH (p:Person) RETURN p LIMIT $limit"
        try:
            result = self.session.run(query, limit=limit)
            return [dict(record["p"]) for record in result]
        except Exception as e:
            print(f"Error finding all people: {e}")
            return []

    def find_by_role(self, role: str, limit: int = 100) -> List[Dict]:
        """Find people by role."""
        query = "MATCH (p:Person {role: $role}) RETURN p LIMIT $limit"
        try:
            result = self.session.run(query, role=role, limit=limit)
            return [dict(record["p"]) for record in result]
        except Exception as e:
            print(f"Error finding by role: {e}")
            return []

    def count(self) -> int:
        """Count total people."""
        query = "MATCH (p:Person) RETURN count(p) as count"
        try:
            result = self.session.run(query)
            record = result.single()
            return record["count"] if record else 0
        except Exception as e:
            print(f"Error counting people: {e}")
            return 0

"""Neo4j graph initialization and schema."""

from neo4j import GraphDatabase
from ..core.config import settings


class GraphSchema:
    """Initialize and manage Neo4j schema."""

    @staticmethod
    def create_constraints_and_indexes():
        """Create uniqueness constraints and indexes."""
        driver = GraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_username, settings.neo4j_password),
        )
        session = driver.session(database=settings.neo4j_database)

        try:
            # Constraints
            queries = [
                "CREATE CONSTRAINT unique_person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE",
                "CREATE CONSTRAINT unique_skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE",
                "CREATE CONSTRAINT unique_topic_id IF NOT EXISTS FOR (t:ResearchTopic) REQUIRE t.id IS UNIQUE",
                "CREATE CONSTRAINT unique_project_id IF NOT EXISTS FOR (p:ResearchProject) REQUIRE p.id IS UNIQUE",
                "CREATE CONSTRAINT unique_achievement_id IF NOT EXISTS FOR (a:Achievement) REQUIRE a.id IS UNIQUE",
                "CREATE CONSTRAINT unique_org_id IF NOT EXISTS FOR (o:Organization) REQUIRE o.id IS UNIQUE",
                "CREATE CONSTRAINT unique_opportunity_id IF NOT EXISTS FOR (op:Opportunity) REQUIRE op.id IS UNIQUE",
                "CREATE CONSTRAINT unique_venture_id IF NOT EXISTS FOR (v:Venture) REQUIRE v.id IS UNIQUE",
                # Indexes for common queries
                "CREATE INDEX idx_person_role IF NOT EXISTS FOR (p:Person) ON (p.role)",
                "CREATE INDEX idx_person_name IF NOT EXISTS FOR (p:Person) ON (p.name)",
                "CREATE INDEX idx_person_department IF NOT EXISTS FOR (p:Person) ON (p.department)",
                "CREATE INDEX idx_person_data_origin IF NOT EXISTS FOR (p:Person) ON (p.data_origin)",
                "CREATE INDEX idx_skill_name IF NOT EXISTS FOR (s:Skill) ON (s.name)",
                "CREATE INDEX idx_project_status IF NOT EXISTS FOR (p:ResearchProject) ON (p.status)",
                "CREATE INDEX idx_achievement_type IF NOT EXISTS FOR (a:Achievement) ON (a.type)",
                "CREATE CONSTRAINT unique_department_name IF NOT EXISTS FOR (d:Department) REQUIRE d.name IS UNIQUE",
                "CREATE CONSTRAINT unique_success_story_id IF NOT EXISTS FOR (s:SeniorSuccessStory) REQUIRE s.id IS UNIQUE",
                "CREATE CONSTRAINT unique_community_post_id IF NOT EXISTS FOR (p:CommunityPost) REQUIRE p.id IS UNIQUE",
            ]

            for query in queries:
                try:
                    session.run(query)
                except Exception as e:
                    if "already exists" not in str(e):
                        print(f"Warning creating constraint/index: {e}")

            print("✓ Graph schema initialized")
            return True

        except Exception as e:
            print(f"✗ Failed to initialize graph schema: {e}")
            return False
        finally:
            session.close()
            driver.close()

    @staticmethod
    def clear_all_data():
        """DANGER: Clear all data from Neo4j. For development only."""
        driver = GraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_username, settings.neo4j_password),
        )
        session = driver.session(database=settings.neo4j_database)

        try:
            session.run("MATCH (n) DETACH DELETE n")
            print("✓ All data cleared from Neo4j")
            return True
        except Exception as e:
            print(f"✗ Failed to clear data: {e}")
            return False
        finally:
            session.close()
            driver.close()

"""Neo4j connection and session management."""

from neo4j import GraphDatabase, AsyncDriver
from typing import Optional
from ..core.config import settings


class Neo4jConnection:
    """Manages Neo4j connection and sessions."""

    _driver: Optional[AsyncDriver] = None

    @classmethod
    def initialize(cls):
        """Initialize Neo4j driver."""
        try:
            cls._driver = GraphDatabase.driver(
                settings.neo4j_uri,
                auth=(settings.neo4j_username, settings.neo4j_password),
            )
            # Test connection
            with cls._driver.session(database=settings.neo4j_database) as session:
                session.run("RETURN 1")
            print("✓ Neo4j connection successful")
            return True
        except Exception as e:
            print(f"✗ Neo4j connection failed: {e}")
            return False

    @classmethod
    def get_driver(cls):
        """Get Neo4j driver instance."""
        if cls._driver is None:
            cls.initialize()
        return cls._driver

    @classmethod
    def close(cls):
        """Close Neo4j driver."""
        if cls._driver:
            cls._driver.close()


def get_neo4j_session():
    """Get Neo4j session for dependency injection."""
    driver = Neo4jConnection.get_driver()
    if driver is None:
        raise RuntimeError("Neo4j driver not initialized")
    return driver.session(database=settings.neo4j_database)

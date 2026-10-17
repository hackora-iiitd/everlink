#!/usr/bin/env python3
"""Seed the database with synthetic data."""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.graph.connection import Neo4jConnection
from app.graph.schema import GraphSchema
from app.seed.seed_data import seed_database

if __name__ == "__main__":
    print("Everlink Database Seeding Tool")
    print("=" * 50)

    # Initialize connection
    if not Neo4jConnection.initialize():
        print("✗ Failed to connect to Neo4j. Exiting.")
        sys.exit(1)

    # Create schema
    print("\nInitializing schema...")
    GraphSchema.create_constraints_and_indexes()

    # Seed data
    print("\nSeeding database...")
    session = Neo4jConnection.get_driver().session()

    try:
        seed_database(session)
        print("\n✓ Database seeding complete!")
    except Exception as e:
        print(f"\n✗ Seeding failed: {e}")
        sys.exit(1)
    finally:
        session.close()
        Neo4jConnection.close()

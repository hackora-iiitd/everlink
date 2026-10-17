"""Seed data generation for synthetic university ecosystem."""

import uuid
from datetime import datetime, timedelta
from ..models.domain import Person


def generate_seed_people():
    """Generate synthetic seed data for students, seniors, alumni, and professors."""

    people = []

    # PROFESSORS
    people.append(
        Person(
            id="prof_001",
            name="Dr. James Wilson",
            role="professor",
            headline="Medical AI & Healthcare Technology Researcher",
            department="Computer Science",
            bio="Leading research in medical image analysis and healthcare AI systems. 8+ years of research experience.",
            skills=["python", "tensorflow", "pytorch", "computer-vision", "machine-learning"],
            interests=["healthcare-ai", "medical-imaging", "data-science"],
            research_topics=["healthcare-ai", "computer-vision", "deep-learning"],
            years_of_experience=8,
            profile_completeness=0.95,
            current_position="Associate Professor",
            data_origin="synthetic_demo",
        )
    )

    people.append(
        Person(
            id="prof_002",
            name="Dr. Sarah Kumar",
            role="professor",
            headline="Open Source & Systems Software Leader",
            department="Computer Science",
            bio="Expert in distributed systems and open-source communities. Mentors students in open-source contribution.",
            skills=["c++", "python", "golang", "linux-kernel", "system-design"],
            interests=["open-source", "distributed-systems", "systems-programming"],
            research_topics=["operating-systems", "distributed-systems"],
            years_of_experience=12,
            profile_completeness=0.90,
            current_position="Professor",
            data_origin="synthetic_demo",
        )
    )

    people.append(
        Person(
            id="prof_003",
            name="Prof. Rajesh Sharma",
            role="professor",
            headline="Database & Graph Systems Researcher",
            department="Computer Science",
            bio="Specializing in graph databases, query optimization, and distributed databases.",
            skills=["neo4j", "cypher", "sql", "database-design", "python"],
            interests=["graph-databases", "knowledge-graphs", "database-systems"],
            research_topics=["graph-databases", "knowledge-representation"],
            years_of_experience=10,
            profile_completeness=0.88,
            current_position="Associate Professor",
            data_origin="synthetic_demo",
        )
    )

    # ALUMNI
    people.append(
        Person(
            id="alumni_001",
            name="Arjun Patel",
            role="alumnus",
            headline="ML Engineer at MediTech Solutions | Healthcare AI Focus",
            department="Computer Science",
            graduation_year=2022,
            bio="3+ years in healthcare AI, built ML pipelines for medical image analysis. Active mentor for healthcare-AI seekers.",
            skills=["python", "tensorflow", "medical-imaging", "gcp", "sql"],
            interests=["healthcare-ai", "machine-learning", "mentoring"],
            years_of_experience=3,
            profile_completeness=0.92,
            current_position="ML Engineer",
            availability="limited",
            data_origin="synthetic_demo",
        )
    )

    people.append(
        Person(
            id="alumni_002",
            name="Priya Singh",
            role="alumnus",
            headline="Senior Backend Engineer at OpenCore | Open Source Advocate",
            department="Computer Science",
            graduation_year=2021,
            bio="Active open-source contributor with 5+ GSoC projects. Expert in backend architecture and system design.",
            skills=["java", "golang", "kubernetes", "microservices", "open-source"],
            interests=["open-source", "backend-development", "mentoring"],
            years_of_experience=4,
            profile_completeness=0.89,
            current_position="Senior Backend Engineer",
            availability="available",
            data_origin="synthetic_demo",
        )
    )

    people.append(
        Person(
            id="alumni_003",
            name="Vikram Desai",
            role="alumnus",
            headline="Startup Founder & ML Researcher",
            department="Computer Science",
            graduation_year=2020,
            bio="Founded an AI startup. Expert in computer vision and team building for startups.",
            skills=["python", "computer-vision", "pytorch", "entrepreneurship"],
            interests=["ai-startups", "computer-vision", "team-building"],
            years_of_experience=5,
            profile_completeness=0.85,
            current_position="Founder & CTO",
            data_origin="synthetic_demo",
        )
    )

    # SENIORS (4th year students)
    people.append(
        Person(
            id="senior_001",
            name="Neha Gupta",
            role="senior",
            headline="Healthcare AI Project Lead | GSoC 2024 Participant",
            department="Computer Science",
            graduation_year=2025,
            bio="Led a healthcare AI project as part of capstone. Experienced with medical imaging datasets.",
            skills=["python", "tensorflow", "healthcare-ai", "research-methodologies"],
            interests=["healthcare-ai", "deep-learning"],
            years_of_experience=2,
            profile_completeness=0.88,
            availability="limited",
            data_origin="synthetic_demo",
        )
    )

    people.append(
        Person(
            id="senior_002",
            name="Aditya Verma",
            role="senior",
            headline="Open Source Contributor | 3 Hackathon Wins",
            department="Computer Science",
            graduation_year=2025,
            bio="Active in open-source communities. Won multiple hackathons in backend development.",
            skills=["python", "java", "backend-development", "open-source"],
            interests=["open-source", "backend-systems", "startup-building"],
            years_of_experience=2,
            profile_completeness=0.86,
            availability="available",
            data_origin="synthetic_demo",
        )
    )

    people.append(
        Person(
            id="senior_003",
            name="Isha Malhotra",
            role="senior",
            headline="Full Stack Developer | Cloud Infrastructure Enthusiast",
            department="Computer Science",
            graduation_year=2025,
            bio="Strong in full stack development. Deploying projects on AWS and GCP.",
            skills=["react", "nodejs", "python", "aws", "docker", "kubernetes"],
            interests=["cloud-computing", "devops", "full-stack-development"],
            years_of_experience=2,
            profile_completeness=0.90,
            availability="limited",
            data_origin="synthetic_demo",
        )
    )

    # JUNIOR STUDENTS
    people.append(
        Person(
            id="student_001",
            name="Rohan Chopra",
            role="student",
            headline="3rd Year | Exploring Machine Learning",
            department="Computer Science",
            graduation_year=2026,
            bio="Interested in machine learning and healthcare applications.",
            skills=["python", "machine-learning", "data-analysis"],
            interests=["healthcare-ai", "machine-learning"],
            years_of_experience=0,
            profile_completeness=0.70,
            data_origin="synthetic_demo",
        )
    )

    people.append(
        Person(
            id="student_002",
            name="Anjali Kapoor",
            role="student",
            headline="2nd Year | Backend Development Interest",
            department="Computer Science",
            graduation_year=2027,
            bio="Enthusiastic about backend systems and APIs. Seeking guidance in system design.",
            skills=["python", "nodejs", "database-design"],
            interests=["backend-development", "system-design"],
            years_of_experience=0,
            profile_completeness=0.65,
            data_origin="synthetic_demo",
        )
    )

    people.append(
        Person(
            id="student_003",
            name="Karan Singh",
            role="student",
            headline="1st Year | Full Stack Learning Journey",
            department="Computer Science",
            graduation_year=2028,
            bio="Learning web development. Interested in open-source and community contributions.",
            skills=["javascript", "react", "html-css"],
            interests=["web-development", "open-source"],
            years_of_experience=0,
            profile_completeness=0.60,
            data_origin="synthetic_demo",
        )
    )

    return people


def seed_database(session):
    """Seed Neo4j database with synthetic data."""
    from ..repositories.person import PersonRepository

    print("Seeding database with synthetic people...")

    repo = PersonRepository(session)
    people = generate_seed_people()

    created_count = 0
    for person in people:
        if repo.create_person(person):
            created_count += 1
        else:
            print(f"Failed to create person: {person.name}")

    print(f"✓ Created {created_count} people")
    print(f"Total people in database: {repo.count()}")

    return created_count

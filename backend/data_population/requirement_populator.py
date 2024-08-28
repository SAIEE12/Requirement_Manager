from sqlalchemy.orm import Session
from app.models.requirement import Requirement
from app.crud.client import get_clients
from app.crud.location import get_locations
import random

def populate_requirements(db: Session):
    # Get existing clients and locations
    clients = get_clients(db, skip=0, limit=100)
    locations = get_locations(db, skip=0, limit=100)

    if not clients or not locations:
        print("No clients or locations found. Please populate these first.")
        return

    # Sample job descriptions
    job_descriptions = [
        "Experienced Python developer needed for a fintech project",
        "Senior Java engineer for enterprise software development",
        "Full-stack JavaScript developer with React and Node.js expertise",
        "Data scientist with machine learning experience",
        "DevOps engineer familiar with AWS and Kubernetes",
    ]

    # Create 10 sample requirements
    for _ in range(10):
        requirement = Requirement(
            description=random.choice(job_descriptions),
            client_id=random.choice(clients).id,
            experience_min=random.randint(1, 5),
            experience_max=random.randint(6, 15),
            location_id=random.choice(locations).id,
            notes="This is a sample requirement"
        )
        db.add(requirement)

    db.commit()
    print("Requirements table populated with sample data.")

def run_requirement_population(db: Session):
    requirements = db.query(Requirement).all()
    if not requirements:
        populate_requirements(db)
    else:
        print("Requirements table already populated.")
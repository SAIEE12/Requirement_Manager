# data_population/requirement_populator.py
from sqlalchemy.orm import Session
from app.models import Requirement, Client, Location, Domain, Status, Skill, User
from app.schemas.requirement import RequirementCreate
import random
from datetime import date, timedelta

def populate_requirements(db: Session):
    clients = db.query(Client).all()
    locations = db.query(Location).all()
    domains = db.query(Domain).all()
    statuses = db.query(Status).all()
    skills = db.query(Skill).all()
    priorities = ["High", "Medium", "Low"]

    for _ in range(50):  # Create 50 sample requirements
        client = random.choice(clients)
        location = random.choice(locations)
        domain = random.choice(domains)
        status = random.choice(statuses)
        selected_skills = random.sample(skills, k=random.randint(1, 5))
        start_date = date.today() + timedelta(days=random.randint(0, 60))
        end_date = start_date + timedelta(days=random.randint(30, 180))

        requirement = RequirementCreate(
            description=f"Sample requirement for {client.name}",
            client_id=client.id,
            experience_min=random.randint(0, 5),
            experience_max=random.randint(5, 15),
            location_id=location.id,
            domain_id=domain.id,
            status_id=status.id,
            notes="Sample notes for the requirement",
            priority=random.choice(priorities),
            expected_start_date=start_date,
            expected_end_date=end_date,
            required_resources=random.randint(1, 10),
            skill_ids=[skill.id for skill in selected_skills]
        )

        db_requirement = Requirement(**requirement.dict(exclude={'skill_ids'}))
        db.add(db_requirement)
        db.commit()
        db.refresh(db_requirement)

        for skill_id in requirement.skill_ids:
            skill = db.query(Skill).filter(Skill.id == skill_id).first()
            if skill:
                db_requirement.skills.append(skill)
        
        db.commit()
        print(f"Created requirement for {client.name}")

# If you have a separate function to run the population, keep it:
def run_requirement_population(db: Session):
    print("Populating requirements...")
    populate_requirements(db)
    print("Requirement population completed")
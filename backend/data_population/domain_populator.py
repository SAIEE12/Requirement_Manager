from sqlalchemy.orm import Session
from app.crud.domain import create_domain
from app.schemas.domain import DomainCreate
from app.models.domain import Domain

def populate_domains(db: Session):
    domains = [
        {"name": "DV", "description": "Design Verification"},
        {"name": "PD", "description": "Physical Design"},
        {"name": "Analog Design", "description": "Analog Circuit Design"},
        {"name": "Embedded Software", "description": "Embedded Systems Software Development"},
        {"name": "IT Software", "description": "Information Technology Software Development"},
        {"name": "AI", "description": "Artificial Intelligence"},
    ]

    for domain_data in domains:
        domain = DomainCreate(**domain_data)
        existing_domain = db.query(Domain).filter(Domain.name == domain.name).first()
        if not existing_domain:
            create_domain(db, domain)
            print(f"Created domain: {domain.name}")
        else:
            print(f"Domain {domain.name} already exists, skipping.")
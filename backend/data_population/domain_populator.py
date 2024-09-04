from sqlalchemy.orm import Session
from app.crud.domain import create_domain, get_domain_by_name
from app.schemas.domain import DomainCreate

def populate_domains(db: Session):
    domains = [
        {"name": "Hardware", "is_active": True},
        {"name": "Software", "is_active": True},
        {"name": "Embedded", "is_active": True},
        {"name": "Automotive", "is_active": True}
    ]

    for domain_data in domains:
        existing_domain = get_domain_by_name(db, domain_data["name"])
        if not existing_domain:
            domain = DomainCreate(**domain_data)
            db_domain = create_domain(db, domain)
            if db_domain:
                print(f"Created domain: {db_domain.name}")
            else:
                print(f"Failed to create domain: {domain_data['name']}")
        else:
            print(f"Domain {domain_data['name']} already exists")

def run_domain_population(db: Session):
    print("Populating domains...")
    populate_domains(db)
    print("Domain population completed")
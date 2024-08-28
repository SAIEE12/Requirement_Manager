from sqlalchemy.orm import Session
from app.models.domain import Domain
from app.schemas.domain import DomainCreate, DomainUpdate

def get_domain(db: Session, domain_id: int):
    return db.query(Domain).filter(Domain.id == domain_id).first()

def get_domain_by_name(db: Session, name: str):
    return db.query(Domain).filter(Domain.name == name).first()

def get_domains(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Domain).offset(skip).limit(limit).all()

def create_domain(db: Session, domain: DomainCreate):
    db_domain = Domain(**domain.dict())
    db.add(db_domain)
    db.commit()
    db.refresh(db_domain)
    return db_domain

def update_domain(db: Session, domain_id: int, domain: DomainUpdate):
    db_domain = get_domain(db, domain_id)
    if db_domain:
        update_data = domain.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_domain, key, value)
        db.commit()
        db.refresh(db_domain)
    return db_domain

def delete_domain(db: Session, domain_id: int):
    db_domain = get_domain(db, domain_id)
    if db_domain:
        db.delete(db_domain)
        db.commit()
    return db_domain
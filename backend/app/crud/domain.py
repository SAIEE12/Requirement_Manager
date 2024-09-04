from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.domain import Domain
from app.schemas.domain import DomainCreate, DomainUpdate

def create_domain(db: Session, domain: DomainCreate):
    existing_domain = get_domain_by_name(db, domain.name)
    if existing_domain:
        if not existing_domain.is_active and domain.is_active:
            return reactivate_domain(db, existing_domain.id)
        return None
    db_domain = Domain(**domain.dict())
    db.add(db_domain)
    db.commit()
    db.refresh(db_domain)
    return db_domain

def get_domain(db: Session, domain_id: int):
    return db.query(Domain).filter(Domain.id == domain_id).first()

def get_domain_by_name(db: Session, name: str):
    return db.query(Domain).filter(Domain.name == name).first()

def get_domains(db: Session, skip: int = 0, limit: int = 100, include_inactive: bool = False):
    query = db.query(Domain)
    if not include_inactive:
        query = query.filter(Domain.is_active == True)
    return query.offset(skip).limit(limit).all()

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
        db_domain.is_active = False
        db.commit()
        db.refresh(db_domain)
    return db_domain

def reactivate_domain(db: Session, domain_id: int):
    db_domain = get_domain(db, domain_id)
    if db_domain and not db_domain.is_active:
        db_domain.is_active = True
        db.commit()
        db.refresh(db_domain)
    return db_domain
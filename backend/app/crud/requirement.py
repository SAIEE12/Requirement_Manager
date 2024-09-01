from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.requirement import Requirement
from app.models.client import Client
from app.models.location import Location
from app.models.status import Status
from app.schemas.requirement import RequirementCreate, RequirementUpdate

def create_requirement(db: Session, requirement: RequirementCreate):
    db_requirement = Requirement(**requirement.dict())
    db.add(db_requirement)
    db.commit()
    db.refresh(db_requirement)
    return get_requirement_with_names(db, db_requirement.id)

def get_requirement(db: Session, requirement_id: int):
    return get_requirement_with_names(db, requirement_id)

def get_requirements(db: Session, skip: int = 0, limit: int = 100):
    stmt = (
        select(Requirement, Client.name.label("client_name"), Location.name.label("location_name"), Status)
        .join(Client, Requirement.client_id == Client.id)
        .join(Location, Requirement.location_id == Location.id)
        .join(Status, Requirement.status_id == Status.id)
        .offset(skip)
        .limit(limit)
    )
    results = db.execute(stmt).all()
    requirements = []
    for result in results:
        requirement, client_name, location_name, status = result
        setattr(requirement, 'client_name', client_name)
        setattr(requirement, 'location_name', location_name)
        setattr(requirement, 'status', status)
        requirements.append(requirement)
    return requirements

def update_requirement(db: Session, requirement_id: int, requirement: RequirementUpdate):
    db_requirement = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if db_requirement:
        update_data = requirement.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_requirement, key, value)
        db.commit()
        db.refresh(db_requirement)
        return get_requirement_with_names(db, requirement_id)
    return None

def delete_requirement(db: Session, requirement_id: int):
    db_requirement = get_requirement_with_names(db, requirement_id)
    if db_requirement:
        db.delete(db_requirement)
        db.commit()
    return db_requirement

def get_requirement_with_names(db: Session, requirement_id: int):
    stmt = (
        select(Requirement, Client.name.label("client_name"), Location.name.label("location_name"))
        .join(Client, Requirement.client_id == Client.id)
        .join(Location, Requirement.location_id == Location.id)
        .where(Requirement.id == requirement_id)
    )
    result = db.execute(stmt).first()
    if result:
        requirement, client_name, location_name = result
        setattr(requirement, 'client_name', client_name)
        setattr(requirement, 'location_name', location_name)
        return requirement
    return None
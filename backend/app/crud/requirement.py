from sqlalchemy.orm import Session, joinedload
from app.models.requirement import Requirement
from app.models.skill import Skill
from app.schemas.requirement import RequirementCreate, RequirementUpdate
from typing import List, Optional
from datetime import datetime

def get_requirement(db: Session, requirement_id: int):
    return db.query(Requirement).options(
        joinedload(Requirement.skills),
        joinedload(Requirement.location),
        joinedload(Requirement.client),
        joinedload(Requirement.domain),
        joinedload(Requirement.status)
    ).filter(Requirement.id == requirement_id).first()

def get_requirements(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Requirement).options(
        joinedload(Requirement.skills),
        joinedload(Requirement.location),
        joinedload(Requirement.client),
        joinedload(Requirement.domain),
        joinedload(Requirement.status)
    ).offset(skip).limit(limit).all()

def create_requirement(db: Session, requirement: RequirementCreate):
    db_requirement = Requirement(**requirement.dict(exclude={'skill_ids'}))
    db.add(db_requirement)
    db.commit()
    db.refresh(db_requirement)
    
    # Add skills
    for skill_id in requirement.skill_ids:
        skill = db.query(Skill).filter(Skill.id == skill_id).first()
        if skill:
            db_requirement.skills.append(skill)
    
    db.commit()
    db.refresh(db_requirement)
    return db_requirement

def update_requirement(db: Session, requirement_id: int, requirement: RequirementUpdate):
    db_requirement = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if db_requirement:
        update_data = requirement.dict(exclude_unset=True)
        for key, value in update_data.items():
            if key != 'skill_ids':
                setattr(db_requirement, key, value)
        
        if 'skill_ids' in update_data:
            db_requirement.skills = []
            for skill_id in update_data['skill_ids']:
                skill = db.query(Skill).filter(Skill.id == skill_id).first()
                if skill:
                    db_requirement.skills.append(skill)
        
        db.commit()
        db.refresh(db_requirement)
    return db_requirement

def delete_requirement(db: Session, requirement_id: int):
    requirement = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if requirement:
        db.delete(requirement)
        db.commit()
        return True
    return False

def filter_requirements(db: Session,
                        client_id: Optional[int] = None,
                        location_id: Optional[int] = None,
                        domain_id: Optional[int] = None,
                        status_id: Optional[int] = None,
                        priority: Optional[str] = None,
                        created_after: Optional[datetime] = None,
                        created_before: Optional[datetime] = None):
    query = db.query(Requirement).options(
        joinedload(Requirement.skills),
        joinedload(Requirement.location),
        joinedload(Requirement.client),
        joinedload(Requirement.domain),
        joinedload(Requirement.status)
    )
    if client_id:
        query = query.filter(Requirement.client_id == client_id)
    if location_id:
        query = query.filter(Requirement.location_id == location_id)
    if domain_id:
        query = query.filter(Requirement.domain_id == domain_id)
    if status_id:
        query = query.filter(Requirement.status_id == status_id)
    if priority:
        query = query.filter(Requirement.priority == priority)
    if created_after:
        query = query.filter(Requirement.created_at >= created_after)
    if created_before:
        query = query.filter(Requirement.created_at <= created_before)
    return query.all()
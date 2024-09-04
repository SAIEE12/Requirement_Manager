from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate

def create_skill(db: Session, skill: SkillCreate):
    existing_skill = get_skill_by_name_and_domain(db, skill.name, skill.domain_id)
    if existing_skill:
        if not existing_skill.is_active and skill.is_active:
            return reactivate_skill(db, existing_skill.id)
        return None
    db_skill = Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def get_skill(db: Session, skill_id: int):
    return db.query(Skill).filter(Skill.id == skill_id).first()

def get_skill_by_name_and_domain(db: Session, name: str, domain_id: int):
    return db.query(Skill).filter(Skill.name == name, Skill.domain_id == domain_id).first()

def get_skills(db: Session, skip: int = 0, limit: int = 100, include_inactive: bool = False):
    query = db.query(Skill)
    if not include_inactive:
        query = query.filter(Skill.is_active == True)
    return query.offset(skip).limit(limit).all()

def get_skills_by_domain(db: Session, domain_id: int, include_inactive: bool = False):
    query = db.query(Skill).filter(Skill.domain_id == domain_id)
    if not include_inactive:
        query = query.filter(Skill.is_active == True)
    return query.all()

def update_skill(db: Session, skill_id: int, skill: SkillUpdate):
    db_skill = get_skill(db, skill_id)
    if db_skill:
        update_data = skill.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_skill, key, value)
        db.commit()
        db.refresh(db_skill)
    return db_skill

def delete_skill(db: Session, skill_id: int):
    db_skill = get_skill(db, skill_id)
    if db_skill:
        db_skill.is_active = False
        db.commit()
        db.refresh(db_skill)
    return db_skill

def reactivate_skill(db: Session, skill_id: int):
    db_skill = get_skill(db, skill_id)
    if db_skill and not db_skill.is_active:
        db_skill.is_active = True
        db.commit()
        db.refresh(db_skill)
    return db_skill
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.skill import Skill, SkillCreate, SkillUpdate
from app.crud import skill as skill_crud
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=Skill)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db)):
    db_skill = skill_crud.create_skill(db=db, skill=skill)
    if db_skill is None:
        raise HTTPException(status_code=400, detail="Skill with this name already exists in the specified domain and is active")
    return db_skill

@router.get("/", response_model=List[Skill])
def read_skills(skip: int = 0, limit: int = 100, include_inactive: bool = False, db: Session = Depends(get_db)):
    skills = skill_crud.get_skills(db, skip=skip, limit=limit, include_inactive=include_inactive)
    return [skill for skill in skills if skill is not None]

@router.get("/domain/{domain_id}", response_model=List[Skill])
def read_skills_by_domain(domain_id: int, include_inactive: bool = False, db: Session = Depends(get_db)):
    skills = skill_crud.get_skills_by_domain(db, domain_id=domain_id, include_inactive=include_inactive)
    return [skill for skill in skills if skill is not None]

@router.get("/{skill_id}", response_model=Skill)
def read_skill(skill_id: int, db: Session = Depends(get_db)):
    db_skill = skill_crud.get_skill(db, skill_id=skill_id)
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@router.put("/{skill_id}", response_model=Skill)
def update_skill(skill_id: int, skill: SkillUpdate, db: Session = Depends(get_db)):
    db_skill = skill_crud.update_skill(db, skill_id=skill_id, skill=skill)
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@router.delete("/{skill_id}", response_model=Skill)
def delete_skill(skill_id: int, db: Session = Depends(get_db)):
    db_skill = skill_crud.delete_skill(db, skill_id=skill_id)
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@router.post("/{skill_id}/reactivate", response_model=Skill)
def reactivate_skill(skill_id: int, db: Session = Depends(get_db)):
    db_skill = skill_crud.reactivate_skill(db, skill_id=skill_id)
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found or already active")
    return db_skill
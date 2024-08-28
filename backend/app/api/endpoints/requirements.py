from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.requirement import Requirement, RequirementCreate, RequirementUpdate
from app.crud import requirement as requirement_crud
from app.database import get_db


router = APIRouter()

@router.post("/", response_model=Requirement)
def create_requirement(requirement: RequirementCreate, db: Session = Depends(get_db)):
    return requirement_crud.create_requirement(db=db, requirement=requirement)

@router.get("/{requirement_id}", response_model=Requirement)
def read_requirement(requirement_id: int, db: Session = Depends(get_db)):
    db_requirement = requirement_crud.get_requirement(db, requirement_id=requirement_id)
    if db_requirement is None:
        raise HTTPException(status_code=404, detail=f"Requirement with id {requirement_id} not found")
    return db_requirement

@router.get("/", response_model=List[Requirement])
def read_requirements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requirements = requirement_crud.get_requirements(db, skip=skip, limit=limit)
    return requirements

@router.put("/{requirement_id}", response_model=Requirement)
def update_requirement(requirement_id: int, requirement: RequirementUpdate, db: Session = Depends(get_db)):
    db_requirement = requirement_crud.update_requirement(db, requirement_id=requirement_id, requirement=requirement)
    if db_requirement is None:
        raise HTTPException(status_code=404, detail=f"Requirement with id {requirement_id} not found")
    return db_requirement

@router.delete("/{requirement_id}", response_model=Requirement)
def delete_requirement(requirement_id: int, db: Session = Depends(get_db)):
    db_requirement = requirement_crud.delete_requirement(db, requirement_id=requirement_id)
    if db_requirement is None:
        raise HTTPException(status_code=404, detail=f"Requirement with id {requirement_id} not found")
    return db_requirement
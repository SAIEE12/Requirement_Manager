# app/api/endpoints/requirements.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.crud import requirement as requirement_crud
from app.schemas.requirement import Requirement, RequirementCreate, RequirementUpdate
from app.api.deps import get_db

router = APIRouter()

@router.post("/", response_model=Requirement)
def create_requirement(requirement: RequirementCreate, db: Session = Depends(get_db)):
    return requirement_crud.create_requirement(db=db, requirement=requirement)

@router.get("/", response_model=List[Requirement])
def read_requirements(skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    requirements = requirement_crud.get_requirements(db, skip=skip, limit=limit)
    return requirements

@router.get("/{requirement_id}", response_model=Requirement)
def read_requirement(requirement_id: int, db: Session = Depends(get_db)):
    db_requirement = requirement_crud.get_requirement(db, requirement_id=requirement_id)
    if db_requirement is None:
        raise HTTPException(status_code=404, detail="Requirement not found")
    return db_requirement

@router.put("/{requirement_id}", response_model=Requirement)
def update_requirement(requirement_id: int, requirement: RequirementUpdate, db: Session = Depends(get_db)):
    db_requirement = requirement_crud.update_requirement(db, requirement_id=requirement_id, requirement=requirement)
    if db_requirement is None:
        raise HTTPException(status_code=404, detail="Requirement not found")
    return db_requirement

@router.delete("/{requirement_id}", response_model=bool)
def delete_requirement(requirement_id: int, db: Session = Depends(get_db)):
    success = requirement_crud.delete_requirement(db, requirement_id=requirement_id)
    if not success:
        raise HTTPException(status_code=404, detail="Requirement not found")
    return success

@router.get("/filter/", response_model=List[Requirement])
def filter_requirements(
    client_id: Optional[int] = None,
    location_id: Optional[int] = None,
    domain_id: Optional[int] = None,
    status_id: Optional[int] = None,
    priority: Optional[str] = None,
    created_after: Optional[datetime] = None,
    created_before: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    return requirement_crud.filter_requirements(
        db,
        client_id=client_id,
        location_id=location_id,
        domain_id=domain_id,
        status_id=status_id,
        priority=priority,
        created_after=created_after,
        created_before=created_before
    )
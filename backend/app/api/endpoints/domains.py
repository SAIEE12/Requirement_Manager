from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud
from app.database import get_db
from app.schemas.domain import Domain, DomainCreate, DomainUpdate

router = APIRouter()

@router.post("/", response_model=Domain)
def create_domain(domain: DomainCreate, db: Session = Depends(get_db)):
    db_domain = crud.domain.get_domain_by_name(db, name=domain.name)
    if db_domain:
        raise HTTPException(status_code=400, detail="Domain already registered")
    return crud.domain.create_domain(db=db, domain=domain)

@router.get("/", response_model=List[Domain])
def read_domains(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    domains = crud.domain.get_domains(db, skip=skip, limit=limit)
    return domains

@router.get("/{domain_id}", response_model=Domain)
def read_domain(domain_id: int, db: Session = Depends(get_db)):
    db_domain = crud.domain.get_domain(db, domain_id=domain_id)
    if db_domain is None:
        raise HTTPException(status_code=404, detail="Domain not found")
    return db_domain

@router.put("/{domain_id}", response_model=Domain)
def update_domain(domain_id: int, domain: DomainUpdate, db: Session = Depends(get_db)):
    db_domain = crud.domain.update_domain(db, domain_id=domain_id, domain=domain)
    if db_domain is None:
        raise HTTPException(status_code=404, detail="Domain not found")
    return db_domain

@router.delete("/{domain_id}", response_model=Domain)
def delete_domain(domain_id: int, db: Session = Depends(get_db)):
    db_domain = crud.domain.delete_domain(db, domain_id=domain_id)
    if db_domain is None:
        raise HTTPException(status_code=404, detail="Domain not found")
    return db_domain
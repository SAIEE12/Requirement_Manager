from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.domain import Domain, DomainCreate, DomainUpdate
from app.crud import domain as domain_crud
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=Domain)
def create_domain(domain: DomainCreate, db: Session = Depends(get_db)):
    db_domain = domain_crud.create_domain(db=db, domain=domain)
    if db_domain is None:
        raise HTTPException(status_code=400, detail="Domain with this name already exists and is active")
    return db_domain

@router.get("/", response_model=List[Domain])
def read_domains(skip: int = 0, limit: int = 100, include_inactive: bool = False, db: Session = Depends(get_db)):
    domains = domain_crud.get_domains(db, skip=skip, limit=limit, include_inactive=include_inactive)
    return [domain for domain in domains if domain is not None]

@router.get("/{domain_id}", response_model=Domain)
def read_domain(domain_id: int, db: Session = Depends(get_db)):
    db_domain = domain_crud.get_domain(db, domain_id=domain_id)
    if db_domain is None:
        raise HTTPException(status_code=404, detail="Domain not found")
    return db_domain

@router.put("/{domain_id}", response_model=Domain)
def update_domain(domain_id: int, domain: DomainUpdate, db: Session = Depends(get_db)):
    db_domain = domain_crud.update_domain(db, domain_id=domain_id, domain=domain)
    if db_domain is None:
        raise HTTPException(status_code=404, detail="Domain not found")
    return db_domain

@router.delete("/{domain_id}", response_model=Domain)
def delete_domain(domain_id: int, db: Session = Depends(get_db)):
    db_domain = domain_crud.delete_domain(db, domain_id=domain_id)
    if db_domain is None:
        raise HTTPException(status_code=404, detail="Domain not found")
    return db_domain

@router.post("/{domain_id}/reactivate", response_model=Domain)
def reactivate_domain(domain_id: int, db: Session = Depends(get_db)):
    db_domain = domain_crud.reactivate_domain(db, domain_id=domain_id)
    if db_domain is None:
        raise HTTPException(status_code=404, detail="Domain not found or already active")
    return db_domain
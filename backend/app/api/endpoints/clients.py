from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud
from app.schemas import client as client_schemas  # Import the client schemas
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=client_schemas.Client)
def create_client(client: client_schemas.ClientCreate, db: Session = Depends(get_db)):
    db_client = crud.client.get_client_by_email(db, email=client.email)
    if db_client:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.client.create_client(db=db, client=client)

@router.get("/", response_model=List[client_schemas.Client])
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clients = crud.client.get_clients(db, skip=skip, limit=limit)
    return clients

@router.get("/{client_id}", response_model=client_schemas.Client)
def read_client(client_id: int, db: Session = Depends(get_db)):
    db_client = crud.client.get_client(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.put("/{client_id}", response_model=client_schemas.Client)
def update_client(client_id: int, client: client_schemas.ClientUpdate, db: Session = Depends(get_db)):
    db_client = crud.client.update_client(db, client_id=client_id, client=client)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.delete("/{client_id}", response_model=client_schemas.Client)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    db_client = crud.client.delete_client(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client
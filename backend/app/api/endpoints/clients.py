from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.client import Client, ClientCreate, ClientUpdate
from app.crud import client as client_crud
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=Client)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    db_client, error_message = client_crud.create_client(db=db, client=client)
    if error_message:
        raise HTTPException(status_code=400, detail=error_message)
    return db_client

@router.get("/", response_model=List[Client])
def read_clients(skip: int = 0, limit: int = 100, include_inactive: bool = False, db: Session = Depends(get_db)):
    clients = client_crud.get_clients(db, skip=skip, limit=limit, include_inactive=include_inactive)
    return clients

@router.get("/{client_id}", response_model=Client)
def read_client(client_id: int, db: Session = Depends(get_db)):
    db_client = client_crud.get_client(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.put("/{client_id}", response_model=Client)
def update_client(client_id: int, client: ClientUpdate, db: Session = Depends(get_db)):
    db_client, error_message = client_crud.update_client(db, client_id=client_id, client=client)
    if error_message:
        if error_message == "Client not found.":
            raise HTTPException(status_code=404, detail=error_message)
        else:
            raise HTTPException(status_code=400, detail=error_message)
    return db_client

@router.delete("/{client_id}", response_model=Client)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    db_client, error_message = client_crud.delete_client(db, client_id=client_id)
    if error_message:
        raise HTTPException(status_code=404, detail=error_message)
    return db_client

@router.post("/{client_id}/reactivate", response_model=Client)
def reactivate_client(client_id: int, db: Session = Depends(get_db)):
    db_client, error_message = client_crud.reactivate_client(db, client_id=client_id)
    if error_message:
        if error_message == "Client not found.":
            raise HTTPException(status_code=404, detail=error_message)
        else:
            raise HTTPException(status_code=400, detail=error_message)
    return db_client
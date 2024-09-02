from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate
from datetime import datetime

def get_client(db: Session, client_id: int):
    return db.query(Client).filter(Client.id == client_id).first()

def get_client_by_email(db: Session, email: str):
    return db.query(Client).filter(Client.email == email).first()

def get_clients(db: Session, skip: int = 0, limit: int = 100, include_inactive: bool = False):
    query = db.query(Client)
    if not include_inactive:
        query = query.filter(Client.is_active == True)
    return query.offset(skip).limit(limit).all()

def create_client(db: Session, client: ClientCreate):
    db_client = Client(**client.dict())
    try:
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        return db_client, None
    except IntegrityError:
        db.rollback()
        return None, "A client with this email already exists."

def update_client(db: Session, client_id: int, client: ClientUpdate):
    db_client = get_client(db, client_id)
    if db_client:
        update_data = client.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_client, field, value)
        try:
            db.commit()
            db.refresh(db_client)
            return db_client, None
        except IntegrityError:
            db.rollback()
            return None, "A client with this email already exists."
    return None, "Client not found."

def delete_client(db: Session, client_id: int):
    db_client = get_client(db, client_id)
    if db_client:
        db_client.is_active = False
        db.commit()
        db.refresh(db_client)
        return db_client, None
    return None, "Client not found."

def reactivate_client(db: Session, client_id: int):
    db_client = get_client(db, client_id)
    if db_client:
        if db_client.is_active:
            return db_client, "Client is already active."
        db_client.is_active = True
        db.commit()
        db.refresh(db_client)
        return db_client, None
    return None, "Client not found."
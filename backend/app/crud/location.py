from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from app.models.location import Location
from app.schemas.location import LocationCreate, LocationUpdate
from datetime import datetime

def get_location(db: Session, location_id: int):
    return db.query(Location).filter(Location.id == location_id).first()

def get_location_by_name(db: Session, name: str):
    return db.query(Location).filter(Location.name == name).first()

def get_locations(db: Session, skip: int = 0, limit: int = 100, include_inactive: bool = False):
    query = db.query(Location)
    if not include_inactive:
        query = query.filter(Location.is_active == True)
    return query.offset(skip).limit(limit).all()

def create_location(db: Session, location: LocationCreate):
    now = datetime.utcnow()
    db_location = Location(**location.dict(), created_at=now, updated_at=now)
    try:
        db.add(db_location)
        db.commit()
        db.refresh(db_location)
        return db_location, None
    except IntegrityError as e:
        db.rollback()
        return None, "A location with this name already exists."

def update_location(db: Session, location_id: int, location: LocationUpdate):
    db_location = get_location(db, location_id)
    if db_location:
        update_data = location.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_location, field, value)
        db_location.updated_at = datetime.utcnow()
        try:
            db.commit()
            db.refresh(db_location)
            return db_location, None
        except IntegrityError as e:
            db.rollback()
            return None, "A location with this name already exists."
    return None, "Location not found."

def delete_location(db: Session, location_id: int):
    db_location = get_location(db, location_id)
    if db_location:
        db_location.is_active = False
        db_location.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_location)
        return db_location, None
    return None, "Location not found."

def reactivate_location(db: Session, location_id: int):
    db_location = get_location(db, location_id)
    if db_location:
        if db_location.is_active:
            return db_location, "Location is already active."
        db_location.is_active = True
        db_location.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_location)
        return db_location, None
    return None, "Location not found."
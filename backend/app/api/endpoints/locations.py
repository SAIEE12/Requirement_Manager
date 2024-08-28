from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud
from app.database import get_db
from app.schemas.location import Location, LocationCreate, LocationUpdate

router = APIRouter()

@router.post("/", response_model=Location)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    db_location = crud.location.get_location_by_name(db, name=location.name)
    if db_location:
        raise HTTPException(status_code=400, detail="Location already registered")
    return crud.location.create_location(db=db, location=location)

@router.get("/", response_model=List[Location])
def read_locations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    locations = crud.location.get_locations(db, skip=skip, limit=limit)
    return locations

@router.get("/{location_id}", response_model=Location)
def read_location(location_id: int, db: Session = Depends(get_db)):
    db_location = crud.location.get_location(db, location_id=location_id)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location

@router.put("/{location_id}", response_model=Location)
def update_location(location_id: int, location: LocationUpdate, db: Session = Depends(get_db)):
    db_location = crud.location.update_location(db, location_id=location_id, location=location)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location

@router.delete("/{location_id}", response_model=Location)
def delete_location(location_id: int, db: Session = Depends(get_db)):
    db_location = crud.location.delete_location(db, location_id=location_id)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location
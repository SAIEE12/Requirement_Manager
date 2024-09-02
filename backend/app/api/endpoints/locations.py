from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.location import LocationCreate, LocationUpdate, LocationResponse
from app.crud import location as location_crud
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=LocationResponse)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    db_location, error_message = location_crud.create_location(db=db, location=location)
    if error_message:
        raise HTTPException(status_code=400, detail=error_message)
    return db_location

@router.get("/", response_model=List[LocationResponse])
def read_locations(skip: int = 0, limit: int = 100, include_inactive: bool = False, db: Session = Depends(get_db)):
    locations = location_crud.get_locations(db, skip=skip, limit=limit, include_inactive=include_inactive)
    return locations

@router.get("/{location_id}", response_model=LocationResponse)
def read_location(location_id: int, db: Session = Depends(get_db)):
    db_location = location_crud.get_location(db, location_id=location_id)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location

@router.put("/{location_id}", response_model=LocationResponse)
def update_location(location_id: int, location: LocationUpdate, db: Session = Depends(get_db)):
    db_location, error_message = location_crud.update_location(db, location_id=location_id, location=location)
    if error_message:
        if error_message == "Location not found.":
            raise HTTPException(status_code=404, detail=error_message)
        else:
            raise HTTPException(status_code=400, detail=error_message)
    return db_location

@router.delete("/{location_id}", response_model=LocationResponse)
def delete_location(location_id: int, db: Session = Depends(get_db)):
    db_location, error_message = location_crud.delete_location(db, location_id=location_id)
    if error_message:
        raise HTTPException(status_code=404, detail=error_message)
    return db_location

@router.post("/{location_id}/reactivate", response_model=LocationResponse)
def reactivate_location(location_id: int, db: Session = Depends(get_db)):
    db_location, error_message = location_crud.reactivate_location(db, location_id=location_id)
    if error_message:
        if error_message == "Location not found.":
            raise HTTPException(status_code=404, detail=error_message)
        else:
            raise HTTPException(status_code=400, detail=error_message)
    return db_location
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.status import Status, StatusCreate, StatusUpdate, StatusDeleteResponse
from app.crud.status import create_status, get_status, get_statuses, update_status, delete_status, can_delete_status
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=Status)
def create_status_endpoint(status: StatusCreate, db: Session = Depends(get_db)):
    db_status = create_status(db=db, status=status)
    if db_status is None:
        raise HTTPException(status_code=400, detail="Status with this name already exists")
    return db_status

@router.get("/{status_id}", response_model=Status)
def read_status_endpoint(status_id: int, db: Session = Depends(get_db)):
    db_status = get_status(db, status_id=status_id)
    if db_status is None:
        raise HTTPException(status_code=404, detail=f"Status with id {status_id} not found")
    return db_status

@router.get("/", response_model=List[Status])
def read_statuses_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    statuses = get_statuses(db, skip=skip, limit=limit)
    return statuses

@router.put("/{status_id}", response_model=Status)
def update_status_endpoint(status_id: int, status: StatusUpdate, db: Session = Depends(get_db)):
    db_status = update_status(db, status_id=status_id, status=status)
    if db_status is None:
        raise HTTPException(status_code=404, detail=f"Status with id {status_id} not found or update failed due to constraints")
    return db_status

@router.delete("/{status_id}", response_model=StatusDeleteResponse)
def delete_status_endpoint(status_id: int, db: Session = Depends(get_db)):
    if not can_delete_status(db, status_id):
        db_status = delete_status(db, status_id=status_id)
        if db_status is None:
            raise HTTPException(status_code=404, detail=f"Status with id {status_id} not found")
        
        # Convert SQLAlchemy model to Pydantic model
        status_pydantic = Status.from_orm(db_status)
        message = f"Status with id {status_id} has been deactivated due to existing references. It will no longer appear in active status lists."
        return StatusDeleteResponse(status=status_pydantic, message=message)
    else:
        # For hard deletion, we don't have a db_status to return
        delete_status(db, status_id=status_id)
        message = f"Status with id {status_id} has been permanently deleted."
        # Create a dummy Status object for the response
        deleted_status = Status(id=status_id, name="Deleted", description="This status has been deleted", is_active=False)
        return StatusDeleteResponse(status=deleted_status, message=message)


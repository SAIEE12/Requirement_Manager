from sqlalchemy.orm import Session
from app.models.status import Status
from app.crud.status import create_status
from app.schemas.status import StatusCreate

def populate_statuses(db: Session):
    statuses = [
        {"name": "Active", "description": "The requirement is currently active and open for applications", "is_active": True},
        {"name": "On Hold", "description": "The requirement is temporarily paused", "is_active": True},
        {"name": "Closed", "description": "The requirement is no longer accepting applications", "is_active": True},
        {"name": "Filled", "description": "The position for this requirement has been filled", "is_active": True},
        {"name": "Cancelled", "description": "The requirement has been cancelled and is no longer valid", "is_active": True},
        {"name": "Archived", "description": "An old status that is no longer in use", "is_active": False},
        {"name": "Deprecated", "description": "A status that has been phased out", "is_active": False}
    ]

    for status_data in statuses:
        status = StatusCreate(**status_data)
        db_status = create_status(db, status)
        if db_status:
            print(f"Created status: {db_status.name} (Active: {db_status.is_active})")
        else:
            print(f"Status {status.name} already exists or couldn't be created")

def run_status_population(db: Session):
    existing_statuses = db.query(Status).all()
    if not existing_statuses:
        populate_statuses(db)
    else:
        print("Status table already populated.")
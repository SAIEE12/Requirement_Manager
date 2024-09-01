from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.status import Status
from app.schemas.status import StatusCreate, StatusUpdate
from app.models.requirement import Requirement

def create_status(db: Session, status: StatusCreate):
    existing_status = db.query(Status).filter(Status.name == status.name).first()
    if existing_status:
        return None
    db_status = Status(**status.dict())
    db.add(db_status)
    try:
        db.commit()
        db.refresh(db_status)
    except IntegrityError:
        db.rollback()
        return None
    return db_status

def get_status(db: Session, status_id: int):
    return db.query(Status).filter(Status.id == status_id).first()

def get_status_by_name(db: Session, name: str):
    return db.query(Status).filter(Status.name == name).first()

def get_statuses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Status).offset(skip).limit(limit).all()

def update_status(db: Session, status_id: int, status: StatusUpdate):
    db_status = db.query(Status).filter(Status.id == status_id).first()
    if db_status:
        update_data = status.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_status, key, value)
        try:
            db.commit()
            db.refresh(db_status)
        except IntegrityError:
            db.rollback()
            return None
    return db_status

def can_delete_status(db: Session, status_id: int):
    requirements = db.query(Requirement).filter(Requirement.status_id == status_id).count()
    return requirements == 0

def delete_status(db: Session, status_id: int):
    db_status = db.query(Status).filter(Status.id == status_id).first()
    if db_status:
        if can_delete_status(db, status_id):
            db.delete(db_status)
            db.commit()
            return None  # Indicate that the status was hard deleted
        else:
            db_status.is_active = False
            db.commit()
            db.refresh(db_status)
        return db_status
    return None
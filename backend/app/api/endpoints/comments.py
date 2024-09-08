# app/api/endpoints/comments.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/requirements/{requirement_id}/comments", response_model=List[schemas.Comment])
def read_comments(
    requirement_id: int,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    comments = crud.comment.get_comments(db, requirement_id=requirement_id, skip=skip, limit=limit)
    return comments

@router.post("/requirements/{requirement_id}/comments", response_model=schemas.Comment)
def create_comment(
    requirement_id: int,
    comment_in: schemas.CommentCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud.comment.create_comment(db=db, comment=comment_in, requirement_id=requirement_id, user_id=current_user.id)

@router.put("/comments/{comment_id}", response_model=schemas.Comment)
def update_comment(
    comment_id: int,
    comment_in: schemas.CommentUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    db_comment = crud.comment.update_comment(db, comment_id=comment_id, comment=comment_in)
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return db_comment

@router.delete("/comments/{comment_id}", response_model=bool)
def delete_comment(
    comment_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    success = crud.comment.delete_comment(db, comment_id=comment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found")
    return success
# app/api/endpoints/comments.py

from fastapi import APIRouter, Depends, HTTPException, Request, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from jose import jwt, JWTError
from app.database import get_db

router = APIRouter()

@router.get("/requirements/{requirement_id}/comments", response_model=List[schemas.Comment])
async def read_comments(
    request: Request,
    requirement_id: int,
    skip: int = 0,
    limit: int = 100
):
    db = next(get_db())
    try:
        await deps.get_current_active_user(request)  # Ensure user is authenticated
        comments_with_username = crud.comment.get_comments(db, requirement_id=requirement_id, skip=skip, limit=limit)
        
        # Convert the result to the expected schema
        comments = [
            schemas.Comment(
                id=comment.id,
                content=comment.content,
                requirement_id=comment.requirement_id,
                user_id=comment.user_id,
                created_at=comment.created_at,
                username=username
            )
            for comment, username in comments_with_username
        ]
        
        return comments
    finally:
        db.close()

@router.post("/requirements/{requirement_id}/comments", response_model=schemas.Comment)
async def create_comment(
    request: Request,
    requirement_id: int,
    comment_in: schemas.CommentCreate
):
    db = next(get_db())
    try:
        current_user = await deps.get_current_active_user(request)
        db_comment = crud.comment.create_comment(
            db=db,
            comment=comment_in,
            requirement_id=requirement_id,
            user_id=current_user.id
        )
        return db_comment
    finally:
        db.close()


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
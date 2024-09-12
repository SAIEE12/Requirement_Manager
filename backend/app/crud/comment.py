# app/crud/comment.py

from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate

def get_comments(db: Session, requirement_id: int, skip: int = 0, limit: int = 100):
    return db.query(Comment).filter(Comment.requirement_id == requirement_id).offset(skip).limit(limit).all()

def create_comment(db: Session, comment: CommentCreate, requirement_id: int, user_id: int):
    db_comment = Comment(
        content=comment.content,
        requirement_id=requirement_id,
        user_id=user_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def update_comment(db: Session, comment_id: int, comment: CommentUpdate):
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if db_comment:
        update_data = comment.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_comment, key, value)
        db.commit()
        db.refresh(db_comment)
    return db_comment

def delete_comment(db: Session, comment_id: int):
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if db_comment:
        db.delete(db_comment)
        db.commit()
        return True
    return False
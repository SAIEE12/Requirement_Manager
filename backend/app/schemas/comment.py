# app/schemas/comment.py

from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentUpdate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    requirement_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
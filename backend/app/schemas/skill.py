from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SkillBase(BaseModel):
    name: Optional[str] = None
    domain_id: Optional[int] = None
    is_active: Optional[bool] = True

class SkillCreate(SkillBase):
    name: str
    domain_id: int

class SkillUpdate(SkillBase):
    pass

class SkillInDBBase(SkillBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Skill(SkillInDBBase):
    pass

class SkillInDB(SkillInDBBase):
    pass
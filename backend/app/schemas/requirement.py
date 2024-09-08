from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional
from app.schemas.comment import Comment

class SkillBase(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class LocationBase(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class ClientBase(BaseModel):
    id: int
    name: str
    industry: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True

class RequirementBase(BaseModel):
    description: str
    client_id: int
    experience_min: int
    experience_max: int
    location_id: int
    domain_id: int
    status_id: int
    notes: Optional[str] = None
    priority: str
    expected_start_date: Optional[date] = None
    expected_end_date: Optional[date] = None
    required_resources: Optional[int] = None

class RequirementCreate(RequirementBase):
    skill_ids: List[int]

class RequirementUpdate(RequirementBase):
    skill_ids: Optional[List[int]] = None

class Requirement(RequirementBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    skills: List[SkillBase]
    location: LocationBase
    client: ClientBase
    comments: List[Comment]

    class Config:
        from_attributes = True
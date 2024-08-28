from pydantic import BaseModel, Field
from typing import Optional

class RequirementBase(BaseModel):
    description: str
    client_id: int
    experience_min: int = Field(..., ge=0)
    experience_max: int = Field(..., ge=0)
    location_id: int
    notes: Optional[str] = None

class RequirementCreate(RequirementBase):
    pass

class RequirementUpdate(BaseModel):
    description: Optional[str] = None
    client_id: Optional[int] = None
    experience_min: Optional[int] = Field(None, ge=0)
    experience_max: Optional[int] = Field(None, ge=0)
    location_id: Optional[int] = None
    notes: Optional[str] = None

class RequirementInDB(RequirementBase):
    id: int

    class Config:
        orm_mode = True

class Requirement(RequirementInDB):
    client_name: Optional[str] = None
    location_name: Optional[str] = None
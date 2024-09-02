from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LocationBase(BaseModel):
    name: str
    country: str
    description: Optional[str] = None

class LocationCreate(LocationBase):
    is_active: bool = True

class LocationUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class LocationInDBBase(LocationBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Location(LocationInDBBase):
    pass

class LocationInDB(LocationInDBBase):
    pass

class LocationResponse(LocationInDBBase):
    pass
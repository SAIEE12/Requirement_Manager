from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ClientBase(BaseModel):
    name: str
    industry: str
    contact_person: str
    email: EmailStr
    phone: str

class ClientCreate(ClientBase):
    is_active: bool = True

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None

class ClientInDBBase(ClientBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Client(ClientInDBBase):
    pass

class ClientInDB(ClientInDBBase):
    pass
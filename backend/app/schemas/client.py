# app/schemas/client.py
from pydantic import BaseModel, EmailStr

class ClientBase(BaseModel):
    name: str
    industry: str
    contact_person: str
    email: EmailStr
    phone: str

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class Client(ClientBase):
    id: int

    class Config:
        orm_mode = True
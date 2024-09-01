from pydantic import BaseModel

class StatusBase(BaseModel):
    name: str
    description: str
    is_active: bool = True

class StatusCreate(StatusBase):
    pass

class StatusUpdate(StatusBase):
    pass

class Status(StatusBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True  # This is for newer versions of Pydantic

class StatusDeleteResponse(BaseModel):
    status: Status
    message: str
from pydantic import BaseModel

class LocationBase(BaseModel):
    name: str
    country: str
    description: str | None = None

class LocationCreate(LocationBase):
    pass

class LocationUpdate(LocationBase):
    pass

class Location(LocationBase):
    id: int

    class Config:
        from_attributes = True
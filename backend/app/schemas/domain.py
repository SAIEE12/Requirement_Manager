from pydantic import BaseModel

class DomainBase(BaseModel):
    name: str
    description: str | None = None

class DomainCreate(DomainBase):
    pass

class DomainUpdate(DomainBase):
    pass

class Domain(DomainBase):
    id: int

    class Config:
        from_attributes = True
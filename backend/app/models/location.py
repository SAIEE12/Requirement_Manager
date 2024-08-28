from sqlalchemy import Column, Integer, String
from app.database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    country = Column(String)
    description = Column(String, nullable=True)
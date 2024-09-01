from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    experience_min = Column(Integer, nullable=False)
    experience_max = Column(Integer, nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    status_id = Column(Integer, ForeignKey("statuses.id"), nullable=False)
    notes = Column(Text)

    # Relationships
    client = relationship("Client", back_populates="requirements")
    location = relationship("Location", back_populates="requirements")
    status = relationship("Status", back_populates="requirements")
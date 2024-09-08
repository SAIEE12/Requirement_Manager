from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.models.associations import requirement_skill

class Requirement(Base):
    __tablename__ = "requirements"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    experience_min = Column(Integer, nullable=False)
    experience_max = Column(Integer, nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    status_id = Column(Integer, ForeignKey("statuses.id"), nullable=False)
    notes = Column(Text)
    priority = Column(String, nullable=False)
    expected_start_date = Column(Date)
    expected_end_date = Column(Date)
    required_resources = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    client = relationship("Client", back_populates="requirements")
    location = relationship("Location", back_populates="requirements")
    domain = relationship("Domain", back_populates="requirements")
    status = relationship("Status", back_populates="requirements")
    skills = relationship("Skill", secondary=requirement_skill, back_populates="requirements")
    comments = relationship("Comment", back_populates="requirement")
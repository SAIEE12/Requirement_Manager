# app/models/client.py
from sqlalchemy import Column, Integer, String
from app.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    industry = Column(String)
    contact_person = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
# app/models/associations.py
from sqlalchemy import Table, Column, Integer, ForeignKey
from app.database import Base

requirement_skill = Table('requirement_skill', Base.metadata,
    Column('requirement_id', Integer, ForeignKey('requirements.id')),
    Column('skill_id', Integer, ForeignKey('skills.id'))
)
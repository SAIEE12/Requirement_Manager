# app/models/__init__.py
from app.database import Base
from .client import Client
from .domain import Domain
from .location import Location
from .requirement import Requirement
from .role import Role
from .skill import Skill
from .status import Status
from .user import User
from .associations import requirement_skill

# Explicitly export all models
__all__ = [
    "Client", "Domain", "Location", "Requirement", "Role", 
    "Skill", "Status", "User", "requirement_skill"
]
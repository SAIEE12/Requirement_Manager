from sqlalchemy.orm import Session
from app.models.role import Role
from app.crud.role import create_role
from app.schemas.role import RoleCreate

def populate_roles(db: Session):
    roles = [
        {"name": "Admin", "description": "Administrator with full access"},
        {"name": "Sales", "description": "Sales team member"},
        {"name": "Sourcing", "description": "Sourcing team member"},
        {"name": "Delivery", "description": "Delivery team member"},
    ]

    created_roles = []
    for role_data in roles:
        role_in_db = db.query(Role).filter(Role.name == role_data["name"]).first()
        if not role_in_db:
            role = RoleCreate(**role_data)
            created_role = create_role(db, role)
            created_roles.append(created_role)
            print(f"Created role: {role_data['name']}")
        else:
            print(f"Role already exists: {role_data['name']}")
    
    return created_roles
import random
import string
from sqlalchemy.orm import Session
from app.crud.user import create_user, get_user_by_email
from app.schemas.user import UserCreate
from app.crud.role import get_roles

def generate_random_string(length):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def populate_users(db: Session, num_users: int):
    roles = get_roles(db)
    if not roles:
        print("No roles found. Please populate roles first.")
        return []

    created_users = []
    for i in range(num_users):
        username = f"user_{generate_random_string(5)}"
        email = f"{username}@example.com"
        password = generate_random_string(10)
        first_name = f"First{i}"
        last_name = f"Last{i}"
        role = random.choice(roles)

        user = UserCreate(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role_id=role.id
        )

        # Check if user with this email already exists
        existing_user = get_user_by_email(db, email=email)
        if existing_user:
            print(f"User with email {email} already exists. Skipping.")
            continue

        db_user = create_user(db, user)
        created_users.append(db_user)
        print(f"Created user: {username}")

    return created_users
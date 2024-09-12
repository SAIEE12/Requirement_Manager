# app/api/deps.py

from fastapi import HTTPException, status, Request
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app import crud, models
from app.schemas.token import TokenData  # Update this line
from app.core import security
from app.core.config import settings
from app.database import get_db

async def get_current_user(request: Request) -> models.User:
    # Get the authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract the token
    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenData(username=payload.get("sub"), user_id=payload.get("user_id"))
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db = next(get_db())
    try:
        user = crud.user.get(db, id=token_data.user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    finally:
        db.close()

async def get_current_active_user(request: Request) -> models.User:
    current_user = await get_current_user(request)
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
# app/api/endpoints/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.crud.auth import authenticate_user
from app.core.security import create_access_token
from app.schemas.auth import Token, TokenData
from app.database import get_db
from app.core.config import settings

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Authenticate user and provide access token.
    """
    try:
        user = authenticate_user(db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = TokenData(username=user.username, user_id=user.id)
        access_token = create_user_token(token_data)
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your request."
        )

def create_user_token(token_data: TokenData) -> str:
    """
    Create an access token for the user.
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_access_token(
        data={"sub": token_data.username, "user_id": token_data.user_id},
        expires_delta=access_token_expires
    )
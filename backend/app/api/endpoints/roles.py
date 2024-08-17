from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.role import Role, RoleCreate, RoleUpdate
from app.crud.role import get_role, get_role_by_name, get_roles, create_role, update_role, delete_role
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=Role, status_code=status.HTTP_201_CREATED)
async def create_role_endpoint(role: RoleCreate, db: Session = Depends(get_db)):
    """
    Create a new role.

    Args:
        role (RoleCreate): The role data.
        db (Session): The database session.

    Returns:
        Role: The created role.

    Raises:
        HTTPException: If the role already exists or if there's a server error.
    """
    try:
        db_role = get_role_by_name(db, name=role.name)
        if db_role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role already exists"
            )
        return create_role(db=db, role=role)
    except HTTPException as http_exc:
        # Re-raise HTTP exceptions (like our 400 Bad Request)
        raise http_exc
    except Exception as e:
        # Handle any other unexpected exceptions
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the role: {str(e)}"
        )

@router.get("/", response_model=List[Role])
async def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of roles.

    Args:
        skip (int): Number of roles to skip (for pagination).
        limit (int): Maximum number of roles to return.
        db (Session): The database session.

    Returns:
        List[Role]: A list of roles.
    """
    try:
        return get_roles(db, skip=skip, limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving roles: {str(e)}"
        )

@router.get("/{role_id}", response_model=Role)
async def read_role(role_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific role by ID.

    Args:
        role_id (int): The ID of the role to retrieve.
        db (Session): The database session.

    Returns:
        Role: The requested role.

    Raises:
        HTTPException: If the role is not found.
    """
    try:
        db_role = get_role(db, role_id=role_id)
        if db_role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found"
            )
        return db_role
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving the role: {str(e)}"
        )

@router.put("/{role_id}", response_model=Role)
async def update_role_endpoint(role_id: int, role: RoleUpdate, db: Session = Depends(get_db)):
    """
    Update a specific role.

    Args:
        role_id (int): The ID of the role to update.
        role (RoleUpdate): The updated role data.
        db (Session): The database session.

    Returns:
        Role: The updated role.

    Raises:
        HTTPException: If the role is not found.
    """
    try:
        db_role = update_role(db, role_id=role_id, role=role)
        if db_role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found"
            )
        return db_role
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the role: {str(e)}"
        )

@router.delete("/{role_id}", response_model=Role)
async def delete_role_endpoint(role_id: int, db: Session = Depends(get_db)):
    """
    Delete a specific role.

    Args:
        role_id (int): The ID of the role to delete.
        db (Session): The database session.

    Returns:
        Role: The deleted role.

    Raises:
        HTTPException: If the role is not found.
    """
    try:
        db_role = delete_role(db, role_id=role_id)
        if db_role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found"
            )
        return db_role
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the role: {str(e)}"
        )
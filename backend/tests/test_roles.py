import pytest
from app.schemas.role import RoleCreate

def test_create_role(client_with_db):
    response = client_with_db.post(
        "/api/roles/",
        json={"name": "Test Role", "description": "A test role"}
    )
    print(f"Response status: {response.status_code}")
    print(f"Response content: {response.content}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Role"
    assert "id" in data

def test_read_roles(client_with_db):
    response = client_with_db.get("/api/roles/")
    print(f"Response status: {response.status_code}")
    print(f"Response content: {response.content}")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
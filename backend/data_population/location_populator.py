from sqlalchemy.orm import Session
from app.crud.location import create_location, get_location_by_name
from app.schemas.location import LocationCreate

def populate_locations(db: Session):
    locations = [
        {"name": "Hyderabad", "country": "India", "description": "City in Telangana, India"},
        {"name": "Bangalore", "country": "India", "description": "Capital of Karnataka, India"},
        {"name": "Noida", "country": "India", "description": "City in Uttar Pradesh, India"},
        {"name": "Chennai", "country": "India", "description": "Capital of Tamil Nadu, India"},
        {"name": "Singapore", "country": "Singapore", "description": "City-state in Southeast Asia"},
        {"name": "Kuala Lumpur", "country": "Malaysia", "description": "Capital of Malaysia"},
        {"name": "Ho Chi Minh City", "country": "Vietnam", "description": "Largest city in Vietnam"},
    ]

    for location_data in locations:
        location = LocationCreate(**location_data)
        existing_location = get_location_by_name(db, name=location.name)
        if not existing_location:
            create_location(db, location)
            print(f"Created location: {location.name}")
        else:
            print(f"Location {location.name} already exists, skipping.")
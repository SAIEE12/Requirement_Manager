from sqlalchemy.orm import Session
from app.crud.location import create_location, get_location_by_name
from app.schemas.location import LocationCreate
from datetime import datetime

def populate_locations(db: Session):
    locations = [
        {"name": "Bangalore", "country": "India", "description": "Silicon Valley of India"},
        {"name": "Hyderabad", "country": "India", "description": "City of Pearls"},
        {"name": "Noida", "country": "India", "description": "Planned city in NCR"},
        {"name": "Chennai", "country": "India", "description": "Detroit of India"},
        {"name": "Pune", "country": "India", "description": "Oxford of the East"},
        {"name": "Singapore", "country": "Singapore", "description": "Lion City"},
        {"name": "Penang", "country": "Malaysia", "description": "Pearl of the Orient"},
        {"name": "Ho Chi Minh City", "country": "Vietnam", "description": "Formerly Saigon"},
        {"name": "California", "country": "USA", "description": "Golden State"}, 
        {"name": "N/A", "country": "none", "description": "none"}

    ]

    for location_data in locations:
        existing_location = get_location_by_name(db, location_data["name"])
        if not existing_location:
            location = LocationCreate(**location_data, is_active=True)
            create_location(db, location)
            print(f"Created location: {location.name}")
        else:
            print(f"Location {location_data['name']} already exists")

def run_location_population(db: Session):
    print("Populating locations...")
    populate_locations(db)
    print("Location population completed")
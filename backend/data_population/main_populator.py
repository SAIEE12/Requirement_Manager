import os
import sys

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from data_population.role_populator import populate_roles

# Import other populators here as they are created
# from data_population.user_populator import populate_users
# from data_population.requirement_populator import populate_requirements

def run_population(db: Session):
    # Run all populators
    populate_roles(db)
    # Add other populators here as they are created
    # populate_users(db)
    # populate_requirements(db)

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_population(db)
        print("Data population completed successfully.")
    except Exception as e:
        print(f"An error occurred during data population: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
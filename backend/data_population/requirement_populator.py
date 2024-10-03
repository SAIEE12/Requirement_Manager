# data_population/requirement_populator.py
from sqlalchemy.orm import Session
from app.models import Requirement, Client, Location, Domain, Status, Skill, User
from app.schemas.requirement import RequirementCreate
import random
from datetime import date, timedelta
import pandas as pd
import re
import glob
import os
import math


# Folder path where Excel files are located
folder_path = '/home/shashank/Bitsilica/Requirement_Manager/Excel_code'

# Get all Excel files in the folder (with .xlsx extension)
excel_files = glob.glob(os.path.join(folder_path, "*.xlsx"))

# Function to extract client, location, and experience (min and max) from text
def extract_details(text):
    client = location = min_experience = max_experience = None
    if isinstance(text, str):
        client_match = re.search(r'Client:\s*(\w+)', text)
        
        # Update location regex to avoid capturing the "Experience" part
        location_match = re.search(r'Location:\s*([\w\s]+?)(?=\s*Experience)', text)
        
        # Extract experience as a range or a single number
        experience_match = re.search(r'Experience:\s*(\d+)(?:\s*-\s*(\d+))?', text)
        
        client = client_match.group(1) if client_match else None
        location = location_match.group(1).strip() if location_match else None  # Strip any extra spaces
        
        # If experience is found
        if experience_match:
            min_experience = int(experience_match.group(1))
            if experience_match.group(2):  # If there's a range, capture the second value
                max_experience = int(experience_match.group(2))
            else:  # If it's a single value
                if min_experience % 5 == 0:  # If min_experience is a multiple of 5
                    max_experience = min_experience + 5
                else:
                    max_experience = math.ceil(min_experience / 5) * 5
    
    return client, location, min_experience, max_experience




def populate_requirements(db: Session):
    clients = db.query(Client).all()
    locations = db.query(Location).all()
    domains = db.query(Domain).all()
    statuses = db.query(Status).all()
    skills = db.query(Skill).all()
    priorities = ["High", "Medium", "Low"]

    # Loop through all Excel files
    for file in excel_files:
        print(f"Processing file: {file}")
        xls = pd.ExcelFile(file)

        # Loop through all sheets to extract the data
        for sheet in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet)
            
            # Apply the extraction function to the relevant column in each sheet
            df[['Client', 'Location', 'MinExperience', 'MaxExperience']] = df.iloc[:, 0].apply(lambda x: pd.Series(extract_details(x)))
            
            # Filter only the necessary columns and drop rows with missing values
            df_filtered = df[['Client', 'Location', 'MinExperience', 'MaxExperience']].dropna()
            df_filtered['Title'] = sheet  # Add the sheet name for tracking

            # Insert the filtered data into the database using SQLAlchemy
            for _, row in df_filtered.iterrows():
                client_name, location_name, min_experience, max_experience = row['Client'], row['Location'], row['MinExperience'], row['MaxExperience']

                # Find the matching client, location from the database
                client = next((c for c in clients if c.name == client_name), random.choice(clients))
                location = next((l for l in locations if l.name == location_name), random.choice(locations))

                # If min/max experience are not found in the text, randomize them
                if min_experience is None:
                    min_experience = random.randint(1, 10)
                if max_experience is None:
                    max_experience = min_experience + random.randint(0, 5)

                domain = random.choice(domains)
                status = random.choice(statuses)
                selected_skills = random.sample(skills, k=random.randint(1, 5))
                start_date = date.today() + timedelta(days=random.randint(0, 60))
                end_date = start_date + timedelta(days=random.randint(30, 180))

                requirement = RequirementCreate(
                    description=f"Sample requirement for {client.name}",
                    client_id=client.id,
                    experience_min=min_experience,
                    experience_max=max_experience,
                    location_id=location.id,
                    domain_id=domain.id,
                    status_id=status.id,
                    notes="Sample notes for the requirement",
                    priority=random.choice(priorities),
                    expected_start_date=start_date,
                    expected_end_date=end_date,
                    required_resources=random.randint(1, 10),
                    skill_ids=[skill.id for skill in selected_skills]
                )

                db_requirement = Requirement(**requirement.dict(exclude={'skill_ids'}))
                db.add(db_requirement)
                db.commit()
                db.refresh(db_requirement)

                for skill_id in requirement.skill_ids:
                    skill = db.query(Skill).filter(Skill.id == skill_id).first()
                    if skill:
                        db_requirement.skills.append(skill)

                db.commit()
                print(f"Created requirement for {client.name}")


# If you have a separate function to run the population, keep it:
def run_requirement_population(db: Session):
    print("Populating requirements from Excel files...")
    populate_requirements(db)
    print("Requirement population completed")

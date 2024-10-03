#Without Range in Exp

import pandas as pd
import sqlite3
import re
import glob
import os
import math

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

# Folder path where Excel files are located
folder_path = '/home/shashank/Bitsilica/Tool'

# Get all Excel files in the folder (with .xlsx extension)
excel_files = glob.glob(os.path.join(folder_path, "*.xlsx"))

# Prepare the SQLite database
db_path = '/home/shashank/Bitsilica/Tool/clients_data.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create table for storing the data with min and max experience columns
cursor.execute('''
    CREATE TABLE IF NOT EXISTS ClientData (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Client TEXT,
        Location TEXT,
        MinExperience INTEGER,
        MaxExperience INTEGER,
        Title TEXT
    )
''')

# Step 4: Loop through each Excel file
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
        
        # Insert the filtered data into the SQLite database
        for _, row in df_filtered.iterrows():
            cursor.execute('''
                INSERT INTO ClientData (Client, Location, MinExperience, MaxExperience, Title)
                VALUES (?, ?, ?, ?, ?)
            ''', (row['Client'], row['Location'], row['MinExperience'], row['MaxExperience'], row['Title']))

# Commit changes and close the connection
conn.commit()
conn.close()

print("Data has been extracted and populated into the SQLite database.")







#Without Range in Exp

# import pandas as pd
# import sqlite3
# import re
# import glob
# import os

# # Function to extract client, location, and experience from text

# def extract_details(text):
#     client = location = experience = None
#     if isinstance(text, str):
#         client_match = re.search(r'Client:\s*(\w+)', text)
#         # location_match = re.search(r'Location:\s*([\w\s]+)', text)
#         location_match = re.search(r'Location:\s*([\w\s]+?)(?=\s*Experience)', text)
#         experience_match = re.search(r'Experience:\s*([\d\+\-\s]+)', text)
        
#         client = client_match.group(1) if client_match else None
#         location = location_match.group(1) if location_match else None
#         experience = experience_match.group(1) if experience_match else None
    
#     return client, location, experience

# # Folder path where Excel files are located
# folder_path = '/home/shashank/Bitsilica/Tool'

# # Get all Excel files in the folder (with .xlsx extension)
# excel_files = glob.glob(os.path.join(folder_path, "*.xlsx"))

# # Prepare the SQLite database
# db_path = '/home/shashank/Bitsilica/Tool/clients_data.db'
# conn = sqlite3.connect(db_path)
# cursor = conn.cursor()

# # Create table for storing the data
# cursor.execute('''
#     CREATE TABLE IF NOT EXISTS ClientData (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         Client TEXT,
#         Location TEXT,
#         Experience TEXT,
#         Title TEXT
#     )
# ''')

# # Step 4: Loop through each Excel file
# for file in excel_files:
#     print(f"Processing file: {file}")
#     xls = pd.ExcelFile(file)

#     # Loop through all sheets to extract the data
#     for sheet in xls.sheet_names:
#         df = pd.read_excel(xls, sheet_name=sheet)
        
#         # Apply the extraction function to the relevant column in each sheet
#         df[['Client', 'Location', 'Experience']] = df.iloc[:, 0].apply(lambda x: pd.Series(extract_details(x)))
        
#         # Filter only the necessary columns and drop rows with missing values
#         df_filtered = df[['Client', 'Location', 'Experience']].dropna()
#         df_filtered['Title'] = sheet  # Add the sheet name for tracking
        
#         # Insert the filtered data into the SQLite database
#         for _, row in df_filtered.iterrows():
#             cursor.execute('''
#                 INSERT INTO ClientData (Client, Location, Experience, Title)
#                 VALUES (?, ?, ?, ?)
#             ''', (row['Client'], row['Location'], row['Experience'], row['Title']))

# # Commit changes and close the connection
# conn.commit()
# conn.close()

# print("Data has been extracted and populated into the SQLite database.")

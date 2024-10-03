import pandas as pd
import sqlite3
import re

# Function to extract client, location, and experience from text
def extract_details(text):
    client = location = experience = None
    if isinstance(text, str):
        client_match = re.search(r'Client:\s*(\w+)', text)
        location_match = re.search(r'Location:\s*([\w\s]+)', text)
        experience_match = re.search(r'Experience:\s*([\d\+]+)', text)
        
        client = client_match.group(1) if client_match else None
        location = location_match.group(1) if location_match else None
        experience = experience_match.group(1) if experience_match else None
    
    return client, location, experience

# Load the Excel file
file_path = '/home/shashank/Bitsilica/Tool/LGSoft.xlsx'
xls = pd.ExcelFile(file_path)

# Prepare the SQLite database
db_path = '/home/shashank/Bitsilica/Tool/clients1_data.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create table for storing the data
cursor.execute('''
    CREATE TABLE IF NOT EXISTS ClientData (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Client TEXT,
        Location TEXT,
        Experience TEXT,
        Title TEXT
    )
''')

# Loop through all sheets to extract the data
for sheet in xls.sheet_names:
    df = pd.read_excel(xls, sheet_name=sheet)
    
    # Apply the extraction function to the relevant column in each sheet
    df[['Client', 'Location', 'Experience']] = df.iloc[:, 0].apply(lambda x: pd.Series(extract_details(x)))
    
    # Filter only the necessary columns and drop rows with missing values
    df_filtered = df[['Client', 'Location', 'Experience']].dropna()
    df_filtered['Title'] = sheet  # Add the sheet name for tracking
    
    # Insert the filtered data into the SQLite database
    for _, row in df_filtered.iterrows():
        cursor.execute('''
            INSERT INTO ClientData (Client, Location, Experience, Title)
            VALUES (?, ?, ?, ?)
        ''', (row['Client'], row['Location'], row['Experience'], row['Title']))

# Commit changes and close the connection
conn.commit()
conn.close()

print("Data has been extracted and populated into the SQLite database.")




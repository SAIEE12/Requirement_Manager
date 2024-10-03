
# With Range in Exp

# # import pandas as pd
# import sqlite3
# import re
# import glob
# import os

# # Function to extract client, location, and experience (min and max) from text
# def extract_details(text):
#     client = location = min_experience = max_experience = None
#     if isinstance(text, str):
#         client_match = re.search(r'Client:\s*(\w+)', text)
        
#         # Update location regex to avoid capturing the "Experience" part
#         location_match = re.search(r'Location:\s*([\w\s]+?)(?=\s*Experience)', text)
        
#         # Extract experience as a range or a single number
#         experience_match = re.search(r'Experience:\s*(\d+)(?:\s*-\s*(\d+))?', text)
        
#         client = client_match.group(1) if client_match else None
#         location = location_match.group(1).strip() if location_match else None  # Strip any extra spaces
        
#         # If experience is found
#         if experience_match:
#             min_experience = int(experience_match.group(1))
#             max_experience = int(experience_match.group(2)) if experience_match.group(2) else min_experience
    
#     return client, location, min_experience, max_experience

# # Folder path where Excel files are located
# folder_path = '/home/shashank/Bitsilica/Tool'

# # Get all Excel files in the folder (with .xlsx extension)
# excel_files = glob.glob(os.path.join(folder_path, "*.xlsx"))

# # Prepare the SQLite database
# db_path = '/home/shashank/Bitsilica/Tool/clients_data.db'
# conn = sqlite3.connect(db_path)
# cursor = conn.cursor()

# # Create table for storing the data with min and max experience columns
# cursor.execute('''
#     CREATE TABLE IF NOT EXISTS ClientData (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         Client TEXT,
#         Location TEXT,
#         MinExperience INTEGER,
#         MaxExperience INTEGER,
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
#         df[['Client', 'Location', 'MinExperience', 'MaxExperience']] = df.iloc[:, 0].apply(lambda x: pd.Series(extract_details(x)))
        
#         # Filter only the necessary columns and drop rows with missing values
#         df_filtered = df[['Client', 'Location', 'MinExperience', 'MaxExperience']].dropna()
#         df_filtered['Title'] = sheet  # Add the sheet name for tracking
        
#         # Insert the filtered data into the SQLite database
#         for _, row in df_filtered.iterrows():
#             cursor.execute('''
#                 INSERT INTO ClientData (Client, Location, MinExperience, MaxExperience, Title)
#                 VALUES (?, ?, ?, ?, ?)
#             ''', (row['Client'], row['Location'], row['MinExperience'], row['MaxExperience'], row['Title']))

# # Commit changes and close the connection
# conn.commit()
# conn.close()

# print("Data has been extracted and populated into the SQLite database.")













# # import pandas as pd
# # import sqlite3
# # import re

# # # Step 1: Connect to the SQLite database (or create it if it doesn't exist)
# # db_file_path = 'client_data.db'
# # conn = sqlite3.connect(db_file_path)
# # cursor = conn.cursor()

# # # Step 2: Create the table in the SQLite database
# # create_table_query = '''
# # CREATE TABLE IF NOT EXISTS client_info (
# #     client TEXT,
# #     location TEXT,
# #     experience TEXT,
# #     description TEXT,
# #     required_people INTEGER,
# #     UNIQUE(client, location, experience, description, required_people)
# # )
# # '''
# # cursor.execute(create_table_query)

# # # Step 3: Load the Excel file
# # excel_file_path = '/home/shashank/Bitsilica/Tool/AMD.xlsx'  # Replace with your file path
# # xls = pd.ExcelFile(excel_file_path)

# # # Step 4: Define regex patterns for extracting details
# # client_pattern = re.compile(r'Client:\s*(.*)', re.IGNORECASE)
# # location_pattern = re.compile(r'Location:\s*(.*)', re.IGNORECASE)
# # experience_pattern = re.compile(r'Experience:\s*(.*)', re.IGNORECASE)
# # description_pattern = re.compile(r'Description:\s*(.*)', re.IGNORECASE)
# # people_pattern = re.compile(r'Required People:\s*(\d+)', re.IGNORECASE)

# # # Step 5: Process each sheet
# # for sheet_name in xls.sheet_names:
# #     df = pd.read_excel(excel_file_path, sheet_name=sheet_name, header=1)  # Read the sheet
    
# #     if not df.empty:
# #         # Extract raw details from the first column of the first row
# #         raw_details = df.iloc[0, 0] if pd.notna(df.iloc[0, 0]) else None
        
# #         if isinstance(raw_details, str):
# #             # Use regex to extract the required fields
# #             client_match = client_pattern.search(raw_details)
# #             location_match = location_pattern.search(raw_details)
# #             experience_match = experience_pattern.search(raw_details)
# #             description_match = description_pattern.search(raw_details)
# #             people_match = people_pattern.search(raw_details)
            
# #             # Extract values or assign default values if missing
# #             client = client_match.group(1).strip() if client_match else 'Unknown Client'
# #             location = location_match.group(1).strip() if location_match else 'Unknown Location'
# #             experience = experience_match.group(1).strip() if experience_match else 'Unknown Experience'
# #             description = description_match.group(1).strip() if description_match else 'Unknown Description'
# #             required_people = int(people_match.group(1)) if people_match else 1  # Default to 1 person if missing
            
# #             # Insert the data into the SQLite database
# #             try:
# #                 cursor.execute(
# #                     '''
# #                     INSERT OR REPLACE INTO client_info (client, location, experience, description, required_people)
# #                     VALUES (?, ?, ?, ?, ?)
# #                     ''', 
# #                     (client, location, experience, description, required_people)
# #                 )
# #             except sqlite3.IntegrityError as e:
# #                 print(f"Error inserting data: {e}")
    
# #     else:
# #         print(f"Skipping sheet '{sheet_name}' as it contains no data.")

# # # Step 6: Commit the transaction and close the connection
# # conn.commit()
# # conn.close()

# # print("Data successfully inserted into SQLite database!")












# # import pandas as pd
# # import sqlite3
# # import re

# # # Reconnect to the SQLite database for further processing
# # db_file_path = 'client_data.db'
# # conn = sqlite3.connect(db_file_path)
# # cursor = conn.cursor()

# # # Create a table if it doesn't exist
# # create_table_query = '''
# # CREATE TABLE IF NOT EXISTS client_info (
# #     client TEXT,
# #     location TEXT,
# #     experience TEXT,
# #     description TEXT,
# #     required_people INTEGER,
# #     UNIQUE(client, location, experience, description, required_people)
# # )
# # '''
# # cursor.execute(create_table_query)

# # # Load the Excel file
# # excel_file_path = '/home/shashank/Bitsilica/Tool/AMD.xlsx'
# # xls = pd.ExcelFile(excel_file_path)


# # # Process the sheets again, this time handling each based on its content type
# # for sheet_name in xls.sheet_names:
# #     df = pd.read_excel(excel_file_path, sheet_name=sheet_name, header=1)  # Read the sheet
    
# #     # We'll check for valid text data in the first row's first cell
# #     raw_details = df.iloc[0, 0] if not df.empty else None  # Ensure there's data in the sheet

# #     if isinstance(raw_details, str):  # Process only if the first cell contains a string
# #         try:
# #             client = re.search(r'Client:\s*(.*)', raw_details).group(1).strip()
# #             location = re.search(r'Location:\s*(.*)', raw_details).group(1).strip()
# #             experience = re.search(r'Experience:\s*(.*)', raw_details).group(1).strip()
# #             job_title = "Senior Validation Engineer"  # Default job title from the description
# #             required_people = 5  # Default value or customize as needed

# #             # Insert valid data into the SQLite database
# #             cursor.execute(
# #                 '''
# #                 INSERT OR REPLACE INTO client_info (client, location, experience, description, required_people)
# #                 VALUES (?, ?, ?, ?, ?)
# #                 ''', 
# #                 (client, location, experience, job_title, required_people)
# #             )
# #         except AttributeError:
# #             print(f"Failed to extract data from sheet: {sheet_name}")
# #     else:
# #         # Skipping sheets that do not contain valid text data
# #         print(f"Skipping sheet '{sheet_name}' as it contains invalid or non-text data.")

# # # Commit the transaction and close the connection
# # conn.commit()
# # conn.close()











# # This works
# import pandas as pd
# import sqlite3
# import re

# # Step 1: Read data from the uploaded Excel file
# excel_file_path = '/home/shashank/Bitsilica/Tool/AMD.xlsx'  # Path to your uploaded Excel file
# df = pd.read_excel(excel_file_path, sheet_name='DevOps Architect (Jenkins)', header=1)  # Read starting from the correct row

# # Step 2: Connect to SQLite database (or create it if it doesn't exist)
# db_file_path = 'client_data.db'  # Path to your SQLite database
# conn = sqlite3.connect(db_file_path)
# cursor = conn.cursor()

# # Step 3: Create a table in the SQLite database to store the required data
# create_table_query = '''
# CREATE TABLE IF NOT EXISTS client_info (
#     client TEXT,
#     location TEXT,
#     experience TEXT,
#     description TEXT,
#     required_people INTEGER
# )
# '''
# cursor.execute(create_table_query)

# # Step 4: Insert data into the SQLite database from the extracted information
# # Extract the relevant fields from the raw details
# raw_details = '''C
# ...'''

# # Extract Client, Location, Experience, and Description
# client = re.search(r'Client:\s*(.*)', raw_details).group(1).strip()
# location = re.search(r'Location:\s*(.*)', raw_details).group(1).strip()
# experience = re.search(r'Experience:\s*(.*)', raw_details).group(1).strip()
# job_title = "Senior Validation Engineer"  # This is from the description
# required_people = 5  # Set default value or extract if available

# # Insert data into the SQLite database
# cursor.execute(
#     '''
#     INSERT OR REPLACE INTO client_info (client, location, experience, description, required_people)
#     VALUES (?, ?, ?, ?, ?)
#     ''', 
#     (client, location, experience, job_title, required_people)
# )

# # Step 5: Commit the transaction and close the connection
# conn.commit()
# conn.close()

# print("Data successfully inserted into SQLite database!")



# import pandas as pd
# import sqlite3
# import re

# # Step 1: Read data from the uploaded Excel file
# excel_file_path = '/home/shashank/Bitsilica/Tool/Blaize.xlsx'  # Path to your uploaded Excel file
# df = pd.read_excel(excel_file_path, sheet_name=' Senior Validation Engineer', header=1)  # Read starting from the correct row

# # Step 2: Connect to SQLite database (or create it if it doesn't exist)
# db_file_path = 'client_data.db'  # Path to your SQLite database
# conn = sqlite3.connect(db_file_path)
# cursor = conn.cursor()

# # Step 3: Create a table in the SQLite database to store the required data
# create_table_query = '''
# CREATE TABLE IF NOT EXISTS client_info (
#     client TEXT,
#     location TEXT,
#     experience TEXT,
#     description TEXT,
#     required_people INTEGER
# )
# '''
# cursor.execute(create_table_query)

# # Step 4: Insert data into the SQLite database from the extracted information
# # Extract the relevant fields from the raw details
# raw_details = '''Client: Blaize
# Location: Hyderabad
# Experience: 5-8 years
# Title: Senior Validation Engineer Requirement
# ...'''

# # Extract Client, Location, Experience, and Description
# client = re.search(r'Client:\s*(.*)', raw_details).group(1).strip()
# location = re.search(r'Location:\s*(.*)', raw_details).group(1).strip()
# experience = re.search(r'Experience:\s*(.*)', raw_details).group(1).strip()
# job_title = "Senior Validation Engineer"  # This is from the description
# required_people = 5  # Set default value or extract if available

# # Insert data into the SQLite database
# cursor.execute(
#     '''
#     INSERT OR REPLACE INTO client_info (client, location, experience, description, required_people)
#     VALUES (?, ?, ?, ?, ?)
#     ''', 
#     (client, location, experience, job_title, required_people)
# )

# # Step 5: Commit the transaction and close the connection
# conn.commit()
# conn.close()

# print("Data successfully inserted into SQLite database!")

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
#         location_match = re.search(r'Location:\s*([\w\s]+)', text)
#         experience_match = re.search(r'Experience:\s*([\d\+]+)', text)
        
#         client = client_match.group(1) if client_match else None
#         location = location_match.group(1) if location_match else None
#         experience = experience_match.group(1) if experience_match else None
    
#     return client, location, experience

# # Load the Excel file
# # Folder path where Excel files are located
# folder_path = '/home/shashank/Bitsilica/Tool'

# # Get all Excel files in the folder (with .xlsx extension)
# excel_files = glob.glob(os.path.join(folder_path, "*.xlsx"))

# # Step 4: Loop through each Excel file
# for file in excel_files:
#     xls = pd.ExcelFile(file)

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

# # Loop through all sheets to extract the data
# for sheet in xls.sheet_names:
#     df = pd.read_excel(xls, sheet_name=sheet)
    
#     # Apply the extraction function to the relevant column in each sheet
#     df[['Client', 'Location', 'Experience']] = df.iloc[:, 0].apply(lambda x: pd.Series(extract_details(x)))
    
#     # Filter only the necessary columns and drop rows with missing values
#     df_filtered = df[['Client', 'Location', 'Experience']].dropna()
#     df_filtered['Title'] = sheet  # Add the sheet name for tracking
    
#     # Insert the filtered data into the SQLite database
#     for _, row in df_filtered.iterrows():
#         cursor.execute('''
#             INSERT INTO ClientData (Client, Location, Experience, Title)
#             VALUES (?, ?, ?, ?)
#         ''', (row['Client'], row['Location'], row['Experience'], row['Title']))

# # Commit changes and close the connection
# conn.commit()
# conn.close()

# print("Data has been extracted and populated into the SQLite database.")



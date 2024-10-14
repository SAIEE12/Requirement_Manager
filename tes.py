# # Read the Excel file (assuming your DataFrame is already created)
# # df = pd.read_excel('your_file.xlsx', sheet_name='your_sheet_name')

# # Assuming df_filled is the DataFrame you've already prepared
# # Extract Date and Status from the merged header
# # Get the merged header value (the first column header)
# date = df_filled.columns[0]  # This should hold the date value
# status = df_filled.columns[0]  # This should hold the status value

# # Create a DataFrame with the extracted Date and Status
# extracted_info = pd.DataFrame({
#     'Date': [date],
#     'Status': [status]
# })

# # Display the extracted DataFrame
# print(extracted_info)

# import pandas as pd
# import re

# # Sample data representing the first row
# full_row_data = (
#     "Date: 21-07-2024            Status: Open    Client: Blaize\n"
#     "Location: Hyderabad\nExperience: 5-8 years\n\n"
#     "Title: Senior Validation Engineer Requirement \n"
#     "Exp:5 to 8+\nLocation: Hyderabad\nKey words:\n\n"
#     "Provided JD:\nJOB RESPONSIBILITIES\n\n"
#     "· Developing test cases for a complex AI Accelerator based on internal development framework.\n"
#     "· Work on Creating DNN and Generative AI based Graph structures.\n"
#     "· Work on Creating Assembly kernels for AI workloads.\n"
#     "· Work with Hardware Design and verification teams closely to develop Test plans and testcases.\n"
#     "· Work on maintaining the test database and regressions\n\n"
#     "REQUIRED KNOWLEDGE, SKILLS, AND ABILITIES\n\n"
#     "Strong Python Programming skills\n\n"
#     "Good C/C++ programming skills\n\n"
#     "Strong software debugging skills\n\n"
#     "Familiarity with Assembly programming.\n\n"
#     "Comfortable with Scripting and Linux work environments.\n\n"
#     "EDUCATION AND EXPERIENCE\n\n"
#     "MS or BS in computer science or related field\n\n"
#     "5-8+ years of software development and validation experience\n\n"
#     "Desired Skills\n\n"
#     "Understanding of Computer architecture, graph processing.\n\n"
#     "Experience with traditional computer vision algorithms and image processing is preferred.\n\n"
#     "Familiarity with DNN’s is also beneficial.\n\n"
#     "Knowledge of test Automation tools and regression setup.\n\n"
#     "Hardware bringup and Validation experience.\n\n"
#     "C/C++ Based hardware verification experience."
# )

# # Regular expressions to extract Date and Status
# date_match = re.search(r'Date:\s*(\d{2}-\d{2}-\d{4})', full_row_data)
# status_match = re.search(r'Status:\s*(\w+)', full_row_data)

# # Extracting values
# extracted_date = date_match.group(1) if date_match else 'None'
# extracted_status = status_match.group(1) if status_match else 'None'

# # Create a DataFrame to hold the extracted values
# extracted_data = pd.DataFrame({'Date': [extracted_date], 'Status': [extracted_status]})

# # Output the extracted data
# print(extracted_data)



# import pandas as pd
# import re

# # Load the Excel file
# file_path = '/home/shashank/Bitsilica/Requirement_Manager/Excel_code/Before/Blaize.xlsx'  # Replace with your actual file path
# xls = pd.ExcelFile(file_path)

# # Prepare a list to hold the extracted results
# extracted_data = []

# # Loop through each sheet in the Excel file
# for sheet_name in xls.sheet_names:
#     df = pd.read_excel(xls, sheet_name=sheet_name)
    
#         # Loop through each sheet in the Excel file
# for sheet_name in xls.sheet_names:
#     # Skip specific sheets by checking for substrings in a case-insensitive manner
#     if any(keyword in sheet_name.lower() for keyword in ["dashboard", "inputs"]):
#         continue  # Skip to the next iteration

#     # Assuming the first row contains the data
#     first_row = df.head().to_string(index=False)  # Convert the whole first row to string

#     print(f"First row from sheet '{sheet_name}':\n{first_row}\n")
    
#     # Extract Date and Status from the first cell
#     date_match = re.search(r'Date:\s*(\d{2}-\d{2}-\d{4})', first_row)
#     status_match = re.search(r'Status:\s*(\w+)', first_row)

    
    
#     # Prepare other details
#     client_match = re.search(r'Client:\s*(\w+)', first_row)
#     location_match = re.search(r'Location:\s*(\w+)', first_row)
#     experience_match = re.search(r'Experience:\s*(\d+-\d+\s*years)', first_row)
#     title_match = re.search(r'Title:\s*(.*?)(?=Exp:)', first_row)
#     # responsibilities_match = re.search(r'Provided JD:\s*(.*)', first_row, re.DOTALL)

#     # Extract data or set to None if not found
#     extracted_date = date_match.group(1) if date_match else 'None'
#     extracted_status = status_match.group(1) if status_match else 'None'
#     extracted_client = client_match.group(1) if client_match else 'None'
#     extracted_location = location_match.group(1) if location_match else 'None'
#     extracted_experience = experience_match.group(1) if experience_match else 'None'
#     extracted_title = title_match.group(1).strip() if title_match else 'None'
#     # extracted_responsibilities = responsibilities_match.group(1).strip() if responsibilities_match else 'None'

#     # Combine extracted data into a formatted string
#     formatted_data = (
#         f"Date: {extracted_date}            Status: {extracted_status}    Client: {extracted_client}\n"
#         f"Location: {extracted_location}\nExperience: {extracted_experience}\n\n"
#         f"Title: {extracted_title}\n"
#         # f"Provided JD:\n{extracted_responsibilities}\n"
#     )

#     # Append the formatted data to the list
#     extracted_data.append(formatted_data)

# # Print the extracted data for all sheets
# for data in extracted_data:
#     print(data)


# import pandas as pd
# import re

# # Load the Excel file
# file_path = '/home/shashank/Bitsilica/Requirement_Manager/Excel_code/AMD.xlsx'  # Replace with your actual file path
# xls = pd.ExcelFile(file_path)

# # Prepare a list to hold the extracted results
# extracted_data = []

# # Loop through each sheet in the Excel file
# for sheet_name in xls.sheet_names:
#     # Skip specific sheets by checking for substrings in a case-insensitive manner
#     if any(keyword in sheet_name.lower() for keyword in ["dashboard", "inputs"]):
#         continue  # Skip to the next iteration
    
#     df = pd.read_excel(xls, sheet_name=sheet_name)
    
#     # Assuming the first row contains the data
#     first_row = df.head().to_string(index=False)  # Convert the whole first row to string

#     # Extract Date and Status from the first row
#     date_match = re.search(r'Date:\s*(\d{2}-\d{2}-\d{4})', first_row)
#     status_match = re.search(r'Status:\s*(\w+)', first_row)
    
#     # Extract data or set to None if not found
#     extracted_date = date_match.group(1) if date_match else 'None'
#     extracted_status = status_match.group(1) if status_match else 'None'
    
#     # Combine extracted data into a formatted string
#     formatted_data = (
#         f"Date: {extracted_date}            Status: {extracted_status}    "
#     )

#     # Append the formatted data to the list
#     extracted_data.append(formatted_data)

# # Print the extracted data for all sheets
# for data in extracted_data:
#     print(data)


# file_path = '/home/shashank/Bitsilica/Requirement_Manager/Excel_code/Before/LG.xlsx'

import pandas as pd
import os
import re
import math

# Load the Excel file
file_path = '/home/shashank/Bitsilica/Requirement_Manager/Excel_code/new_Requirements/Samsung.xlsx'
xls = pd.ExcelFile(file_path)

# Extract client name from the file name
file_name = os.path.basename(file_path)
client_name = file_name.split('.')[0]  # Extract client name from the file name before the extension

# Initialize a list to store extracted data from all sheets
all_extracted_data = []

# Define regex patterns for location and experience
location_pattern = r'(?i)(?:Location:|Location|loc:|loc|Loc:|Loc)\s*(.*)'
experience_pattern = r'(?i)(?:Exp:|Exp|Experience:|Experience|Experience -|Experience & Qualification|exp|EXPERIENCE:|EXPERIENCE-|Exp Min/Max|Min/ Max|Min/Max:)\s*([0-9]+)\s*(?:[-to~\s]+([0-9]+))?\s*(?:years?|yr|yrs|Years?|YEAR|YEARS)?'

# Function to find the closest multiple of 5
def closest_multiple_of_five(n):
    return int(math.ceil(n / 5.0)) * 5

# Loop through each sheet in the Excel file
for sheet_name in xls.sheet_names:
    # Skip sheets named 'Dashboard' and 'Inputs' in a case-insensitive manner
    if sheet_name.lower() in ['dashboard', 'inputs']:
        continue

    # Load the sheet into a DataFrame
    df = pd.read_excel(xls, sheet_name=sheet_name)

    # Extract data from the first column (header row)
    header_row = df.columns[0]

    # Initialize date and status
    date = 'Unknown'
    status = 'Unknown'

    # Extract Date and Status from the header row using regex split
    if 'Date:' in header_row:
        date_status_split = re.split(r'Date:|Status:', header_row)

        if len(date_status_split) > 1 and date_status_split[1].strip():
            date = date_status_split[1].strip()
        else:
            date = 'Unknown'

        if len(date_status_split) > 2 and date_status_split[2].strip():
            status = date_status_split[2].strip()
        else:
            status = 'Unknown'

    # Initialize location from sheet name based on conditions
    location = 'Unknown'
    if 'BLR' in sheet_name:
        location = 'Bangalore'
    elif 'HYD' in sheet_name:
        location = 'Hyderabad'

    # Extract Location and Experience using regex from the first column
    first_column_data = df.iloc[:, 0].dropna().astype(str)

    # Initialize variables for experience
    min_exp = 'Unknown'
    max_exp = 'Unknown'

    # Loop through the first column data
    for entry in first_column_data:
        location_match = re.search(location_pattern, entry)
        experience_match = re.search(experience_pattern, entry)

        # If regex finds location, it will override the initial value
        if location_match:
            location = location_match.group(1).strip()

        # Check if the experience_match is found and extract min/max experience
        if experience_match:
            min_exp = experience_match.group(1).strip()  # Minimum experience (first group)
            max_exp = experience_match.group(2)  # Maximum experience (optional second group)

            # If max_exp is not found, round min_exp to the nearest multiple of 5
            if not max_exp:
                min_exp_value = int(min_exp)  # Convert min_exp to an integer
                max_exp = closest_multiple_of_five(min_exp_value)

    # Prepare the extracted data for the current sheet
    extracted_data = {
        'Client': client_name,
        'Sheet Name': sheet_name,
        'Date': date,
        'Status': status,
        'Location': location,
        'Min Experience': min_exp,
        'Max Experience': max_exp
    }

    # Append to the list of all extracted data
    all_extracted_data.append(extracted_data)

# Convert the list to a DataFrame for better visualization
result_df = pd.DataFrame(all_extracted_data)

# Print or return the extracted data
print(result_df)

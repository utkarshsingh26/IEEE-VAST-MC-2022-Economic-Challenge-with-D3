import json
import csv

# Load data from 'output.json'
with open('participant_apartment.json', 'r') as json_file:
    data_json = json.load(json_file)

# Load data from 'output2.json'
with open('participant_education.json', 'r') as json_file:
    education_json = json.load(json_file)

# Create a dictionary to store education levels by participantId
education_mapping = {entry['participantId']: entry['educationLevel'] for entry in education_json}

# Create a list to store the combined data
combined_data = []

# Combine data from 'output.json' and 'output2.json'
for entry in data_json:
    participant_id = entry['participantId']
    apartment_id = entry['apartmentId']
    
    # Check if participantId exists in education mapping
    if participant_id in education_mapping:
        education_level = education_mapping[participant_id]
        combined_data.append({'participantId': participant_id, 'educationLevel': education_level, 'apartmentId': apartment_id})

# Define the CSV output file path
csv_file_path = 'combined_data.csv'

# Write the combined data to a CSV file
with open(csv_file_path, 'w', newline='') as csv_file:
    fieldnames = ['participantId', 'educationLevel', 'apartmentId']
    csv_writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    
    # Write the header row
    csv_writer.writeheader()
    
    # Write the combined data rows
    csv_writer.writerows(combined_data)

print(f'{len(combined_data)} rows of data written to {csv_file_path}')

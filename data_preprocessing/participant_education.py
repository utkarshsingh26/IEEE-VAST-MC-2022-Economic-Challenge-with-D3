import csv
import json

# Define the input and output file paths
csv_file_path = 'C:/Users/Sutapa/Desktop/ASU/CSE 578/Datasets/Attributes/Participants.csv'
json_file_path = 'participant_education.json'

# Initialize a list to store the extracted data
data = []

# Open the CSV file and read the data
with open(csv_file_path, mode='r', newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    
    # Loop through the first 1010 rows
    for row_num, row in enumerate(csv_reader, start=1):
        participant_id = row.get('participantId')
        education_level = row.get('educationLevel')
        
        # Add the data to the list
        data.append({'participantId': participant_id, 'educationLevel': education_level})

# Write the extracted data to a JSON file
with open(json_file_path, 'w') as json_file:
    json.dump(data, json_file)

print(f'{len(data)} rows of data extracted and written to {json_file_path}')

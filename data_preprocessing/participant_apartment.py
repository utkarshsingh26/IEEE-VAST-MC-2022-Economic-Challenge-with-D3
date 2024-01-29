import csv
import json

# Define the input and output file paths
csv_file_path = 'data/ParticipantStatusLogs1.csv'
json_file_path = 'participant_apartment.json'

# Initialize a list to store the extracted data
data = []

# Open the CSV file and read the data
with open(csv_file_path, mode='r', newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    
    # Loop through the first 1010 rows
    for row_num, row in enumerate(csv_reader, start=1):
        if row_num > 1011:
            break
        
        # Extract the required columns
        participant_id = row.get('participantId')
        apartment_id = row.get('apartmentId')
        
        # Add the data to the list
        data.append({'participantId': participant_id, 'apartmentId': apartment_id})

# Write the extracted data to a JSON file
with open(json_file_path, 'w') as json_file:
    json.dump(data, json_file)

print(f'{len(data)} rows of data extracted and written to {json_file_path}')

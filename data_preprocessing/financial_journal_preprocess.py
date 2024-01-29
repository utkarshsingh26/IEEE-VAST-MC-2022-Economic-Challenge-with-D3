import csv
from datetime import datetime
from collections import defaultdict
import pandas as pd

df = pd.read_csv("data_preprocessing/combined_data.csv")

high_school_or_college = df[df['educationLevel'] == 'HighSchoolOrCollege']['participantId'].tolist()
bachelors = df[df['educationLevel'] == 'Bachelors']['participantId'].tolist()
graduate = df[df['educationLevel'] == 'Graduate']['participantId'].tolist()
low = df[df['educationLevel'] == 'Low']['participantId'].tolist()

def parse_timestamp(timestamp_str):
    date = datetime.strptime(timestamp_str, '%Y-%m-%dT%H:%M:%SZ')
    return date.strftime('%Y-%m')

def calculate_totals(data):
    #data = [item for item in data if int(item['participantId']) in high_school_or_college]
    #data = [item for item in data if int(item['participantId']) in bachelors]
    #data = [item for item in data if int(item['participantId']) in graduate]
    data = [item for item in data if int(item['participantId']) in low]
    totals = defaultdict(float)
    for entry in data:
        month = parse_timestamp(entry['timestamp'])
        category = entry['category']
        amount = float(entry['amount'])
        totals[(month, category)] += amount
    return totals

def read_csv_data(file_path):
    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

file_path = 'data/FinancialJournal.csv'
data = read_csv_data(file_path)

totals = calculate_totals(data)

totals_list = [{'month': month, 'category': category, 'total_amount': total_amount}
               for (month, category), total_amount in totals.items()]

#csv_file_name = 'modified_financial_journal.csv'
#csv_file_name = 'modified_financial_journal_highschool.csv'
#csv_file_name = 'modified_financial_journal_bachelors.csv'
#csv_file_name = 'modified_financial_journal_graduate.csv'
csv_file_name = 'modified_financial_journal_low.csv'

fieldnames = ['month', 'category', 'total_amount']

with open(csv_file_name, 'w', newline='') as csvfile:
    csv_writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    csv_writer.writeheader()
    
    for row in totals_list:
        csv_writer.writerow(row)
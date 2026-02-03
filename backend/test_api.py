import requests
import os

BASE_URL = "http://127.0.0.1:8000/api"
FILE_PATH = "d:/Fosse/data/sample_equipment.csv"

def test_upload():
    print("Testing Upload Endpoint...")
    with open(FILE_PATH, 'rb') as f:
        files = {'file': f}
        response = requests.post(f"{BASE_URL}/upload/", files=files)
    
    if response.status_code == 201:
        print("Upload Successful!")
        print(response.json())
        return response.json().get('upload_id')
    else:
        print("Upload Failed!")
        print(response.text)
        return None

def test_statistics(upload_id):
    if not upload_id:
        print("Skipping Statistics Test (No Upload ID)")
        return

    print(f"\nTesting Statistics Endpoint for Upload ID {upload_id}...")
    response = requests.get(f"{BASE_URL}/statistics/{upload_id}/")
    
    if response.status_code == 200:
        print("Statistics Retrieved!")
        print(response.json())
    else:
        print("Statistics Failed!")
        print(response.text)

def test_history():
    print("\nTesting History Endpoint...")
    response = requests.get(f"{BASE_URL}/history/")
    
    if response.status_code == 200:
        print("History Retrieved!")
        print(response.json())
    else:
        print("History Failed!")
        print(response.text)

if __name__ == "__main__":
    upload_id = test_upload()
    test_statistics(upload_id)
    test_history()

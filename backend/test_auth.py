import requests

BASE_URL = "http://127.0.0.1:8000/api"

def test_login():
    print("Testing Login...")
    response = requests.post(f"{BASE_URL}/login/", data={'username': 'admin', 'password': 'password123'})
    
    if response.status_code == 200:
        print("Login Successful!")
        print(f"Token: {response.json().get('token')}")
    else:
        print("Login Failed!")
        print(response.text)

if __name__ == "__main__":
    test_login()

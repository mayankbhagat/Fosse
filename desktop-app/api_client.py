import requests

BASE_URL = "http://127.0.0.1:8000/api"

class APIClient:
    def __init__(self):
        self.token = None

    def login(self, username, password):
        try:
            response = requests.post(f"{BASE_URL}/login/", data={'username': username, 'password': password})
            if response.status_code == 200:
                self.token = response.json().get('token')
                return True, "Login Successful"
            else:
                return False, "Invalid Credentials"
        except Exception as e:
            return False, str(e)

    def get_headers(self):
        return {'Authorization': f'Token {self.token}'} if self.token else {}

    def upload_file(self, file_path):
        if not self.token: return False, "Not Authenticated"
        
        try:
            files = {'file': open(file_path, 'rb')}
            response = requests.post(f"{BASE_URL}/upload/", files=files, headers=self.get_headers())
            if response.status_code == 201:
                return True, response.json().get('upload_id')
            else:
                return False, response.text
        except Exception as e:
            return False, str(e)

    def get_history(self):
        if not self.token: return []
        try:
            response = requests.get(f"{BASE_URL}/history/", headers=self.get_headers())
            if response.status_code == 200:
                return response.json()
            return []
        except:
            return []

    def get_statistics(self, upload_id=None):
        if not self.token: return None
        try:
            url = f"{BASE_URL}/statistics/"
            if upload_id:
                url += f"{upload_id}/"
            response = requests.get(url, headers=self.get_headers())
            if response.status_code == 200:
                return response.json()
            return None
        except:
            return None

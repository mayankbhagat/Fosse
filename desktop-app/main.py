import sys
from PyQt5.QtWidgets import QApplication
from api_client import APIClient
from auth_window import AuthWindow
from dashboard_window import DashboardWindow

def main():
    app = QApplication(sys.argv)
    
    # Load Styles
    with open("styles.qss", "r") as f:
        app.setStyleSheet(f.read())
    
    api_client = APIClient()
    
    def show_dashboard(client):
        window.dashboard = DashboardWindow(client)
        window.dashboard.show()
        # window.close() # Auth window closes itself

    window = AuthWindow(api_client)
    window.login_success.connect(show_dashboard)
    window.show()
    
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()

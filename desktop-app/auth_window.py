from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, 
                             QMessageBox, QFrame, QHBoxLayout)
from PyQt5.QtCore import Qt, pyqtSignal

class AuthWindow(QWidget):
    login_success = pyqtSignal(object) # Signal to pass the API client on success

    def __init__(self, api_client):
        super().__init__()
        self.api_client = api_client
        self.initUI()
        self.apply_styles()

    def initUI(self):
        self.setWindowTitle("ChemViz - Login")
        self.setFixedSize(400, 500)
        self.setWindowFlags(Qt.FramelessWindowHint) # Custom look
        self.setAttribute(Qt.WA_TranslucentBackground)

        layout = QVBoxLayout()
        layout.setAlignment(Qt.AlignCenter)
        self.setLayout(layout)

        # Card Frame
        self.card = QFrame()
        self.card.setObjectName("Card")
        card_layout = QVBoxLayout(self.card)
        card_layout.setContentsMargins(40, 40, 40, 40)
        card_layout.setSpacing(20)

        # Logo / Header
        title = QLabel("Welcome Back")
        title.setObjectName("Heading")
        title.setAlignment(Qt.AlignCenter)
        
        subtitle = QLabel("Sign in to your account")
        subtitle.setObjectName("SubHeading")
        subtitle.setAlignment(Qt.AlignCenter)

        # Inputs
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username")
        
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password")
        self.password_input.setEchoMode(QLineEdit.Password)

        # Login Button
        self.login_btn = QPushButton("Sign In")
        self.login_btn.setCursor(Qt.PointingHandCursor)
        self.login_btn.clicked.connect(self.handle_login)

        # Close Button
        close_btn = QPushButton("Exit")
        close_btn.setObjectName("SecondaryButton")
        close_btn.setCursor(Qt.PointingHandCursor)
        close_btn.clicked.connect(self.close)

        card_layout.addWidget(title)
        card_layout.addWidget(subtitle)
        card_layout.addWidget(self.username_input)
        card_layout.addWidget(self.password_input)
        card_layout.addWidget(self.login_btn)
        card_layout.addWidget(close_btn)

        layout.addWidget(self.card)

    def handle_login(self):
        username = self.username_input.text()
        password = self.password_input.text()
        
        if not username or not password:
            QMessageBox.warning(self, "Error", "Please fill in all fields")
            return

        success, message = self.api_client.login(username, password)
        if success:
            self.login_success.emit(self.api_client)
            self.close()
        else:
            QMessageBox.critical(self, "Login Failed", message)

    def apply_styles(self):
       # Styles loaded in main.py
       pass

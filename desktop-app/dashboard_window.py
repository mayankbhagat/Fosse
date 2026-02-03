from PyQt5.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                             QLabel, QPushButton, QTabWidget, QFileDialog, QMessageBox, QListWidget)
from PyQt5.QtCore import Qt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt

class DashboardWindow(QMainWindow):
    def __init__(self, api_client):
        super().__init__()
        self.api_client = api_client
        self.initUI()
        self.load_history()

    def initUI(self):
        self.setWindowTitle("ChemViz - Dashboard")
        self.setGeometry(100, 100, 1000, 700)

        # Central Widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        # Header
        header = QHBoxLayout()
        title = QLabel("Engineering Dashboard")
        title.setObjectName("Heading")
        header.addWidget(title)
        
        logout_btn = QPushButton("Logout")
        logout_btn.setObjectName("SecondaryButton")
        logout_btn.setFixedSize(100, 35)
        logout_btn.clicked.connect(self.close)
        header.addWidget(logout_btn, alignment=Qt.AlignRight)
        
        layout.addLayout(header)

        # Tabs
        self.tabs = QTabWidget()
        self.tab1 = QWidget()
        self.tab2 = QWidget()
        
        self.tabs.addTab(self.tab1, "Upload & History")
        self.tabs.addTab(self.tab2, "Analytics & Charts")
        
        self.setup_upload_tab()
        self.setup_charts_tab()
        
        layout.addWidget(self.tabs)

    def setup_upload_tab(self):
        layout = QVBoxLayout()
        
        # Upload Section
        lbl = QLabel("Upload New Data")
        lbl.setObjectName("SubHeading")
        layout.addWidget(lbl)

        btn_upload = QPushButton("Select CSV File")
        btn_upload.setFixedWidth(200)
        btn_upload.clicked.connect(self.handle_upload)
        layout.addWidget(btn_upload)
        
        layout.addSpacing(20)

        # History Section
        lbl_hist = QLabel("Recent Uploads")
        lbl_hist.setObjectName("SubHeading")
        layout.addWidget(lbl_hist)

        self.history_list = QListWidget()
        layout.addWidget(self.history_list)

        self.tab1.setLayout(layout)

    def setup_charts_tab(self):
        layout = QVBoxLayout()
        
        self.chart_label = QLabel("Equipment Parameters (Latest Upload)")
        self.chart_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.chart_label)

        # Matplotlib Figure
        self.figure = Figure(figsize=(5, 4), dpi=100)
        self.canvas = FigureCanvas(self.figure)
        layout.addWidget(self.canvas)
        
        self.tab2.setLayout(layout)

    def handle_upload(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Open CSV", "", "CSV Files (*.csv)")
        if file_path:
            success, result = self.api_client.upload_file(file_path)
            if success:
                QMessageBox.information(self, "Success", "File uploaded successfully!")
                self.load_history()
                self.update_charts(result) # result is upload_id
            else:
                QMessageBox.critical(self, "Upload Failed", result)

    def load_history(self):
        self.history_list.clear()
        history = self.api_client.get_history()
        if history:
            for item in history:
                self.history_list.addItem(f"{item['file_name']} - {item['upload_time']}")
            
            # Auto-load charts for the latest one if available
            if history:
                 # In a real app we'd get the ID from the history item
                 # For now, just refreshing charts with default (latest)
                 self.update_charts()

    def update_charts(self, upload_id=None):
        # Since we only get summary stats from the backend, we visualize those for now.
        # Ideally, we'd plot the raw data points.
        
        data = self.api_client.get_statistics(upload_id)
        if not data: return

        self.figure.clear()
        ax = self.figure.add_subplot(111)

        # Example: Bar chart of average values
        categories = ['Flowrate', 'Pressure', 'Temperature']
        means = [
            data.get('flowrate', {}).get('mean', 0),
            data.get('pressure', {}).get('mean', 0),
            data.get('temperature', {}).get('mean', 0)
        ]
        
        bars = ax.bar(categories, means, color=['#0ea5e9', '#f43f5e', '#eab308'])
        ax.set_title('Average System Parameters')
        ax.set_ylabel('Value')
        
        # Add values on top
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                    f'{height:.1f}',
                    ha='center', va='bottom')

        self.canvas.draw()

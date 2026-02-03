from django.urls import path
from .views import UploadView, StatisticsView, HistoryView, ReportView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('upload/', UploadView.as_view(), name='upload'),
    path('statistics/', StatisticsView.as_view(), name='statistics'),
    path('statistics/<int:upload_id>/', StatisticsView.as_view(), name='statistics-detail'),
    path('history/', HistoryView.as_view(), name='history'),
    path('report/<int:upload_id>/', ReportView.as_view(), name='report'),
    path('login/', obtain_auth_token, name='api_token_auth'),
]

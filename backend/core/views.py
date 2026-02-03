from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileUploadSerializer, EquipmentDataSerializer, UploadLogSerializer
from .models import UploadLog, EquipmentData
import pandas as pd
from django.db import transaction

class UploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_serializer = FileUploadSerializer(data=request.data)
        if file_serializer.is_valid():
            uploaded_file = file_serializer.validated_data['file']
            
            # Create UploadLog
            upload_log = UploadLog.objects.create(file_name=uploaded_file.name)
            
            try:
                # Process with Pandas
                df = pd.read_csv(uploaded_file)
                
                # Check for required columns
                required_columns = ['Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature']
                if not all(col in df.columns for col in required_columns):
                    upload_log.delete()
                    return Response({"error": f"CSV missing required columns: {required_columns}"}, status=status.HTTP_400_BAD_REQUEST)

                # Bulk Create EquipmentData
                equipment_instances = [
                    EquipmentData(
                        upload=upload_log,
                        equipment_name=row['Equipment Name'],
                        equipment_type=row['Type'],
                        flowrate=row['Flowrate'],
                        pressure=row['Pressure'],
                        temperature=row['Temperature']
                    )
                    for index, row in df.iterrows()
                ]
                
                with transaction.atomic():
                    EquipmentData.objects.bulk_create(equipment_instances)

                return Response({"message": "File uploaded and processed successfully", "upload_id": upload_log.id}, status=status.HTTP_201_CREATED)
            
            except Exception as e:
                upload_log.delete()
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StatisticsView(APIView):
    def get(self, request, upload_id=None):
        if upload_id:
            data = EquipmentData.objects.filter(upload_id=upload_id)
        else:
            # Get latest upload if no ID provided
            latest_upload = UploadLog.objects.last()
            if not latest_upload:
                return Response({"error": "No data found"}, status=status.HTTP_404_NOT_FOUND)
            data = EquipmentData.objects.filter(upload=latest_upload)
            
        if not data.exists():
             return Response({"error": "No data found for this upload"}, status=status.HTTP_404_NOT_FOUND)

        # Convert to Pandas DataFrame for describe()
        df = pd.DataFrame(list(data.values('flowrate', 'pressure', 'temperature')))
        stats = df.describe().to_dict()
        
        return Response(stats, status=status.HTTP_200_OK)

from django.http import HttpResponse
from .utils import generate_pdf_report

class ReportView(APIView):
    def get(self, request, upload_id):
        pdf_buffer = generate_pdf_report(upload_id)
        if not pdf_buffer:
             return Response({"error": "Upload not found"}, status=status.HTTP_404_NOT_FOUND)
        
        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="report_{upload_id}.pdf"'
        return response

class HistoryView(APIView):
    def get(self, request):
        uploads = UploadLog.objects.order_by('-upload_time')[:5]
        serializer = UploadLogSerializer(uploads, many=True)
        return Response(serializer.data)

from rest_framework import serializers
from .models import UploadLog, EquipmentData

class EquipmentDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentData
        fields = '__all__'

class UploadLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadLog
        fields = '__all__'

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

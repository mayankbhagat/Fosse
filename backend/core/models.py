from django.db import models

class UploadLog(models.Model):
    file_name = models.CharField(max_length=255)
    upload_time = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.file_name} at {self.upload_time}"

class EquipmentData(models.Model):
    upload = models.ForeignKey(UploadLog, on_delete=models.CASCADE, related_name='equipment_data')
    equipment_name = models.CharField(max_length=255)
    equipment_type = models.CharField(max_length=255)
    flowrate = models.FloatField()
    pressure = models.FloatField()
    temperature = models.FloatField()

    def __str__(self):
        return f"{self.equipment_name} ({self.equipment_type})"

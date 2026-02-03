from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
import io
from .models import UploadLog, EquipmentData

def generate_pdf_report(upload_id):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    try:
        upload = UploadLog.objects.get(id=upload_id)
        equipment_list = EquipmentData.objects.filter(upload=upload)
    except UploadLog.DoesNotExist:
        return None

    # Title
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, f"Equipment Parameter Report")
    
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 70, f"File: {upload.file_name}")
    p.drawString(50, height - 90, f"Date: {upload.upload_time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Summary Statistics
    flows = [e.flowrate for e in equipment_list]
    pressures = [e.pressure for e in equipment_list]
    temps = [e.temperature for e in equipment_list]
    
    if flows:
        avg_flow = sum(flows) / len(flows)
        max_pressure = max(pressures)
        avg_temp = sum(temps) / len(temps)
        
        p.drawString(50, height - 130, "Summary Statistics:")
        p.drawString(70, height - 150, f"Average Flowrate: {avg_flow:.2f} L/hr")
        p.drawString(70, height - 170, f"Max Pressure: {max_pressure:.2f} bar")
        p.drawString(70, height - 190, f"Average Temperature: {avg_temp:.2f} C")

    # Table Data
    data = [['Name', 'Type', 'Flow', 'Press', 'Temp']]
    for e in equipment_list[:20]: # Limit to first 20 for brief report
        data.append([
            e.equipment_name,
            e.equipment_type,
            str(e.flowrate),
            str(e.pressure),
            str(e.temperature)
        ])
    
    if len(equipment_list) > 20:
        data.append(["...", "...", "...", "...", "..."])

    # Draw Table
    table = Table(data, colWidths=[120, 100, 60, 60, 60])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    table.wrapOn(p, width, height)
    table.drawOn(p, 50, height - 400)
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
u = User.objects.get(username='admin')
u.set_password('password123')
u.save()
print("Admin password set to 'password123'")

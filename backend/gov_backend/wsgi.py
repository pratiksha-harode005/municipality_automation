import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gov_backend.settings')

application = get_wsgi_application()

# Alias for Vercel Serverless Function
app = application

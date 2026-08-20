from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('requests/', views.requests_list_view, name='requests-list'),
    path('requests/citizen/', views.citizen_own_requests_view, name='citizen-requests'),
    path('requests/officer/', views.officer_queue_view, name='officer-queue'),
    path('requests/dept-admin/', views.dept_admin_queue_view, name='dept-admin-queue'),
    path('requests/<str:req_id>/update-status/', views.update_status_view, name='update-status'),
]

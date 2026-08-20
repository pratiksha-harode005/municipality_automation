from django.contrib import admin
from .models import (
    User, Department, Ward, Officer,
    CitizenServiceRequest, Assignment, StatusHistory,
    Notification, SecurityAuditLog
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'fullName', 'email', 'role', 'department', 'ward', 'created_at')
    search_fields = ('username', 'fullName', 'email')
    list_filter = ('role', 'department')

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'contactEmail', 'contactPhone')
    search_fields = ('name', 'code')

@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'zone')
    search_fields = ('name', 'zone')

@admin.register(Officer)
class OfficerAdmin(admin.ModelAdmin):
    list_display = ('fullName', 'email', 'department', 'wardName')
    search_fields = ('fullName', 'email', 'department')

@admin.register(CitizenServiceRequest)
class CitizenServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'citizenName', 'serviceName', 'department', 'status', 'submissionDate')
    search_fields = ('id', 'citizenName', 'citizenEmail', 'serviceName')
    list_filter = ('status', 'department')

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'requestId', 'officerId', 'assignedAt')

@admin.register(StatusHistory)
class StatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('historyId', 'request', 'previousStatus', 'newStatus', 'updatedBy', 'updatedAt')
    search_fields = ('historyId', 'updatedBy')
    list_filter = ('newStatus',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'citizenEmail', 'title', 'read', 'createdAt')
    list_filter = ('read',)

@admin.register(SecurityAuditLog)
class SecurityAuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'eventType', 'actorEmail', 'actorRole', 'timestamp', 'ipAddress')
    search_fields = ('eventType', 'actorEmail')
    list_filter = ('eventType', 'actorRole')

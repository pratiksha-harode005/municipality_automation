from rest_framework import serializers
from .models import User, Department, Ward, Officer, CitizenServiceRequest, Assignment, StatusHistory, Notification, SecurityAuditLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'fullName', 'role', 'department', 'departmentId', 'ward', 'mobile', 'address', 'created_at']

class StatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusHistory
        fields = ['historyId', 'previousStatus', 'newStatus', 'updatedBy', 'updatedByRole', 'updatedAt', 'remarks']

class CitizenServiceRequestSerializer(serializers.ModelSerializer):
    statusHistory = StatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = CitizenServiceRequest
        fields = '__all__'

class OfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class SecurityAuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityAuditLog
        fields = '__all__'

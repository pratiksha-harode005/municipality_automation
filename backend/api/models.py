from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# 1. Custom User Model supporting 4 Roles
class User(models.Model):
    ROLE_CHOICES = (
        ('citizen', 'Citizen'),
        ('officer', 'Municipal Officer'),
        ('dept_admin', 'Department Administrator'),
        ('super_admin', 'Super Administrator'),
    )

    id = models.CharField(max_length=100, primary_key=True, default=uuid.uuid4)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255) # SHA-256 Hashed Password
    fullName = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='citizen')
    department = models.CharField(max_length=255, blank=True, null=True)
    departmentId = models.CharField(max_length=100, blank=True, null=True)
    ward = models.CharField(max_length=255, blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fullName} ({self.email}) - {self.role}"


# 2. Municipal Department Table
class Department(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    contactEmail = models.EmailField()
    contactPhone = models.CharField(max_length=20)

    def __str__(self):
        return self.name


# 3. Ward Jurisdiction Table
class Ward(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    zone = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# 4. Officer Detail Table
class Officer(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='officer_profile')
    fullName = models.CharField(max_length=255)
    email = models.EmailField()
    department = models.CharField(max_length=255)
    departmentId = models.CharField(max_length=100)
    wardName = models.CharField(max_length=255)
    authorizedServices = models.JSONField(default=list)

    def __str__(self):
        return f"{self.fullName} ({self.department})"


# 5. Primary Citizen Municipal Service Request Table
class CitizenServiceRequest(models.Model):
    STATUS_CHOICES = (
        ('Submitted', 'Submitted'),
        ('Department Received', 'Department Received'),
        ('Assigned', 'Assigned'),
        ('Under Verification', 'Under Verification'),
        ('Documents Required', 'Documents Required'),
        ('Under Processing', 'Under Processing'),
        ('In Progress', 'In Progress'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Resolved', 'Resolved'),
        ('Completed', 'Completed'),
        ('Closed', 'Closed'),
    )

    id = models.CharField(max_length=100, primary_key=True) # e.g. MUN-2026-992014
    citizenId = models.CharField(max_length=100)
    citizenName = models.CharField(max_length=255)
    citizenEmail = models.EmailField()
    serviceId = models.CharField(max_length=100)
    serviceName = models.CharField(max_length=255)
    departmentId = models.CharField(max_length=100)
    department = models.CharField(max_length=255)
    wardId = models.CharField(max_length=100, default='ward-112')
    wardName = models.CharField(max_length=255, default='Ward 112 (Malleshwaram)')
    submissionDate = models.CharField(max_length=100)
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='Submitted')
    stage = models.CharField(max_length=255)
    assignedOfficerId = models.CharField(max_length=100, blank=True, null=True)
    assignedOfficerName = models.CharField(max_length=255, blank=True, null=True)
    assignedOfficerEmail = models.EmailField(blank=True, null=True)
    evidenceName = models.CharField(max_length=255, blank=True, null=True)
    evidenceType = models.CharField(max_length=50, blank=True, null=True) # image / video
    evidenceSize = models.CharField(max_length=50, blank=True, null=True)
    evidenceDataUrl = models.TextField(blank=True, null=True) # Secure Encoded Media Data
    payload = models.JSONField(default=dict, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.serviceName} ({self.status})"


# 6. Assignment Table
class Assignment(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    requestId = models.CharField(max_length=100)
    officerId = models.CharField(max_length=100)
    assignedAt = models.DateTimeField(auto_now_add=True)


# 7. Immutable Status Audit Trail Log Table
class StatusHistory(models.Model):
    historyId = models.CharField(max_length=100, primary_key=True)
    request = models.ForeignKey(CitizenServiceRequest, on_delete=models.CASCADE, related_name='status_history')
    previousStatus = models.CharField(max_length=100, blank=True, null=True)
    newStatus = models.CharField(max_length=100)
    updatedBy = models.CharField(max_length=255)
    updatedByRole = models.CharField(max_length=50)
    updatedAt = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField()

    class Meta:
        ordering = ['-updatedAt']


# 8. Notifications Table
class Notification(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    citizenEmail = models.EmailField()
    title = models.CharField(max_length=255)
    message = models.TextField()
    requestId = models.CharField(max_length=100)
    createdAt = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-createdAt']


# 9. Security Audit Log Table
class SecurityAuditLog(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    eventType = models.CharField(max_length=100)
    actorEmail = models.EmailField()
    actorRole = models.CharField(max_length=50)
    details = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    ipAddress = models.CharField(max_length=100, default='127.0.0.1')

    class Meta:
        ordering = ['-timestamp']

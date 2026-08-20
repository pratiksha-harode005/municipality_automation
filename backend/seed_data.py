import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gov_backend.settings')
django.setup()

from api.models import (
    User, Department, Ward, Officer,
    CitizenServiceRequest, Assignment, StatusHistory,
    Notification, SecurityAuditLog
)
from api.views import hash_password

def seed():
    print("Seeding database with sample Municipal data...")

    # 1. Clean existing sample data (preserve superusers if any)
    User.objects.all().delete()
    Department.objects.all().delete()
    Ward.objects.all().delete()
    Officer.objects.all().delete()
    CitizenServiceRequest.objects.all().delete()
    Assignment.objects.all().delete()
    StatusHistory.objects.all().delete()
    Notification.objects.all().delete()
    SecurityAuditLog.objects.all().delete()

    # 2. Departments
    depts = [
        Department.objects.create(
            id='dept-pwd',
            name='Public Works / Electrical Department',
            code='PWD-ELEC',
            contactEmail='pwd.helpdesk@bbmp.gov.in',
            contactPhone='(080) 2297 5511'
        ),
        Department.objects.create(
            id='dept-vital',
            name='Birth & Death Registration Department',
            code='REG-VITAL',
            contactEmail='vital.records@bbmp.gov.in',
            contactPhone='(080) 2297 5522'
        ),
        Department.objects.create(
            id='dept-water',
            name='Water & Sewerage Department',
            code='BWSSB-UTIL',
            contactEmail='water.supply@bwssb.gov.in',
            contactPhone='(080) 2297 5533'
        ),
        Department.objects.create(
            id='dept-sanitation',
            name='Solid Waste Management / Sanitation Department',
            code='SWM-SAN',
            contactEmail='sanitation@bbmp.gov.in',
            contactPhone='(080) 2297 5544'
        )
    ]
    print(f"Created {len(depts)} Departments.")

    # 3. Wards
    wards = [
        Ward.objects.create(id='ward-112', name='Ward 112 (Malleshwaram)', zone='West Zone'),
        Ward.objects.create(id='ward-174', name='Ward 174 (HSR Layout)', zone='South Zone'),
        Ward.objects.create(id='ward-84', name='Ward 84 (Indiranagar)', zone='East Zone'),
        Ward.objects.create(id='ward-04', name='Ward 04 (Yelahanka Town)', zone='North Zone'),
    ]
    print(f"Created {len(wards)} Wards.")

    # 4. Users (All Roles)
    u_admin = User.objects.create(
        id='user-super-admin',
        username='admin',
        email='admin@bbmp.gov.in',
        password=hash_password('admin123'),
        fullName='Chief Commissioner (Super Admin)',
        role='super_admin',
        department='BBMP Central Governance Secretariat',
        departmentId='dept-gov',
        ward='Central Administrative Office',
        mobile='9845000001',
        address='NR Square, GBA, Bengaluru'
    )

    u_dept_admin = User.objects.create(
        id='user-dept-admin-1',
        username='dept_admin',
        email='admin.pwd@bbmp.gov.in',
        password=hash_password('password123'),
        fullName='Sri Manjunath Swamy',
        role='dept_admin',
        department='Public Works / Electrical Department',
        departmentId='dept-pwd',
        ward='Malleshwaram Division',
        mobile='9845000002',
        address='PWD Division Office, Malleshwaram'
    )

    u_officer1 = User.objects.create(
        id='user-officer-1',
        username='officer_pwd',
        email='officer.ward112@bbmp.gov.in',
        password=hash_password('password123'),
        fullName='Er. Rajesh Kumar',
        role='officer',
        department='Public Works / Electrical Department',
        departmentId='dept-pwd',
        ward='Ward 112 (Malleshwaram)',
        mobile='9845000003',
        address='Ward 112 Office, Malleshwaram'
    )

    u_officer2 = User.objects.create(
        id='user-officer-2',
        username='officer_vital',
        email='officer.vital@bbmp.gov.in',
        password=hash_password('password123'),
        fullName='Dr. Ananya Sharma',
        role='officer',
        department='Birth & Death Registration Department',
        departmentId='dept-vital',
        ward='Ward 112 (Malleshwaram)',
        mobile='9845000004',
        address='Registration Office, West Zone'
    )

    u_citizen = User.objects.create(
        id='user-citizen-1',
        username='citizen',
        email='citizen@bbmp.gov.in',
        password=hash_password('password123'),
        fullName='Kavitha R.',
        role='citizen',
        department='',
        ward='Ward 112 (Malleshwaram)',
        mobile='9845012345',
        address='No. 45, 8th Main, Malleshwaram, Bengaluru'
    )

    u_pratiksha = User.objects.create(
        id='user-citizen-pratiksha',
        username='pratiksha',
        email='pratiksha@bbmp.gov.in',
        password=hash_password('pratiksha123'),
        fullName='Pratiksha',
        role='citizen',
        department='',
        ward='Ward 112 (Malleshwaram)',
        mobile='9876543210',
        address='Malleshwaram, Bengaluru'
    )

    u_prit = User.objects.create(
        id='user-citizen-prit',
        username='prit',
        email='prit@bbmp.gov.in',
        password=hash_password('prit123'),
        fullName='Prit',
        role='citizen',
        department='',
        ward='Ward 174 (HSR Layout)',
        mobile='9876543211',
        address='HSR Layout, Bengaluru'
    )

    u_poobi = User.objects.create(
        id='user-citizen-poobi',
        username='poobi',
        email='poobi@bbmp.gov.in',
        password=hash_password('poobi123'),
        fullName='Poobi',
        role='citizen',
        department='',
        ward='Ward 84 (Indiranagar)',
        mobile='9876543212',
        address='Indiranagar, Bengaluru'
    )

    print("Created 8 Users across all Roles (including Pratiksha, Prit, Poobi).")

    # 5. Officers
    Officer.objects.create(
        id='off-1',
        user=u_officer1,
        fullName='Er. Rajesh Kumar',
        email='officer.ward112@bbmp.gov.in',
        department='Public Works / Electrical Department',
        departmentId='dept-pwd',
        wardName='Ward 112 (Malleshwaram)',
        authorizedServices=['road-streetlights', 'pothole-repair']
    )

    Officer.objects.create(
        id='off-2',
        user=u_officer2,
        fullName='Dr. Ananya Sharma',
        email='officer.vital@bbmp.gov.in',
        department='Birth & Death Registration Department',
        departmentId='dept-vital',
        wardName='Ward 112 (Malleshwaram)',
        authorizedServices=['birth-death']
    )

    # 6. Citizen Requests & Status History
    req1 = CitizenServiceRequest.objects.create(
        id='MUN-2026-992014',
        citizenId=u_citizen.id,
        citizenName='Kavitha R.',
        citizenEmail='citizen@bbmp.gov.in',
        serviceId='road-streetlights',
        serviceName='Road & Streetlight Complaints',
        departmentId='dept-pwd',
        department='Public Works / Electrical Department',
        wardId='ward-112',
        wardName='Ward 112 (Malleshwaram)',
        submissionDate='May 10, 2026',
        status='In Progress',
        stage='Stage 3 of 4: In Progress (Work Order Dispatched)',
        assignedOfficerId=u_officer1.id,
        assignedOfficerName=u_officer1.fullName,
        assignedOfficerEmail=u_officer1.email,
        evidenceName='pothole_8th_main.jpg',
        evidenceType='image',
        evidenceSize='2.4 MB',
        payload={
            'complaintType': 'Pothole & Asphalt Damage',
            'location': '8th Main Road, Near Malleshwaram Circle',
            'description': 'Deep asphalt crater causing traffic bottleneck and accident risk during rains.'
        }
    )

    StatusHistory.objects.create(
        historyId='HIS-992014-1',
        request=req1,
        previousStatus=None,
        newStatus='Submitted',
        updatedBy='Kavitha R. (citizen@bbmp.gov.in)',
        updatedByRole='citizen',
        remarks='Application filed via Citizen Portal.'
    )
    StatusHistory.objects.create(
        historyId='HIS-992014-2',
        request=req1,
        previousStatus='Submitted',
        newStatus='Under Verification',
        updatedBy='Er. Rajesh Kumar',
        updatedByRole='officer',
        remarks='Field inspection completed. Assigned to road contractor team.'
    )
    StatusHistory.objects.create(
        historyId='HIS-992014-3',
        request=req1,
        previousStatus='Under Verification',
        newStatus='In Progress',
        updatedBy='Er. Rajesh Kumar',
        updatedByRole='officer',
        remarks='Asphalt patch work scheduled tonight at 11:00 PM.'
    )

    req2 = CitizenServiceRequest.objects.create(
        id='MUN-2026-881942',
        citizenId=u_citizen.id,
        citizenName='Kavitha R.',
        citizenEmail='citizen@bbmp.gov.in',
        serviceId='birth-death',
        serviceName='Birth & Death Certificates',
        departmentId='dept-vital',
        department='Birth & Death Registration Department',
        wardId='ward-112',
        wardName='Ward 112 (Malleshwaram)',
        submissionDate='May 04, 2026',
        status='Approved',
        stage='Stage 4 of 4: Completed (Digital e-Certificate Issued)',
        assignedOfficerId=u_officer2.id,
        assignedOfficerName=u_officer2.fullName,
        assignedOfficerEmail=u_officer2.email,
        evidenceName='hospital_discharge_summary.pdf',
        evidenceType='document',
        evidenceSize='1.1 MB',
        payload={
            'childName': 'Aarav Sharma',
            'dateOfBirth': '2026-04-18',
            'placeOfBirth': 'Manipal Hospital, Malleshwaram',
            'fatherName': 'Vikram Sharma',
            'motherName': 'Kavitha R.'
        }
    )

    StatusHistory.objects.create(
        historyId='HIS-881942-1',
        request=req2,
        previousStatus=None,
        newStatus='Submitted',
        updatedBy='Kavitha R. (citizen@bbmp.gov.in)',
        updatedByRole='citizen',
        remarks='Birth certificate application submitted.'
    )
    StatusHistory.objects.create(
        historyId='HIS-881942-2',
        request=req2,
        previousStatus='Submitted',
        newStatus='Approved',
        updatedBy='Dr. Ananya Sharma',
        updatedByRole='officer',
        remarks='Hospital birth records verified against institutional database. Digital certificate generated.'
    )

    req3 = CitizenServiceRequest.objects.create(
        id='MUN-2026-881023',
        citizenId=u_pratiksha.id,
        citizenName='Pratiksha',
        citizenEmail='pratiksha@bbmp.gov.in',
        serviceId='water-sewerage',
        serviceName='Water & Sewerage Services',
        departmentId='dept-water',
        department='Water & Sewerage Department',
        wardId='ward-112',
        wardName='Ward 112 (Malleshwaram)',
        submissionDate='Aug 15, 2026',
        status='Under Verification',
        stage='Stage 2 of 4: Under Verification (Field Inspection)',
        assignedOfficerId=u_officer1.id,
        assignedOfficerName=u_officer1.fullName,
        assignedOfficerEmail=u_officer1.email,
        evidenceName='water_pipeline_leak.jpg',
        evidenceType='image',
        evidenceSize='1.8 MB',
        payload={
            'complaintType': 'Low Water Pressure & Pipeline Leak',
            'location': '12th Main Road, Malleshwaram',
            'description': 'Low water supply pressure reported across 12th Main domestic pipeline.'
        }
    )

    StatusHistory.objects.create(
        historyId='HIS-881023-1',
        request=req3,
        previousStatus=None,
        newStatus='Submitted',
        updatedBy='Pratiksha',
        updatedByRole='citizen',
        remarks='Pipeline grievance lodged via portal.'
    )

    req4 = CitizenServiceRequest.objects.create(
        id='MUN-2026-773045',
        citizenId=u_prit.id,
        citizenName='Prit',
        citizenEmail='prit@bbmp.gov.in',
        serviceId='waste-sanitation',
        serviceName='Waste Management & Sanitation',
        departmentId='dept-sanitation',
        department='Solid Waste Management / Sanitation Department',
        wardId='ward-174',
        wardName='Ward 174 (HSR Layout)',
        submissionDate='Aug 16, 2026',
        status='In Progress',
        stage='Stage 3 of 4: In Progress (Dispatched)',
        assignedOfficerId=u_officer1.id,
        assignedOfficerName=u_officer1.fullName,
        assignedOfficerEmail=u_officer1.email,
        evidenceName='waste_collection_point.jpg',
        evidenceType='image',
        evidenceSize='1.2 MB',
        payload={
            'complaintType': 'Door-to-Door Auto Tipper Timing',
            'location': 'Sector 2, HSR Layout',
            'description': 'Request for scheduled 7:30 AM morning dry & wet segregated waste pickup.'
        }
    )

    StatusHistory.objects.create(
        historyId='HIS-773045-1',
        request=req4,
        previousStatus=None,
        newStatus='Submitted',
        updatedBy='Prit',
        updatedByRole='citizen',
        remarks='Sanitation schedule request submitted.'
    )

    req5 = CitizenServiceRequest.objects.create(
        id='MUN-2026-664089',
        citizenId=u_poobi.id,
        citizenName='Poobi',
        citizenEmail='poobi@bbmp.gov.in',
        serviceId='birth-death',
        serviceName='Birth & Death Certificates',
        departmentId='dept-vital',
        department='Birth & Death Registration Department',
        wardId='ward-84',
        wardName='Ward 84 (Indiranagar)',
        submissionDate='Aug 17, 2026',
        status='Approved',
        stage='Stage 4 of 4: Approved & Digitally Signed',
        assignedOfficerId=u_officer2.id,
        assignedOfficerName=u_officer2.fullName,
        assignedOfficerEmail=u_officer2.email,
        evidenceName='hospital_discharge_summary.pdf',
        evidenceType='document',
        evidenceSize='950 KB',
        payload={
            'certificateType': 'Birth Certificate Digital Copy',
            'hospitalName': 'Manipal Hospital, HAL Airport Road',
            'dateOfEvent': '2026-07-20'
        }
    )

    StatusHistory.objects.create(
        historyId='HIS-664089-1',
        request=req5,
        previousStatus=None,
        newStatus='Submitted',
        updatedBy='Poobi',
        updatedByRole='citizen',
        remarks='Digital certificate request filed.'
    )

    # 7. Notifications
    Notification.objects.create(
        id='notif-1',
        citizenEmail='citizen@bbmp.gov.in',
        title='Application Approved!',
        message='Great news! Your Birth Certificate application (MUN-2026-881942) has been approved and issued.',
        requestId='MUN-2026-881942',
        read=False
    )
    Notification.objects.create(
        id='notif-2',
        citizenEmail='citizen@bbmp.gov.in',
        title='Road Complaint In Progress',
        message='Your complaint MUN-2026-992014 is currently In Progress. Asphalt team dispatched.',
        requestId='MUN-2026-992014',
        read=True
    )

    # 8. Security Audit Logs
    SecurityAuditLog.objects.create(
        id='AUDIT-101',
        eventType='LOGIN_SUCCESS',
        actorEmail='admin@bbmp.gov.in',
        actorRole='super_admin',
        details='Administrator authenticated via secure session.',
        ipAddress='127.0.0.1 (Verified TLS 1.3)'
    )
    SecurityAuditLog.objects.create(
        id='AUDIT-102',
        eventType='STATUS_CHANGE',
        actorEmail='officer.vital@bbmp.gov.in',
        actorRole='officer',
        details='Approved application MUN-2026-881942 for Birth Certificate.',
        ipAddress='127.0.0.1'
    )

    print("Successfully seeded all tables!")

if __name__ == '__main__':
    seed()

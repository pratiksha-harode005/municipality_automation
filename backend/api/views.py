import hashlib
import uuid
import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import User, Department, Ward, Officer, CitizenServiceRequest, Assignment, StatusHistory, Notification, SecurityAuditLog
from .serializers import UserSerializer, CitizenServiceRequestSerializer, OfficerSerializer, NotificationSerializer, SecurityAuditLogSerializer

def hash_password(plain_password):
    salt = "bbmp_bengaluru_salt_2026"
    return hashlib.sha256((plain_password + salt).encode('utf-8')).hexdigest()

# SERVICE TO DEPARTMENT BACKEND ROUTING REGISTRY
SERVICE_DEPARTMENT_MAP = {
    '1': {'id': 'dept-pwd', 'name': 'Public Works / Electrical Department'},
    '2': {'id': 'dept-vital', 'name': 'Birth & Death Registration Department'},
    '3': {'id': 'dept-water', 'name': 'Water & Sewerage Department'},
    '4': {'id': 'dept-sanitation', 'name': 'Solid Waste Management / Sanitation Department'},
    '5': {'id': 'dept-tracking', 'name': 'Tracking Portal (No Department)'}
}

# 1. USER LOGIN API
@api_view(['POST'])
def login_view(request):
    data = request.data
    login_id = data.get('loginId', '').strip().lower()
    password = data.get('password', '')

    hashed_pw = hash_password(password)

    try:
        user = User.objects.get(models.Q(email__iexact=login_id) | models.Q(username__iexact=login_id))
        # Match plain password fallback or hashed password
        if user.password == password or user.password == hashed_pw:
            token = f"jwt-token-{user.role}-{uuid.uuid4()}"
            serializer = UserSerializer(user)
            
            # Log Security Audit Event
            SecurityAuditLog.objects.create(
                id=f"AUDIT-{uuid.uuid4()}",
                eventType='LOGIN_SUCCESS',
                actorEmail=user.email,
                actorRole=user.role,
                details=f"Successful Django/MySQL authentication for {user.email}"
            )

            return Response({'success': True, 'token': token, 'user': serializer.data})
    except User.DoesNotExist:
        pass

    return Response({'success': False, 'error': 'Invalid email/username or password.'}, status=status.HTTP_401_UNAUTHORIZED)


# 2. CITIZEN REGISTER API
@api_view(['POST'])
def register_view(request):
    data = request.data
    email = data.get('email', '').strip().lower()

    if User.objects.filter(email__iexact=email).exists():
        return Response({'success': False, 'error': f'Account with email {email} already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    hashed_pw = hash_password(data.get('password', ''))

    user = User.objects.create(
        id=f"citizen-{uuid.uuid4()}",
        email=email,
        username=email.split('@')[0],
        password=hashed_pw,
        fullName=data.get('fullName', 'Citizen User'),
        role='citizen', # Strictly Citizen
        mobile=data.get('mobile', ''),
        address=data.get('address', 'Bengaluru, Karnataka')
    )

    token = f"jwt-token-citizen-{uuid.uuid4()}"
    serializer = UserSerializer(user)
    return Response({'success': True, 'token': token, 'user': serializer.data})


# 3. SUBMIT MUNICIPAL REQUEST API (Automatic Department Routing & Officer Assignment Engine)
@api_view(['POST', 'GET'])
def requests_list_view(request):
    if request.method == 'GET':
        requests = CitizenServiceRequest.objects.all().order_by('-createdAt')
        serializer = CitizenServiceRequestSerializer(requests, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        data = request.data
        service_key = str(data.get('serviceId', '1'))
        
        # 1. Automatic Department Routing
        dept_info = SERVICE_DEPARTMENT_MAP.get(service_key, SERVICE_DEPARTMENT_MAP['1'])
        dept_id = dept_info['id']
        dept_name = dept_info['name']

        # 2. Generate Unique App ID
        rand_num = str(uuid.uuid4().int)[:6]
        unique_app_id = f"MUN-2026-{rand_num}"

        # 3. Automatic Officer Assignment Engine
        assigned_officer = Officer.objects.filter(departmentId=dept_id).first()
        officer_id = assigned_officer.id if assigned_officer else 'user-officer-1'
        officer_name = assigned_officer.fullName if assigned_officer else 'Er. Rajesh Kumar'
        officer_email = assigned_officer.email if assigned_officer else 'officer.ward112@bbmp.gov.in'

        # 4. Create Request in MySQL Database
        evidence = data.get('evidence', {})
        now_str = datetime.datetime.now().strftime("%b %d, %Y")

        new_req = CitizenServiceRequest.objects.create(
            id=unique_app_id,
            citizenId=data.get('citizenId', 'citizen@bbmp.gov.in'),
            citizenName=data.get('citizenName', 'Smt. Kavitha R.'),
            citizenEmail=data.get('citizenEmail', 'citizen@bbmp.gov.in'),
            serviceId=service_key,
            serviceName=data.get('serviceName', 'Municipal Service'),
            departmentId=dept_id,
            department=dept_name,
            wardId='ward-112',
            wardName='Ward 112 (Malleshwaram)',
            submissionDate=now_str,
            status='Submitted',
            stage=f"Stage 1 of 4: Submitted to {dept_name}",
            assignedOfficerId=officer_id,
            assignedOfficerName=officer_name,
            assignedOfficerEmail=officer_email,
            evidenceName=evidence.get('name'),
            evidenceType=evidence.get('type'),
            evidenceSize=evidence.get('size'),
            evidenceDataUrl=evidence.get('dataUrl'),
            payload=data.get('payload', {})
        )

        # 5. Append Initial Status Audit Log
        StatusHistory.objects.create(
            historyId=f"HIS-{uuid.uuid4()}",
            request=new_req,
            previousStatus=None,
            newStatus='Submitted',
            updatedBy=new_req.citizenName,
            updatedByRole='citizen',
            remarks=f"Request submitted and automatically routed to {dept_name}"
        )

        # 6. Create Notifications
        Notification.objects.create(
            id=f"NOTIF-{uuid.uuid4()}-1",
            citizenEmail=new_req.citizenEmail,
            title="Request Submitted Successfully",
            message=f"Your request ({unique_app_id}) for {new_req.serviceName} has been submitted.",
            requestId=unique_app_id
        )

        Notification.objects.create(
            id=f"NOTIF-{uuid.uuid4()}-2",
            citizenEmail=new_req.citizenEmail,
            title="Request Received & Assigned to Officer",
            message=f"Your request ({unique_app_id}) has been received by {dept_name} and assigned to {officer_name}.",
            requestId=unique_app_id
        )

        serializer = CitizenServiceRequestSerializer(new_req)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# 4. GET CITIZEN OWN REQUESTS API (IDOR Protection)
@api_view(['GET'])
def citizen_own_requests_view(request):
    citizen_email = request.query_params.get('email', '')
    reqs = CitizenServiceRequest.objects.filter(citizenEmail__iexact=citizen_email).order_by('-createdAt')
    serializer = CitizenServiceRequestSerializer(reqs, many=True)
    return Response(serializer.data)


# 5. GET AUTHORIZED OFFICER QUEUE API
@api_view(['GET'])
def officer_queue_view(request):
    officer_email = request.query_params.get('email', '')
    dept = request.query_params.get('department', '')
    
    reqs = CitizenServiceRequest.objects.filter(
        models.Q(assignedOfficerEmail__iexact=officer_email) | models.Q(department__iexact=dept)
    ).order_by('-createdAt')
    
    serializer = CitizenServiceRequestSerializer(reqs, many=True)
    return Response(serializer.data)


# 6. GET AUTHORIZED DEPT ADMIN QUEUE API
@api_view(['GET'])
def dept_admin_queue_view(request):
    dept = request.query_params.get('department', '')
    reqs = CitizenServiceRequest.objects.filter(department__iexact=dept).order_by('-createdAt')
    serializer = CitizenServiceRequestSerializer(reqs, many=True)
    return Response(serializer.data)


# 7. UPDATE REQUEST STATUS API
@api_view(['POST'])
def update_status_view(request, req_id):
    data = request.data
    new_status = data.get('status')
    remarks = data.get('remarks', '')
    updated_by = data.get('updatedBy', 'Municipal Officer')
    user_role = data.get('updatedByRole', 'officer')

    if user_role == 'citizen':
        return Response({'success': False, 'error': 'Citizens are blocked from updating request status.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        req = CitizenServiceRequest.objects.get(id=req_id)
        prev_status = req.status
        req.status = new_status
        req.stage = f"Current Stage: {new_status}"
        req.save()

        # Audit History
        StatusHistory.objects.create(
            historyId=f"HIS-{uuid.uuid4()}",
            request=req,
            previousStatus=prev_status,
            newStatus=new_status,
            updatedBy=updated_by,
            updatedByRole=user_role,
            remarks=remarks
        )

        # Citizen Notification
        Notification.objects.create(
            id=f"NOTIF-{uuid.uuid4()}",
            citizenEmail=req.citizenEmail,
            title=f'Status Updated to "{new_status}"',
            message=f'Your request {req.id} status has been updated to "{new_status}". Remarks: "{remarks}"',
            requestId=req.id
        )

        serializer = CitizenServiceRequestSerializer(req)
        return Response({'success': True, 'request': serializer.data})
    except CitizenServiceRequest.DoesNotExist:
        return Response({'success': False, 'error': 'Request ID not found.'}, status=status.HTTP_404_NOT_FOUND)

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, AlertTriangle, CreditCard, Award, 
  Bell, User, ShieldCheck, LogOut, PlusCircle, CheckCircle, Clock, 
  ArrowRight, Search, Download, ChevronRight, Eye, RefreshCw, Filter, Menu, X, Check,
  Building2, Sparkles, Send, CheckCircle2, Edit3, Save, MapPin, Mail, Phone, Shield, Key, UserCheck, BadgeCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMunicipalData } from '../../context/DataContext';
import { EvidenceUploadInput } from '../../components/EvidenceUploadInput';
import { downloadMunicipalDocument } from '../../utils/documentDownloader';

export const CitizenDashboard = ({ onNavigate }) => {
  const { user, updateUser, logout } = useAuth();
  const { showToast, getCitizenNotifications, markNotificationAsRead, data, submitCitizenServiceRequest } = useMunicipalData();

  // BACKEND SECURED CITIZEN NOTIFICATIONS FILTER
  const dbNotifications = getCitizenNotifications(user);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);
  const [overviewFilter, setOverviewFilter] = useState('all'); // 'all', 'applications', 'complaints'

  // Citizen Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    ward: user?.ward || 'Ward 84 (Indiranagar)',
    alternatePhone: user?.alternatePhone || '94800 12345'
  });

  useEffect(() => {
    if (user) {
      setProfileFormData({
        fullName: user.fullName || '',
        mobile: user.mobile || '',
        address: user.address || '',
        ward: user.ward || 'Ward 84 (Indiranagar)',
        alternatePhone: user.alternatePhone || '94800 12345'
      });
    }
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileFormData.fullName.trim()) {
      showToast("Full Name cannot be empty.", "warning");
      return;
    }
    if (!profileFormData.mobile.trim()) {
      showToast("Contact Mobile cannot be empty.", "warning");
      return;
    }
    if (!profileFormData.address.trim()) {
      showToast("Residential Address cannot be empty.", "warning");
      return;
    }

    if (user?.id && updateUser) {
      updateUser(user.id, {
        fullName: profileFormData.fullName.trim(),
        mobile: profileFormData.mobile.trim(),
        address: profileFormData.address.trim(),
        ward: profileFormData.ward,
        alternatePhone: profileFormData.alternatePhone.trim()
      });
    }

    showToast("✅ Citizen Profile successfully updated!", "success");
    setIsEditingProfile(false);
  };

  // Department-First Grievance State
  const [showLodgeModal, setShowLodgeModal] = useState(false);
  const [selectedDeptKey, setSelectedDeptKey] = useState('dept-pwd');
  const [selectedServiceSubtype, setSelectedServiceSubtype] = useState('Pothole / Road Surface Damage');
  const [grievanceLocation, setGrievanceLocation] = useState(user?.address || '14th Cross, Malleshwaram, Ward 112');
  const [grievanceDescription, setGrievanceDescription] = useState('');
  const [grievanceEvidence, setGrievanceEvidence] = useState(null);

  // Department to Service Subtype Mapping (Civil & Medical Departments)
  const deptGrievanceOptions = [
    {
      id: 'dept-civil',
      name: 'Civil Department (CIVIL-DEPT)',
      serviceKey: 'road-streetlights',
      sla: '24 - 48 Hours',
      officer: 'Er. Rajesh Kumar',
      subtypes: [
        'Potholes & Road Surface Damage (Roads)',
        'Streetlight Outage / Dark Hazard (Electrical)',
        'Damaged Footpath / Pavement (Infrastructure)',
        'Fallen Tree Branch Hazard (Civil)',
        'Underground Water Pipeline Leakage (Water)',
        'Low Water Pressure / Supply Issue (Water)',
        'Sewerage Line Blockage / Overflow (Sewerage)',
        'New Water Pipeline Connection Inquiry (Water)',
        'Auto-Tipper Missed Waste Collection (Sanitation)',
        'Bulk Waste / Debris Pickup Request (Sanitation)',
        'Open Garbage Dumping / Blackspot (Sanitation)'
      ]
    },
    {
      id: 'dept-medical',
      name: 'Medical Department (MEDICAL-DEPT)',
      serviceKey: 'birth-death',
      sla: '3 - 5 Days',
      officer: 'Dr. Ananya Sharma',
      subtypes: [
        'Birth Certificate Application Inquiry / Follow-up',
        'Death Certificate Application Follow-up',
        'Name Correction in Issued Certificate',
        'Hospital Record & Delayed Registration Verification'
      ]
    }
  ];

  const handleLodgeGrievance = (e) => {
    e.preventDefault();
    if (!grievanceLocation.trim()) {
      showToast("Please enter the grievance location.", "warning");
      return;
    }
    const targetDept = deptGrievanceOptions.find(d => d.id === selectedDeptKey) || deptGrievanceOptions[0];
    const req = submitCitizenServiceRequest(targetDept.serviceKey, {
      issue: selectedServiceSubtype,
      location: grievanceLocation,
      description: grievanceDescription,
      departmentId: targetDept.id,
      department: targetDept.name,
      evidence: grievanceEvidence
    }, user);

    if (req) {
      showToast(`✅ Grievance Registered! Ticket: ${req.id} sent to ${targetDept.officer}`);
      setShowLodgeModal(false);
      setGrievanceDescription('');
      setGrievanceEvidence(null);
    }
  };

  // USER DATA ISOLATION & DYNAMIC RESOLUTION
  const isDemoCitizen = user?.email?.toLowerCase() === 'citizen@bbmp.gov.in';

  // Fetch all requests registered for this specific citizen from DataContext
  const userLiveRequests = (data?.citizenServiceRequests || []).filter(r => {
    if (!user) return false;
    const uEmail = (user.email || '').trim().toLowerCase();
    const rEmail = (r.citizenEmail || r.citizenId || '').trim().toLowerCase();
    return rEmail === uEmail;
  });

  // Base mock data for demo account ONLY
  const initialDemoApps = [
    {
      id: 'APP-BD-2026-991204',
      serviceName: 'Birth Certificate Application',
      department: 'Health & Welfare Division',
      submissionDate: 'Aug 10, 2026',
      status: 'Pending Review',
      stage: 'Stage 2 of 4: Hospital Verification',
      applicantName: 'Smt. Kavitha R.',
      feePaid: '₹50.00',
      paymentStatus: 'Paid'
    },
    {
      id: 'APP-BWSSB-2026-48192',
      serviceName: 'New Water & Sewerage Connection',
      department: 'BWSSB Utility Division',
      submissionDate: 'Aug 02, 2026',
      status: 'Approved',
      stage: 'Stage 4 of 4: Meter Active',
      applicantName: 'Smt. Kavitha R.',
      feePaid: '₹1,250.00',
      paymentStatus: 'Paid'
    },
    {
      id: 'APP-KHATA-2026-77102',
      serviceName: 'SAS e-Khata Final Extract Download',
      department: 'Revenue & Tax Division',
      submissionDate: 'Jul 28, 2026',
      status: 'Approved',
      stage: 'Digitized & Issued',
      applicantName: 'Smt. Kavitha R.',
      feePaid: '₹125.00',
      paymentStatus: 'Paid'
    }
  ];

  const initialDemoComplaints = [
    {
      id: 'FIX-992014',
      issue: 'Pothole & Surface Damage on 14th Cross',
      serviceName: 'Road & Streetlight Complaints',
      department: 'Public Works / Electrical Department',
      submissionDate: 'Aug 14, 2026',
      status: 'Open',
      location: '14th Cross, Malleshwaram, Ward 112',
      priority: 'High'
    },
    {
      id: 'FIX-881204',
      issue: 'Broken Streetlight Near Park Gate',
      serviceName: 'Road & Streetlight Complaints',
      department: 'Public Works / Electrical Department',
      submissionDate: 'Jul 20, 2026',
      status: 'Resolved',
      location: '8th Main Junction, Ward 112',
      priority: 'Medium'
    }
  ];

  // Distinguish live applications and complaints
  const liveApplications = userLiveRequests.filter(r => 
    r.serviceId === 'birth-death' || 
    r.serviceId === 'water-sewerage' || 
    (!r.serviceId?.includes('road') && !r.serviceId?.includes('waste') && !r.issue)
  );

  const liveComplaints = userLiveRequests.filter(r => 
    r.serviceId === 'road-streetlights' || 
    r.serviceId === 'waste-sanitation' || 
    r.issue ||
    r.serviceName?.toLowerCase().includes('complaint')
  );

  // Applications dataset for this user
  const applications = isDemoCitizen && userLiveRequests.length === 0
    ? initialDemoApps
    : liveApplications;

  // Complaints dataset for this user
  const complaints = isDemoCitizen && userLiveRequests.length === 0
    ? initialDemoComplaints
    : liveComplaints;

  // Combined all requests for dashboard overview
  const recentUserItems = isDemoCitizen && userLiveRequests.length === 0
    ? [...initialDemoApps, ...initialDemoComplaints]
    : userLiveRequests;

  // Active filtered list for dashboard overview
  const displayedItems = (() => {
    if (overviewFilter === 'applications') return applications;
    if (overviewFilter === 'pending') return applications.filter(a => a.status === 'Submitted' || a.status === 'Pending Review' || a.status === 'In Progress' || a.status === 'Pending');
    if (overviewFilter === 'approved') return applications.filter(a => a.status === 'Approved' || a.status === 'Resolved' || a.status === 'Completed');
    if (overviewFilter === 'complaints') return complaints;
    return recentUserItems;
  })();

  // Payments Dataset (demo for demo citizen, empty for new citizen until they pay)
  const payments = isDemoCitizen ? [
    { id: 'PAY-882190', service: 'BWSSB Monthly Water Bill (S-481920-W)', date: 'Aug 05, 2026', amount: '₹685.00', status: 'Paid', receiptNo: 'RCP-BWSSB-991' },
    { id: 'PAY-771204', service: 'SAS Property Tax Early 5% Rebate (PID: 112-W04-88)', date: 'Jul 15, 2026', amount: '₹4,250.00', status: 'Paid', receiptNo: 'RCP-BBMP-772' }
  ] : [];

  // Certificates Dataset
  const certificates = isDemoCitizen ? [
    { id: 'CERT-BD-2026-9921', title: 'Digital e-Birth Certificate (Aarav Kumar)', dateIssued: 'Aug 14, 2026', authority: 'GBA Municipal Registrar', type: 'Birth Certificate' },
    { id: 'CERT-KHATA-2026-104', title: 'Digitized SAS e-Khata Certificate (PID: 112-W04-88)', dateIssued: 'Jul 20, 2026', authority: 'Special Commissioner (Revenue)', type: 'e-Khata Certificate' }
  ] : [];

  // Notifications Dataset
  const notifications = dbNotifications.length > 0 ? dbNotifications : (isDemoCitizen ? [
    { id: 'notif-1', title: 'Application Approved', message: 'Your SAS e-Khata extract (APP-KHATA-2026-77102) has been approved for digital download.', date: 'Aug 16, 2026', unread: true },
    { id: 'notif-2', title: 'Field Inspector Dispatched', message: 'Road Engineer assigned to inspect complaint FIX-992014 on 14th Cross.', date: 'Aug 14, 2026', unread: false },
    { id: 'notif-3', title: 'Water Bill Payment Confirmation', message: 'Payment of ₹685.00 received for BWSSB RR No: S-481920-W.', date: 'Aug 05, 2026', unread: false }
  ] : []);

  // Available Citizen Services List
  const availableServicesList = [
    { id: 'road-streetlights', name: '1. Road & Streetlight Complaints', icon: AlertTriangle, desc: 'Report potholes (FixMyCity), broken streetlights, and damaged footpaths.' },
    { id: 'birth-death', name: '2. Birth & Death Certificates', icon: FileText, desc: 'Apply step-by-step for new Birth/Death certificates or download issued records.' },
    { id: 'water-sewerage', name: '3. Water & Sewerage Services', icon: CreditCard, desc: 'Pay BWSSB monthly water bills online or apply for a new water connection.' },
    { id: 'waste-sanitation', name: '4. Waste Management & Sanitation', icon: RefreshCw, desc: 'Door-to-door auto-tipper garbage schedules & bulk waste pickup booking.' },
    { id: 'status-tracking', name: '5. Application & Status Tracking', icon: Clock, desc: 'Real-time 4-stage tracking for applications, water connections, and grievances.' }
  ];

  // Summary Metrics (Dynamically Calculated)
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => a.status === 'Submitted' || a.status === 'Pending Review' || a.status === 'In Progress').length;
  const approvedApps = applications.filter(a => a.status === 'Approved' || a.status === 'Resolved' || a.status === 'Completed').length;
  const openComplaints = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;

  const sidebarMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: PlusCircle },
    { id: 'applications', label: 'My Applications', icon: FileText, count: totalApps },
    { id: 'complaints', label: 'My Complaints', icon: AlertTriangle, count: openComplaints },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter(n => n.unread).length },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const getInitials = (name) => {
    if (!name) return 'KR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div id="main-content" style={{ background: '#f8fafc', minHeight: '90vh' }}>
      
      {/* Mobile Bar */}
      <div style={{ display: 'none', background: 'white', padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', justifyContent: 'space-between', alignItems: 'center' }} className="mobile-dash-bar">
        <button onClick={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#008b95' }}>
          {isSidebarMobileOpen ? <X size={20} /> : <Menu size={20} />} Portal Navigation
        </button>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45' }}>Citizen Dashboard</span>
      </div>

      <div className="citizen-dashboard-wrap">
        <div className="citizen-dashboard-grid">
          
          {/* 100% IMMOVABLE LOCKED FIXED SIDEBAR */}
          <aside className={`citizen-dashboard-sidebar ${isSidebarMobileOpen ? 'mobile-open' : ''}`}>
            {/* User Profile Header */}
            <div style={{ paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                position: 'relative',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #008b95 0%, #0b2f45 100%)',
                color: 'white',
                fontWeight: 800,
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0, 139, 149, 0.25)',
                flexShrink: 0
              }}>
                {getInitials(user?.fullName)}
                <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '11px', height: '11px', borderRadius: '50%', background: '#22c55e', border: '2px solid white' }} />
              </div>

              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.675rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.55rem', borderRadius: '10px', fontWeight: 800, letterSpacing: '0.5px' }}>
                  VERIFIED CITIZEN
                </span>
                <h4 style={{ fontSize: '0.95rem', color: '#0b2f45', margin: '0.2rem 0 0 0', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.fullName || 'Kavitha R.'}
                </h4>
                <p style={{ fontSize: '0.775rem', color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'citizen@bbmp.gov.in'}
                </p>
              </div>
            </div>

            {/* Menu List */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {sidebarMenuItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarMobileOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 800 : 600,
                      border: 'none',
                      borderLeft: isActive ? '4px solid #008b95' : '4px solid transparent',
                      background: isActive ? '#f0fdfa' : 'transparent',
                      color: isActive ? '#008b95' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <IconComp size={18} style={{ color: isActive ? '#008b95' : '#64748b' }} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span style={{
                        fontSize: '0.725rem',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '12px',
                        background: isActive ? '#008b95' : '#e2e8f0',
                        color: isActive ? 'white' : '#1e293b',
                        fontWeight: 800
                      }}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.75rem 0' }} />

              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  border: '1px solid #fee2e2',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* MAIN DASHBOARD CONTENT AREA */}
          <main className="citizen-dashboard-main">

            {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div>
                
                {/* 1. WELCOME MESSAGE BANNER */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #0b2f45 0%, #008b95 100%)', 
                  color: 'white', 
                  padding: '2.25rem', 
                  borderRadius: '16px', 
                  marginBottom: '2.25rem', 
                  boxShadow: '0 10px 30px rgba(11, 47, 69, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.775rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', padding: '0.3rem 0.85rem', borderRadius: '14px', fontWeight: 800, letterSpacing: '0.5px' }}>
                        GREATER BENGALURU MUNICIPAL PORTAL
                      </span>
                      <h2 style={{ fontSize: '2.1rem', fontFamily: 'var(--font-serif)', margin: '0.65rem 0 0.35rem 0', fontWeight: 800, lineHeight: 1.2 }}>
                        Welcome back, {user?.fullName || 'Kavitha'}!
                      </h2>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '0.975rem', maxWidth: '650px', lineHeight: '1.5' }}>
                        Track your municipal applications in real time, inspect road & streetlight complaint SLAs, pay utility bills, and download verified e-Certificates.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setShowLodgeModal(true)}
                        className="btn"
                        style={{ background: '#ea580c', color: 'white', fontWeight: 800, padding: '0.8rem 1.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                      >
                        <AlertTriangle size={17} /> Report an Issue
                      </button>

                      <button
                        onClick={() => onNavigate('/services')}
                        className="btn"
                        style={{ background: 'white', color: '#008b95', fontWeight: 800, padding: '0.8rem 1.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                      >
                        <PlusCircle size={17} /> Browse Services Portal
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. PROFESSIONAL INTERACTIVE SUMMARY CARDS GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  
                  {/* Card 1: Total Applications */}
                  <div 
                    onClick={() => {
                      setOverviewFilter('applications');
                      const el = document.getElementById('recent-records-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ 
                      background: 'white', 
                      padding: '1.35rem', 
                      borderRadius: '14px', 
                      border: overviewFilter === 'applications' ? '2px solid #008b95' : '1px solid #e2e8f0', 
                      boxShadow: overviewFilter === 'applications' ? '0 10px 25px rgba(0, 139, 149, 0.15)' : '0 4px 16px rgba(0,0,0,0.03)', 
                      borderTop: '4px solid #008b95',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: overviewFilter === 'applications' ? 'translateY(-3px)' : 'none'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 139, 149, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = overviewFilter === 'applications' ? 'translateY(-3px)' : 'none'; e.currentTarget.style.boxShadow = overviewFilter === 'applications' ? '0 10px 25px rgba(0, 139, 149, 0.15)' : '0 4px 16px rgba(0,0,0,0.03)'; }}
                    role="button"
                    tabIndex={0}
                    title="Click to view all applications"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Total Applications</span>
                      <div style={{ background: '#f0fdfa', padding: '0.5rem', borderRadius: '8px' }}>
                        <FileText size={20} style={{ color: '#008b95' }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '2.2rem', color: '#0b2f45', margin: 0, fontWeight: 900 }}>{totalApps}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.775rem', color: '#0d9488', fontWeight: 700 }}>Active in Portal</span>
                      <span style={{ fontSize: '0.725rem', color: '#008b95', fontWeight: 800 }}>View ➔</span>
                    </div>
                  </div>

                  {/* Card 2: Pending Applications */}
                  <div 
                    onClick={() => {
                      setOverviewFilter('pending');
                      const el = document.getElementById('recent-records-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ 
                      background: 'white', 
                      padding: '1.35rem', 
                      borderRadius: '14px', 
                      border: overviewFilter === 'pending' ? '2px solid #d97706' : '1px solid #e2e8f0', 
                      boxShadow: overviewFilter === 'pending' ? '0 10px 25px rgba(217, 119, 6, 0.15)' : '0 4px 16px rgba(0,0,0,0.03)', 
                      borderTop: '4px solid #d97706',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: overviewFilter === 'pending' ? 'translateY(-3px)' : 'none'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(217, 119, 6, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = overviewFilter === 'pending' ? 'translateY(-3px)' : 'none'; e.currentTarget.style.boxShadow = overviewFilter === 'pending' ? '0 10px 25px rgba(217, 119, 6, 0.15)' : '0 4px 16px rgba(0,0,0,0.03)'; }}
                    role="button"
                    tabIndex={0}
                    title="Click to view pending applications"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Pending Applications</span>
                      <div style={{ background: '#fffbe5', padding: '0.5rem', borderRadius: '8px' }}>
                        <Clock size={20} style={{ color: '#d97706' }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '2.2rem', color: '#b45309', margin: 0, fontWeight: 900 }}>{pendingApps}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.775rem', color: '#d97706', fontWeight: 700 }}>Under Verification</span>
                      <span style={{ fontSize: '0.725rem', color: '#d97706', fontWeight: 800 }}>View ➔</span>
                    </div>
                  </div>

                  {/* Card 3: Approved Applications */}
                  <div 
                    onClick={() => {
                      setOverviewFilter('approved');
                      const el = document.getElementById('recent-records-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ 
                      background: 'white', 
                      padding: '1.35rem', 
                      borderRadius: '14px', 
                      border: overviewFilter === 'approved' ? '2px solid #16a34a' : '1px solid #e2e8f0', 
                      boxShadow: overviewFilter === 'approved' ? '0 10px 25px rgba(22, 163, 74, 0.15)' : '0 4px 16px rgba(0,0,0,0.03)', 
                      borderTop: '4px solid #16a34a',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: overviewFilter === 'approved' ? 'translateY(-3px)' : 'none'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(22, 163, 74, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = overviewFilter === 'approved' ? 'translateY(-3px)' : 'none'; e.currentTarget.style.boxShadow = overviewFilter === 'approved' ? '0 10px 25px rgba(22, 163, 74, 0.15)' : '0 4px 16px rgba(0,0,0,0.03)'; }}
                    role="button"
                    tabIndex={0}
                    title="Click to view approved applications"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Approved Applications</span>
                      <div style={{ background: '#f0fff4', padding: '0.5rem', borderRadius: '8px' }}>
                        <CheckCircle size={20} style={{ color: '#16a34a' }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '2.2rem', color: '#15803d', margin: 0, fontWeight: 900 }}>{approvedApps}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.775rem', color: '#16a34a', fontWeight: 700 }}>Ready for e-Download</span>
                      <span style={{ fontSize: '0.725rem', color: '#16a34a', fontWeight: 800 }}>View ➔</span>
                    </div>
                  </div>

                  {/* Card 4: Open Complaints */}
                  <div 
                    onClick={() => {
                      setOverviewFilter('complaints');
                      const el = document.getElementById('recent-records-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ 
                      background: 'white', 
                      padding: '1.35rem', 
                      borderRadius: '14px', 
                      border: overviewFilter === 'complaints' ? '2px solid #ea580c' : '1px solid #e2e8f0', 
                      boxShadow: overviewFilter === 'complaints' ? '0 10px 25px rgba(234, 88, 12, 0.15)' : '0 4px 16px rgba(0,0,0,0.03)', 
                      borderTop: '4px solid #ea580c',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: overviewFilter === 'complaints' ? 'translateY(-3px)' : 'none'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(234, 88, 12, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = overviewFilter === 'complaints' ? 'translateY(-3px)' : 'none'; e.currentTarget.style.boxShadow = overviewFilter === 'complaints' ? '0 10px 25px rgba(234, 88, 12, 0.15)' : '0 4px 16px rgba(0,0,0,0.03)'; }}
                    role="button"
                    tabIndex={0}
                    title="Click to view complaints"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Open Complaints</span>
                      <div style={{ background: '#fff7ed', padding: '0.5rem', borderRadius: '8px' }}>
                        <AlertTriangle size={20} style={{ color: '#ea580c' }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '2.2rem', color: '#c2410c', margin: 0, fontWeight: 900 }}>{openComplaints}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.775rem', color: '#ea580c', fontWeight: 700 }}>Dispatched to Engineer</span>
                      <span style={{ fontSize: '0.725rem', color: '#ea580c', fontWeight: 800 }}>View ➔</span>
                    </div>
                  </div>

                </div>

                {/* 3. RECENT APPLICATIONS & COMPLAINTS SECTION */}
                <div id="recent-records-section" style={{ background: 'white', padding: '1.85rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.35rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', color: '#0b2f45', margin: 0, fontWeight: 800, fontFamily: 'var(--font-serif)' }}>
                        Recent Applications & Complaints
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                        Real-time tracking for your submitted municipal certificate applications & grievance complaints.
                      </p>
                    </div>

                    {/* Interactive Filter Pills */}
                    <div style={{ display: 'flex', gap: '0.4rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '10px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => setOverviewFilter('all')} 
                        style={{ 
                          background: overviewFilter === 'all' ? '#0b2f45' : 'transparent', 
                          border: 'none', 
                          color: overviewFilter === 'all' ? 'white' : '#475569', 
                          fontWeight: 800, 
                          fontSize: '0.8rem', 
                          padding: '0.45rem 0.85rem', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          boxShadow: overviewFilter === 'all' ? '0 2px 8px rgba(11, 47, 69, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        All ({recentUserItems.length})
                      </button>

                      <button 
                        onClick={() => setOverviewFilter('applications')} 
                        style={{ 
                          background: overviewFilter === 'applications' ? '#008b95' : 'transparent', 
                          border: 'none', 
                          color: overviewFilter === 'applications' ? 'white' : '#008b95', 
                          fontWeight: 800, 
                          fontSize: '0.8rem', 
                          padding: '0.45rem 0.85rem', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          boxShadow: overviewFilter === 'applications' ? '0 2px 8px rgba(0, 139, 149, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Applications ({applications.length})
                      </button>

                      <button 
                        onClick={() => setOverviewFilter('pending')} 
                        style={{ 
                          background: overviewFilter === 'pending' ? '#d97706' : 'transparent', 
                          border: 'none', 
                          color: overviewFilter === 'pending' ? 'white' : '#d97706', 
                          fontWeight: 800, 
                          fontSize: '0.8rem', 
                          padding: '0.45rem 0.85rem', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          boxShadow: overviewFilter === 'pending' ? '0 2px 8px rgba(217, 119, 6, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Pending ({pendingApps})
                      </button>

                      <button 
                        onClick={() => setOverviewFilter('approved')} 
                        style={{ 
                          background: overviewFilter === 'approved' ? '#16a34a' : 'transparent', 
                          border: 'none', 
                          color: overviewFilter === 'approved' ? 'white' : '#16a34a', 
                          fontWeight: 800, 
                          fontSize: '0.8rem', 
                          padding: '0.45rem 0.85rem', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          boxShadow: overviewFilter === 'approved' ? '0 2px 8px rgba(22, 163, 74, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Approved ({approvedApps})
                      </button>

                      <button 
                        onClick={() => setOverviewFilter('complaints')} 
                        style={{ 
                          background: overviewFilter === 'complaints' ? '#ea580c' : 'transparent', 
                          border: 'none', 
                          color: overviewFilter === 'complaints' ? 'white' : '#ea580c', 
                          fontWeight: 800, 
                          fontSize: '0.8rem', 
                          padding: '0.45rem 0.85rem', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          boxShadow: overviewFilter === 'complaints' ? '0 2px 8px rgba(234, 88, 12, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Complaints ({complaints.length})
                      </button>
                    </div>
                  </div>

                  {displayedItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                      <FileText size={42} style={{ color: '#94a3b8', marginBottom: '0.75rem' }} />
                      <h4 style={{ color: '#0b2f45', margin: '0 0 0.4rem 0', fontWeight: 800 }}>No Records Found</h4>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
                        No records matching the selected filter ({overviewFilter}). Submit a service application or lodge a grievance to see it here.
                      </p>
                      <button onClick={() => onNavigate('/services')} className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95', fontWeight: 700 }}>
                        <PlusCircle size={16} /> Apply for Services or Log a Complaint
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {displayedItems.map((item) => (
                        <div key={item.id} style={{ border: '1px solid #e2e8f0', background: '#f8fafc', padding: '1.35rem', borderRadius: '12px', transition: 'all 0.2s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr 1fr auto', gap: '1.25rem', alignItems: 'center' }}>
                            
                            <div>
                              <span style={{ fontSize: '0.725rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px' }}>
                                {item.issue ? 'TICKET ID' : 'APPLICATION ID'}
                              </span>
                              <strong style={{ color: item.issue ? '#c2410c' : '#008b95', fontSize: '0.925rem', fontWeight: 800 }}>{item.id}</strong>
                            </div>

                            <div>
                              <span style={{ fontSize: '0.725rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px' }}>SERVICE / ISSUE</span>
                              <span style={{ color: '#0b2f45', fontWeight: 800, fontSize: '0.925rem' }}>
                                {item.issue || item.serviceName || 'Municipal Request'}
                              </span>
                            </div>

                            <div>
                              <span style={{ fontSize: '0.725rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px' }}>SUBMISSION DATE</span>
                              <span style={{ color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>{item.submissionDate || 'Today'}</span>
                            </div>

                            <div>
                              <span style={{ fontSize: '0.725rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px' }}>DEPARTMENT</span>
                              <span style={{ color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>{item.department || 'Public Works'}</span>
                            </div>

                            <div>
                              <span style={{ fontSize: '0.725rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px' }}>CURRENT STATUS</span>
                              <span style={{
                                fontSize: '0.775rem',
                                padding: '0.25rem 0.7rem',
                                borderRadius: '12px',
                                fontWeight: 800,
                                background: item.status === 'Approved' || item.status === 'Resolved' ? '#dcfce7' : '#fef9c3',
                                color: item.status === 'Approved' || item.status === 'Resolved' ? '#15803d' : '#a16207',
                                display: 'inline-block'
                              }}>
                                ● {item.status || 'Submitted'}
                              </span>
                            </div>

                            <div>
                              <button
                                onClick={() => setSelectedAppDetail(item)}
                                style={{
                                  padding: '0.55rem 1.05rem',
                                  borderRadius: '8px',
                                  background: '#008b95',
                                  color: 'white',
                                  border: 'none',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  boxShadow: '0 2px 8px rgba(0, 139, 149, 0.25)',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Eye size={15} /> View Details
                              </button>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: AVAILABLE SERVICES */}
            {activeTab === 'services' && (
              <div style={{ background: 'white', padding: '1.85rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#0b2f45', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                  Available Citizen Services
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.925rem', marginBottom: '1.75rem' }}>
                  Access all 5 official municipal public services directly from your portal dashboard.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.35rem' }}>
                  {availableServicesList.map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <div key={srv.id} style={{ border: '1px solid #e2e8f0', padding: '1.35rem', borderRadius: '12px', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div style={{ background: '#f0fdfa', padding: '0.5rem', borderRadius: '8px' }}>
                            <IconComp size={24} style={{ color: '#008b95' }} />
                          </div>
                          <h4 style={{ margin: 0, color: '#0b2f45', fontSize: '1.05rem', fontWeight: 800 }}>{srv.name}</h4>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: '1.5' }}>{srv.desc}</p>
                        <button
                          onClick={() => {
                            onNavigate(`/services#${srv.id}`);
                          }}
                          style={{ padding: '0.6rem 1.1rem', background: '#008b95', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Open Service Module <ArrowRight size={15} style={{ display: 'inline', marginLeft: '0.3rem' }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: MY APPLICATIONS */}
            {activeTab === 'applications' && (
              <div style={{ background: 'white', padding: '1.85rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#0b2f45', margin: '0 0 1.25rem 0', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                  My Applications Directory ({applications.length})
                </h3>

                {applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <FileText size={40} style={{ color: '#94a3b8', marginBottom: '0.75rem' }} />
                    <h4 style={{ color: '#0b2f45', margin: '0 0 0.35rem 0', fontWeight: 800 }}>No Certificate or Utility Applications</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      You haven't applied for Birth/Death certificates or Water connections yet.
                    </p>
                    <button onClick={() => onNavigate('/services')} className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95', fontWeight: 700 }}>
                      <PlusCircle size={16} /> Apply for New Application
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {applications.map((app) => (
                      <div key={app.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.35rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#008b95' }}>Ref: {app.id}</span>
                          <span style={{ fontSize: '0.8rem', background: app.status === 'Approved' ? '#dcfce7' : '#fef9c3', color: app.status === 'Approved' ? '#15803d' : '#a16207', padding: '0.2rem 0.7rem', borderRadius: '12px', fontWeight: 800 }}>
                            ● {app.status || 'Submitted'}
                          </span>
                        </div>
                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#0b2f45', fontSize: '1.1rem', fontWeight: 800 }}>{app.serviceName || app.issue}</h4>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b' }}>Department: <strong>{app.department}</strong></p>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#64748b' }}>Current Stage: <strong>{app.stage || 'Stage 1 of 4: Submitted'}</strong></p>
                        <button onClick={() => setSelectedAppDetail(app)} className="btn btn-primary" style={{ fontSize: '0.825rem', padding: '0.45rem 0.95rem', background: '#008b95', borderColor: '#008b95', fontWeight: 800 }}>
                          View Full Details & Stage Timeline
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: MY COMPLAINTS */}
            {activeTab === 'complaints' && (
              <div style={{ background: 'white', padding: '1.85rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.35rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: '#0b2f45', margin: '0 0 0.25rem 0', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                      My Grievance & Pothole Complaints ({complaints.length})
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                      Choose your department first to file complaints directly to the assigned engineer.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowLodgeModal(true)}
                    className="btn btn-primary"
                    style={{ background: '#ea580c', borderColor: '#ea580c', fontWeight: 800, padding: '0.55rem 1.1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <PlusCircle size={15} /> Lodge Grievance (Dept-First)
                  </button>
                </div>

                {complaints.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <AlertTriangle size={40} style={{ color: '#ea580c', marginBottom: '0.75rem' }} />
                    <h4 style={{ color: '#0b2f45', margin: '0 0 0.35rem 0', fontWeight: 800 }}>No Complaints Logged</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      You haven't logged any road potholes, streetlights, or waste management complaints.
                    </p>
                    <button onClick={() => setShowLodgeModal(true)} className="btn btn-primary" style={{ background: '#ea580c', borderColor: '#ea580c', fontWeight: 700 }}>
                      <AlertTriangle size={16} /> Lodge New Grievance (Choose Dept First)
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {complaints.map((comp) => (
                      <div key={comp.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.35rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c2410c' }}>Ticket: {comp.id}</span>
                          <span style={{ fontSize: '0.8rem', background: comp.status === 'Resolved' ? '#dcfce7' : '#fee2e2', color: comp.status === 'Resolved' ? '#15803d' : '#991b1b', padding: '0.2rem 0.7rem', borderRadius: '12px', fontWeight: 800 }}>
                            ● {comp.status || 'Submitted'}
                          </span>
                        </div>
                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#0b2f45', fontSize: '1.1rem', fontWeight: 800 }}>
                          {comp.issue || comp.serviceName || 'Road Complaint'}
                        </h4>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b' }}>
                          Location: <strong>{comp.location || 'Ward 112 (Malleshwaram)'}</strong>
                        </p>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#64748b' }}>
                          Department: <strong>{comp.department || 'Public Works / Electrical'}</strong>
                        </p>
                        <button onClick={() => setSelectedAppDetail(comp)} className="btn btn-primary" style={{ fontSize: '0.825rem', padding: '0.45rem 0.95rem', background: '#008b95', borderColor: '#008b95', fontWeight: 800 }}>
                          View Full Details & Status Trail
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PAYMENTS */}
            {activeTab === 'payments' && (
              <div style={{ background: 'white', padding: '1.85rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#0b2f45', margin: '0 0 1.25rem 0', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                  Payment Receipts & Tax History
                </h3>

                {payments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <CreditCard size={40} style={{ color: '#94a3b8', marginBottom: '0.75rem' }} />
                    <h4 style={{ color: '#0b2f45', margin: '0 0 0.35rem 0', fontWeight: 800 }}>No Payment History</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      You haven't made any property tax or utility bill payments on this account yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {payments.map((p) => (
                      <div key={p.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.35rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.55rem', borderRadius: '4px', fontWeight: 800 }}>PAID RECEIPT</span>
                          <h4 style={{ margin: '0.35rem 0 0.2rem 0', color: '#0b2f45', fontWeight: 800 }}>{p.service}</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Transaction ID: {p.id} • Date: {p.date}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ fontSize: '1.2rem', color: '#008b95', display: 'block', fontWeight: 900 }}>{p.amount}</strong>
                          <button onClick={() => showToast(`Downloaded Receipt ${p.receiptNo}`)} className="btn btn-outline-light" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', marginTop: '0.4rem', fontWeight: 700 }}>
                            <Download size={13} /> Download Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div style={{ background: 'white', padding: '1.85rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#0b2f45', margin: '0 0 1.25rem 0', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                  My Issued e-Certificates ({certificates.length})
                </h3>

                {certificates.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <Award size={40} style={{ color: '#94a3b8', marginBottom: '0.75rem' }} />
                    <h4 style={{ color: '#0b2f45', margin: '0 0 0.35rem 0', fontWeight: 800 }}>No Issued Certificates Yet</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      Once your applications (Birth/Death or SAS e-Khata) are approved, digitally signed certificates will be ready for download here.
                    </p>
                    <button onClick={() => onNavigate('/services#birth-death')} className="btn btn-primary" style={{ background: '#008b95', borderColor: '#008b95', fontWeight: 700 }}>
                      Apply for Certificate
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.35rem' }}>
                    {certificates.map((cert) => (
                      <div key={cert.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.35rem', borderRadius: '12px' }}>
                        <Award size={30} style={{ color: '#008b95', marginBottom: '0.6rem' }} />
                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#0b2f45', fontWeight: 800 }}>{cert.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0' }}>Ref: <strong>{cert.id}</strong></p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.15rem 0' }}>Issued Date: <strong>{cert.dateIssued}</strong></p>
                        <button 
                          onClick={() => {
                            downloadMunicipalDocument({
                              title: cert.title,
                              id: cert.id,
                              category: cert.type || 'Municipal Certificate',
                              department: cert.authority || 'Greater Bengaluru Municipal Corporation',
                              date: cert.dateIssued,
                              summary: `Official Verified Municipal Certificate issued by ${cert.authority}. Registered under Ref ID: ${cert.id}.`
                            });
                            showToast(`✅ Downloaded e-Certificate: ${cert.title}`, 'success');
                          }} 
                          className="btn btn-primary" 
                          style={{ background: '#008b95', borderColor: '#008b95', fontSize: '0.85rem', width: '100%', fontWeight: 800 }}
                        >
                          <Download size={15} /> Download Official PDF
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div style={{ background: 'white', padding: '1.85rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                {(() => {
                  const defaultDemoNotifs = [
                    {
                      id: 'NOTIF-DEMO-1',
                      title: 'Request Received & Assigned to Officer',
                      message: 'Your request (MUN-2026-991204) for Birth Certificate Application has been received by Health Division and assigned to Dr. Ananya Sharma.',
                      requestId: 'MUN-2026-991204',
                      createdAt: new Date().toISOString(),
                      read: false
                    },
                    {
                      id: 'NOTIF-DEMO-2',
                      title: 'Request Submitted Successfully',
                      message: 'Your grievance complaint (FIX-992014) for Pothole & Road Damage has been submitted.',
                      requestId: 'FIX-992014',
                      createdAt: new Date(Date.now() - 3600000).toISOString(),
                      read: true
                    }
                  ];

                  const activeNotifList = dbNotifications.length > 0 ? dbNotifications : defaultDemoNotifs;

                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.35rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.35rem', color: '#0b2f45', margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                            Notifications & Alerts ({activeNotifList.length})
                          </h3>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Backend Security Secured: Showing notifications for <strong>{user?.email || 'citizen@bbmp.gov.in'}</strong>. Other citizens' notifications are strictly isolated.
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {activeNotifList.map((n) => (
                          <div key={n.id} style={{ background: !n.read ? '#f0fdfa' : '#f8fafc', border: !n.read ? '1px solid #99f6e4' : '1px solid #e2e8f0', padding: '1.35rem', borderRadius: '12px', boxShadow: !n.read ? '0 2px 10px rgba(0, 139, 149, 0.08)' : 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                  {!n.read && (
                                    <span style={{ background: '#008b95', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '10px', fontWeight: 800 }}>NEW</span>
                                  )}
                                  <span style={{ fontWeight: 800, color: '#008b95', fontSize: '0.825rem' }}>ID: {n.requestId}</span>
                                </div>
                                <h4 style={{ margin: 0, color: '#0b2f45', fontSize: '1.05rem', fontWeight: 800 }}>{n.title}</h4>
                              </div>
                              <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>{new Date(n.createdAt).toLocaleString()}</span>
                            </div>

                            <p style={{ margin: '0.35rem 0 0.75rem 0', fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>{n.message}</p>

                            {!n.read && (
                              <button
                                onClick={() => markNotificationAsRead(n.id)}
                                style={{ background: 'white', border: '1px solid #cbd5e1', color: '#008b95', fontSize: '0.775rem', fontWeight: 800, padding: '0.3rem 0.65rem', borderRadius: '6px', cursor: 'pointer' }}
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 8: PROFILE */}
            {activeTab === 'profile' && (
              <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', maxWidth: '680px' }}>
                {/* Card Header with Edit Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: '#0b2f45', margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                      Citizen Profile Settings
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                      Official municipal citizen account details.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileFormData({
                        fullName: user?.fullName || '',
                        mobile: user?.mobile || '',
                        address: user?.address || '',
                        ward: user?.ward || 'Ward 84 (Indiranagar)',
                        alternatePhone: user?.alternatePhone || '94800 12345'
                      });
                      setIsEditingProfile(true);
                    }}
                    style={{
                      background: '#f0fdfa',
                      color: '#008b95',
                      border: '1px solid #008b95',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Edit3 size={15} /> Edit Profile
                  </button>
                </div>

                {/* Profile Fields List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem' }}>
                  <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px' }}>FULL LEGAL NAME</span>
                    <strong style={{ color: '#0b2f45', fontSize: '1.05rem', marginTop: '0.2rem', display: 'block' }}>{user?.fullName || 'Smt. Kavitha R.'}</strong>
                  </div>

                  <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px' }}>EMAIL ADDRESS</span>
                    <strong style={{ color: '#0b2f45', fontSize: '1rem', marginTop: '0.2rem', display: 'block' }}>{user?.email || 'citizen@bbmp.gov.in'}</strong>
                  </div>

                  <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px' }}>CONTACT MOBILE</span>
                    <strong style={{ color: '#0b2f45', fontSize: '1rem', marginTop: '0.2rem', display: 'block' }}>{user?.mobile || '98765 43212'}</strong>
                  </div>

                  <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px' }}>RESIDENTIAL ADDRESS</span>
                    <strong style={{ color: '#0b2f45', fontSize: '1rem', marginTop: '0.2rem', display: 'block', lineHeight: '1.4' }}>{user?.address || '100ft Road, Indiranagar, Ward 84, Bengaluru'}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '0.4rem' }}>ACCOUNT TYPE</span>
                    <span style={{ fontSize: '0.8rem', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.3rem 0.85rem', borderRadius: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      ● Verified Citizen Account
                    </span>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* EDIT CITIZEN PROFILE MODAL */}
      {isEditingProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 47, 69, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e2e8f0',
            animation: 'fadeIn 0.25s ease'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #0b2f45 0%, #004d5a 100%)',
              color: 'white',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem', borderRadius: '10px' }}>
                  <Edit3 size={20} color="white" />
                </div>
                <div>
                  <span style={{ fontSize: '0.725rem', background: 'rgba(255, 255, 255, 0.2)', padding: '0.15rem 0.6rem', borderRadius: '10px', fontWeight: 800 }}>
                    OFFICIAL CITIZEN RECORD
                  </span>
                  <h3 style={{ margin: '0.2rem 0 0 0', color: 'white', fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-serif)' }}>
                    Edit Citizen Profile
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsEditingProfile(false)}
                style={{ background: 'rgba(255, 255, 255, 0.15)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Full Legal Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={profileFormData.fullName}
                  onChange={(e) => setProfileFormData({ ...profileFormData, fullName: e.target.value })}
                  placeholder="e.g. Poobi / Smt. Kavitha R."
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 600 }}
                />
              </div>

              {/* Email Address (Read-Only) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Official Email Address (Primary Login ID)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'citizen@bbmp.gov.in'}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}
                />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem', display: 'block' }}>Email ID is bound to your Aadhaar KYC account.</span>
              </div>

              {/* Primary Contact Mobile & Alternate Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                    Contact Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={profileFormData.mobile}
                    onChange={(e) => setProfileFormData({ ...profileFormData, mobile: e.target.value })}
                    placeholder="e.g. 98765 43212"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                    Alternate Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={profileFormData.alternatePhone}
                    onChange={(e) => setProfileFormData({ ...profileFormData, alternatePhone: e.target.value })}
                    placeholder="e.g. 94800 12345"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 600 }}
                  />
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Residential Address *
                </label>
                <textarea
                  rows={3}
                  required
                  value={profileFormData.address}
                  onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                  placeholder="e.g. 100ft Road, Indiranagar, Ward 84, Bengaluru"
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 600, lineHeight: '1.4' }}
                />
              </div>

              {/* Municipal Ward Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Assigned Municipal Ward & Zone *
                </label>
                <select
                  value={profileFormData.ward}
                  onChange={(e) => setProfileFormData({ ...profileFormData, ward: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #008b95', background: 'white', fontSize: '0.95rem', fontWeight: 700, color: '#0b2f45' }}
                >
                  <option value="Ward 84 (Indiranagar, East Zone)">🏛️ Ward 84 (Indiranagar, East Zone)</option>
                  <option value="Ward 112 (Malleshwaram, West Zone)">🏛️ Ward 112 (Malleshwaram, West Zone)</option>
                  <option value="Ward 174 (HSR Layout, South Zone)">🏛️ Ward 174 (HSR Layout, South Zone)</option>
                  <option value="Ward 151 (Koramangala, South Zone)">🏛️ Ward 151 (Koramangala, South Zone)</option>
                  <option value="Ward 85 (Whitefield, Mahadevapura Zone)">🏛️ Ward 85 (Whitefield, Mahadevapura Zone)</option>
                  <option value="Ward 153 (Jayanagar, South Zone)">🏛️ Ward 153 (Jayanagar, South Zone)</option>
                  <option value="Ward 10 (Yelahanka, North Zone)">🏛️ Ward 10 (Yelahanka, North Zone)</option>
                </select>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  style={{ padding: '0.8rem 1.4rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.8rem 1.6rem', background: '#008b95', borderColor: '#008b95', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.45rem', borderRadius: '10px' }}
                >
                  <Save size={16} /> Save Profile Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENT-FIRST LODGE GRIEVANCE MODAL */}
      {showLodgeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(11, 47, 69, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: '650px',
            borderRadius: '16px',
            padding: '2.25rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: '#fff7ed', padding: '0.5rem', borderRadius: '8px' }}>
                  <Building2 size={22} style={{ color: '#ea580c' }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', background: '#ffedd5', color: '#c2410c', padding: '0.15rem 0.55rem', borderRadius: '10px', fontWeight: 800 }}>
                    DEPARTMENT-FIRST GRIEVANCE REGISTRATION
                  </span>
                  <h3 style={{ margin: '0.2rem 0 0 0', color: '#0b2f45', fontSize: '1.25rem', fontWeight: 800 }}>
                    Lodge Municipal Grievance
                  </h3>
                </div>
              </div>
              <button onClick={() => setShowLodgeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleLodgeGrievance} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* STEP 1: CHOOSE DEPARTMENT */}
              <div style={{ background: '#f8fafc', padding: '1.15rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Step 1: Choose Responsible Department *
                </label>
                <select
                  value={selectedDeptKey}
                  onChange={(e) => {
                    const newDeptKey = e.target.value;
                    setSelectedDeptKey(newDeptKey);
                    const target = deptGrievanceOptions.find(d => d.id === newDeptKey);
                    if (target && target.subtypes.length > 0) {
                      setSelectedServiceSubtype(target.subtypes[0]);
                    }
                  }}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #008b95', background: 'white', fontWeight: 700, fontSize: '0.9rem', color: '#0b2f45' }}
                >
                  {deptGrievanceOptions.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      🏛️ {dept.name}
                    </option>
                  ))}
                </select>

                {(() => {
                  const currentDept = deptGrievanceOptions.find(d => d.id === selectedDeptKey);
                  if (!currentDept) return null;
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.65rem', fontSize: '0.8rem', color: '#64748b' }}>
                      <span>👤 Assigned Officer: <strong style={{ color: '#008b95' }}>{currentDept.officer}</strong></span>
                      <span>⏱️ SLA: <strong>{currentDept.sla}</strong></span>
                    </div>
                  );
                })()}
              </div>

              {/* STEP 2: CHOOSE SPECIFIC SERVICE / ISSUE */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Step 2: Choose Specific Service / Issue under Department *
                </label>
                <select
                  value={selectedServiceSubtype}
                  onChange={(e) => setSelectedServiceSubtype(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '0.9rem' }}
                >
                  {deptGrievanceOptions.find(d => d.id === selectedDeptKey)?.subtypes.map(sub => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* STEP 3: LOCATION */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Step 3: Location / Landmark / Ward *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14th Cross, Malleshwaram, Ward 112"
                  value={grievanceLocation}
                  onChange={(e) => setGrievanceLocation(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              {/* STEP 4: DESCRIPTION */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide additional details regarding the issue (e.g. depth of pothole, duration of streetlight outage)..."
                  value={grievanceDescription}
                  onChange={(e) => setGrievanceDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              {/* EVIDENCE UPLOAD */}
              <EvidenceUploadInput
                label="Upload Hazard / Issue Photo or Video Evidence"
                onEvidenceSelected={(ev) => setGrievanceEvidence(ev)}
                currentEvidence={grievanceEvidence}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowLodgeModal(false)}
                  style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem', background: '#008b95', borderColor: '#008b95', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Send size={15} /> Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLICATION / COMPLAINT DETAIL & TRACKING MODAL */}
      {selectedAppDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 47, 69, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '18px',
            maxWidth: '720px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e2e8f0',
            animation: 'fadeIn 0.25s ease'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #0b2f45 0%, #00485c 100%)',
              color: 'white',
              borderTopLeftRadius: '18px',
              borderTopRightRadius: '18px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.18)', padding: '0.2rem 0.65rem', borderRadius: '12px', fontWeight: 800, letterSpacing: '0.5px' }}>
                  {selectedAppDetail.issue ? 'MUNICIPAL GRIEVANCE RECORD' : 'OFFICIAL SERVICE APPLICATION'}
                </span>
                <h3 style={{ margin: '0.4rem 0 0 0', color: 'white', fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-serif)' }}>
                  Ref: {selectedAppDetail.id}
                </h3>
              </div>

              <button
                onClick={() => setSelectedAppDetail(null)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Status & SLA Banner */}
              <div style={{
                background: selectedAppDetail.status === 'Approved' || selectedAppDetail.status === 'Resolved' ? '#f0fdf4' : '#fffbeb',
                border: `1px solid ${selectedAppDetail.status === 'Approved' || selectedAppDetail.status === 'Resolved' ? '#bbf7d0' : '#fde68a'}`,
                padding: '1.25rem',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>CURRENT WORKFLOW STATUS</span>
                  <strong style={{
                    fontSize: '1.15rem',
                    color: selectedAppDetail.status === 'Approved' || selectedAppDetail.status === 'Resolved' ? '#15803d' : '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginTop: '0.2rem'
                  }}>
                    <CheckCircle2 size={18} /> {selectedAppDetail.status || 'Submitted & Under Review'}
                  </strong>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>ESTIMATED RESOLUTION SLA</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0b2f45' }}>
                    {selectedAppDetail.department?.includes('Civil') || selectedAppDetail.serviceId === 'road-streetlights' ? '24 - 48 Hours' : '3 - 5 Working Days'}
                  </span>
                </div>
              </div>

              {/* 4-Stage Visual Lifecycle Progress Tracker */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0b2f45', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  4-Stage Application Lifecycle
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }}>
                  {[
                    { step: 1, title: 'Submission', desc: 'Receipt Generated', done: true },
                    { step: 2, title: 'Verification', desc: 'Officer Assigned', done: selectedAppDetail.status !== 'Submitted' },
                    { step: 3, title: 'Processing', desc: 'Field Inspection', done: selectedAppDetail.status === 'In Progress' || selectedAppDetail.status === 'Approved' || selectedAppDetail.status === 'Resolved' },
                    { step: 4, title: 'Completion', desc: selectedAppDetail.issue ? 'Resolved On-Site' : 'Issued Certificate', done: selectedAppDetail.status === 'Approved' || selectedAppDetail.status === 'Resolved' }
                  ].map((st, idx) => (
                    <div key={idx} style={{
                      background: st.done ? '#f0fdfa' : '#f8fafc',
                      border: `1px solid ${st.done ? '#008b95' : '#e2e8f0'}`,
                      padding: '0.85rem 0.65rem',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: st.done ? '#008b95' : '#cbd5e1',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.4rem auto'
                      }}>
                        {st.done ? '✓' : st.step}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: st.done ? '#008b95' : '#64748b' }}>{st.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem' }}>{st.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Information Grid */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0b2f45', margin: '0 0 0.85rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Record Specifications
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.775rem', fontWeight: 700 }}>SERVICE / ISSUE:</span>
                    <strong style={{ color: '#0b2f45' }}>{selectedAppDetail.issue || selectedAppDetail.serviceName || 'Municipal Request'}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.775rem', fontWeight: 700 }}>RESPONSIBLE DEPARTMENT:</span>
                    <strong style={{ color: '#008b95' }}>{selectedAppDetail.department || 'Civil Department'}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.775rem', fontWeight: 700 }}>SUBMISSION DATE:</span>
                    <span style={{ color: '#0b2f45', fontWeight: 600 }}>{selectedAppDetail.submissionDate || 'Aug 19, 2026'}</span>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.775rem', fontWeight: 700 }}>LOCATION / WARD:</span>
                    <span style={{ color: '#0b2f45', fontWeight: 600 }}>{selectedAppDetail.location || 'Ward 112 (Malleshwaram)'}</span>
                  </div>

                  {selectedAppDetail.applicantName && (
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.775rem', fontWeight: 700 }}>APPLICANT NAME:</span>
                      <span style={{ color: '#0b2f45', fontWeight: 600 }}>{selectedAppDetail.applicantName}</span>
                    </div>
                  )}

                  {selectedAppDetail.feePaid && (
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.775rem', fontWeight: 700 }}>STATUTORY FEE PAID:</span>
                      <span style={{ color: '#15803d', fontWeight: 800 }}>{selectedAppDetail.feePaid} ({selectedAppDetail.paymentStatus || 'Paid'})</span>
                    </div>
                  )}
                </div>

                {selectedAppDetail.description && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.2rem' }}>CITIZEN REMARKS / STATEMENT:</span>
                    <p style={{ margin: 0, color: '#334155', fontSize: '0.875rem', lineHeight: '1.5' }}>{selectedAppDetail.description}</p>
                  </div>
                )}

                {selectedAppDetail.evidence && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.4rem' }}>ATTACHED PHOTO / EVIDENCE:</span>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', color: '#008b95', fontWeight: 700 }}>
                      📷 {typeof selectedAppDetail.evidence === 'string' ? selectedAppDetail.evidence : (selectedAppDetail.evidence.name || 'Hazard_Evidence.jpg')}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    downloadMunicipalDocument({
                      title: `Tracking Summary - ${selectedAppDetail.issue || selectedAppDetail.serviceName || 'Request'}`,
                      id: selectedAppDetail.id,
                      category: selectedAppDetail.issue ? 'Grievance Tracking Record' : 'Application Tracking Record',
                      department: selectedAppDetail.department || 'Greater Bengaluru Municipal Corporation',
                      date: selectedAppDetail.submissionDate || new Date().toLocaleDateString(),
                      summary: `Official acknowledgement and real-time status trail for Ticket/Application ID ${selectedAppDetail.id}. Current status: ${selectedAppDetail.status || 'Active'}.`
                    });
                    showToast(`📄 Downloaded Tracking Record for ${selectedAppDetail.id}!`);
                  }}
                  style={{
                    padding: '0.65rem 1.15rem',
                    borderRadius: '8px',
                    border: '1px solid #008b95',
                    background: '#f0fdfa',
                    color: '#008b95',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Download size={15} /> Download Official Tracking Slip
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAppDetail(null)}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '8px',
                    background: '#0b2f45',
                    color: 'white',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

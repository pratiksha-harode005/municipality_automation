import React, { useState } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { 
  Briefcase, AlertCircle, CheckCircle, Clock, MapPin, Send, 
  ShieldCheck, LogOut, Check, FileText, Eye, FileSearch, Video, 
  AlertTriangle, FileUp, X, Info, ArrowLeft, Filter, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMunicipalData } from '../../context/DataContext';

export const OfficerDashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { showToast, getAuthorizedOfficerQueue, updateRequestStatus, data } = useMunicipalData();

  // MANDATORY BACKEND AUTHORIZATION FILTER:
  // Returns requests the logged-in officer is authorized to access.
  const authorizedRequests = getAuthorizedOfficerQueue(user) || [];

  // Fallback demo queue
  const defaultDemoQueue = [
    {
      id: 'MUN-2026-992014',
      citizenName: 'Smt. Kavitha R.',
      citizenEmail: 'citizen@bbmp.gov.in',
      serviceName: 'Road & Streetlight Complaints',
      department: user?.department || 'Public Works / Electrical Department',
      wardName: user?.ward || 'Ward 112 (Malleshwaram)',
      submissionDate: 'Aug 14, 2026',
      status: 'Submitted',
      assignedOfficerName: user?.fullName || 'Er. Rajesh Kumar',
      notes: 'Dispatched road asphalt repair vehicle.'
    },
    {
      id: 'MUN-2026-881204',
      citizenName: 'Sri Anand Kumar',
      citizenEmail: 'anand@bbmp.gov.in',
      serviceName: 'Road & Streetlight Complaints',
      department: user?.department || 'Public Works / Electrical Department',
      wardName: user?.ward || 'Ward 112 (Malleshwaram)',
      submissionDate: 'Aug 12, 2026',
      status: 'In Progress',
      assignedOfficerName: user?.fullName || 'Er. Rajesh Kumar',
      notes: 'LED street light fixture replaced.'
    },
    {
      id: 'MUN-2026-771920',
      citizenName: 'Smt. Lakshmi R.',
      citizenEmail: 'lakshmi@bbmp.gov.in',
      serviceName: 'Road & Streetlight Complaints',
      department: user?.department || 'Public Works / Electrical Department',
      wardName: user?.ward || 'Ward 112 (Malleshwaram)',
      submissionDate: 'Aug 10, 2026',
      status: 'Documents Required',
      assignedOfficerName: user?.fullName || 'Er. Rajesh Kumar',
      notes: 'Awaiting site verification photo.'
    }
  ];

  // All Live Portal Requests
  const allPortalRequests = [
    ...(data?.citizenServiceRequests || []),
    ...defaultDemoQueue.filter(demo => !(data?.citizenServiceRequests || []).some(r => r.id === demo.id))
  ];

  // Department Filter View
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL'); // 'ALL', 'MY', 'WATER', 'VITAL'
  // Status Filter View
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Modal & Action State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('details'); // 'details', 'evidence', 'action'
  const [newStatus, setNewStatus] = useState('In Progress');
  const [officerRemarks, setOfficerRemarks] = useState('');

  // Department Queue
  const activeQueue = allPortalRequests.filter(r => {
    if (selectedDeptFilter === 'ALL') return true;
    if (selectedDeptFilter === 'MY') {
      const d = (r.department || '').toLowerCase();
      return d.includes('public works') || d.includes('road') || r.assignedOfficerEmail === user?.email;
    }
    if (selectedDeptFilter === 'WATER') {
      const d = (r.department || '').toLowerCase();
      return d.includes('water') || r.serviceId === 'water-sewerage';
    }
    if (selectedDeptFilter === 'VITAL') {
      const d = (r.department || '').toLowerCase();
      return d.includes('vital') || d.includes('birth') || r.serviceId === 'birth-death';
    }
    return true;
  });

  // 7 Required Dashboard Statistics Counts (calculated from activeQueue)
  const statNewRequests = activeQueue.filter(r => r.status === 'Submitted').length;
  const statAssignedRequests = activeQueue.filter(r => r.status === 'Assigned' || r.status === 'Submitted').length;
  const statPendingVerification = activeQueue.filter(r => r.status === 'Under Verification').length;
  const statDocsRequired = activeQueue.filter(r => r.status === 'Documents Required').length;
  const statInProgress = activeQueue.filter(r => r.status === 'In Progress' || r.status === 'Under Processing').length;
  const statCompleted = activeQueue.filter(r => r.status === 'Completed' || r.status === 'Approved' || r.status === 'Resolved').length;
  const statRejected = activeQueue.filter(r => r.status === 'Rejected').length;

  // Filtered Queue based on selected status card
  const filteredQueue = activeQueue.filter(r => {
    if (selectedStatusFilter === 'ALL') return true;
    if (selectedStatusFilter === 'Submitted') return r.status === 'Submitted';
    if (selectedStatusFilter === 'Assigned') return r.status === 'Assigned' || r.status === 'Submitted';
    if (selectedStatusFilter === 'Under Verification') return r.status === 'Under Verification';
    if (selectedStatusFilter === 'Documents Required') return r.status === 'Documents Required';
    if (selectedStatusFilter === 'In Progress') return r.status === 'In Progress' || r.status === 'Under Processing';
    if (selectedStatusFilter === 'Completed') return r.status === 'Completed' || r.status === 'Approved' || r.status === 'Resolved';
    if (selectedStatusFilter === 'Rejected') return r.status === 'Rejected';
    return true;
  });

  const openInspectModal = (request, defaultTab = 'details') => {
    setSelectedRequest(request);
    setActiveModalTab(defaultTab);
    setNewStatus(request.status === 'Documents Required' ? 'Under Verification' : request.status || 'In Progress');
    setOfficerRemarks('');
  };

  const handleStatusUpdateSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const success = updateRequestStatus(selectedRequest.id, newStatus, officerRemarks, user);
    if (success) {
      setSelectedRequest(null);
      setOfficerRemarks('');
    }
  };

  const handleQuickRequestDocs = (request) => {
    const success = updateRequestStatus(
      request.id, 
      'Documents Required', 
      'Official Notice: Additional identity/address proof documents required for verification.', 
      user
    );
    if (success) {
      showToast(`Requested additional documents for Request ${request.id}`, 'info');
    }
  };

  return (
    <div id="main-content">
      {/* Officer Header Banner */}
      <div style={{ background: '#f8fafc', padding: '2.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Breadcrumb items={[{ label: 'Municipal Officer Workstation' }]} onNavigate={onNavigate} />

            <button 
              onClick={logout}
              className="btn btn-outline-light"
              style={{ borderColor: '#cbd5e1', color: '#64748b' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
          
          <div>
            <span style={{ fontSize: '0.8rem', background: '#059669', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: 800 }}>
              👮 AUTHORIZED MUNICIPAL OFFICER WORKSTATION
            </span>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0 0.25rem 0', fontWeight: 800 }}>
              Officer Workstation: {user?.fullName || 'Er. Rajesh Kumar'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
              Department: <strong>{user?.department || 'Public Works / Electrical Department'}</strong> • Ward Jurisdiction: <strong>{user?.ward || 'Ward 112 (Malleshwaram)'}</strong>
            </p>
          </div>

        </div>
      </div>

      <section style={{ padding: '2.5rem 0', background: '#f1f5f9' }}>
        <div className="container">
          
          {/* 7 INTERACTIVE DASHBOARD STATISTICS CARDS GRID (CLICK TO FILTER) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Filter size={15} /> Click any card below to filter the workstation queue:
              </span>
              {selectedStatusFilter !== 'ALL' && (
                <button
                  onClick={() => setSelectedStatusFilter('ALL')}
                  style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Clear Filter (Showing All {activeQueue.length})
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem' }}>
              
              {/* ALL REQUESTS (SHOW ALL) */}
              <div 
                onClick={() => setSelectedStatusFilter('ALL')}
                style={{ 
                  background: selectedStatusFilter === 'ALL' ? '#f0fdfa' : 'white', 
                  padding: '1.15rem', 
                  borderRadius: '12px', 
                  border: selectedStatusFilter === 'ALL' ? '2px solid #008b95' : '1px solid #e2e8f0', 
                  boxShadow: selectedStatusFilter === 'ALL' ? '0 4px 14px rgba(0, 139, 149, 0.25)' : '0 2px 8px rgba(0,0,0,0.02)', 
                  borderTop: '4px solid #008b95', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease',
                  transform: selectedStatusFilter === 'ALL' ? 'translateY(-2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: selectedStatusFilter === 'ALL' ? '#008b95' : '#64748b', fontWeight: 800, display: 'block', marginBottom: '0.25rem' }}>ALL REQUESTS</span>
                <h3 style={{ fontSize: '1.8rem', color: '#0b2f45', margin: 0, fontWeight: 900 }}>{activeQueue.length}</h3>
              </div>

              <div 
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Submitted' ? 'ALL' : 'Submitted')}
                style={{ 
                  background: selectedStatusFilter === 'Submitted' ? '#f0fdfa' : 'white', 
                  padding: '1.15rem', 
                  borderRadius: '12px', 
                  border: selectedStatusFilter === 'Submitted' ? '2px solid #0891b2' : '1px solid #e2e8f0', 
                  boxShadow: selectedStatusFilter === 'Submitted' ? '0 4px 14px rgba(8, 145, 178, 0.2)' : '0 2px 8px rgba(0,0,0,0.02)', 
                  borderTop: '4px solid #0891b2', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease',
                  transform: selectedStatusFilter === 'Submitted' ? 'translateY(-2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>NEW REQUESTS</span>
                <h3 style={{ fontSize: '1.8rem', color: '#0891b2', margin: 0, fontWeight: 900 }}>{statNewRequests}</h3>
              </div>

              <div 
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Assigned' ? 'ALL' : 'Assigned')}
                style={{ 
                  background: 'white', padding: '1.15rem', borderRadius: '12px', 
                  border: selectedStatusFilter === 'Assigned' ? '2px solid #0284c7' : '1px solid #e2e8f0', 
                  boxShadow: selectedStatusFilter === 'Assigned' ? '0 4px 14px rgba(2, 132, 199, 0.2)' : '0 2px 8px rgba(0,0,0,0.02)', 
                  borderTop: '4px solid #0284c7', cursor: 'pointer', transition: 'all 0.2s ease',
                  transform: selectedStatusFilter === 'Assigned' ? 'translateY(-2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>ASSIGNED</span>
                <h3 style={{ fontSize: '1.8rem', color: '#0369a1', margin: 0, fontWeight: 900 }}>{statAssignedRequests}</h3>
              </div>

              <div 
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Under Verification' ? 'ALL' : 'Under Verification')}
                style={{ 
                  background: 'white', padding: '1.15rem', borderRadius: '12px', 
                  border: selectedStatusFilter === 'Under Verification' ? '2px solid #d97706' : '1px solid #e2e8f0', 
                  boxShadow: selectedStatusFilter === 'Under Verification' ? '0 4px 14px rgba(217, 119, 6, 0.2)' : '0 2px 8px rgba(0,0,0,0.02)', 
                  borderTop: '4px solid #d97706', cursor: 'pointer', transition: 'all 0.2s ease',
                  transform: selectedStatusFilter === 'Under Verification' ? 'translateY(-2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>PENDING VERIFIED</span>
                <h3 style={{ fontSize: '1.8rem', color: '#b45309', margin: 0, fontWeight: 900 }}>{statPendingVerification}</h3>
              </div>

              <div 
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Documents Required' ? 'ALL' : 'Documents Required')}
                style={{ 
                  background: 'white', padding: '1.15rem', borderRadius: '12px', 
                  border: selectedStatusFilter === 'Documents Required' ? '2px solid #dc2626' : '1px solid #e2e8f0', 
                  boxShadow: selectedStatusFilter === 'Documents Required' ? '0 4px 14px rgba(220, 38, 38, 0.2)' : '0 2px 8px rgba(0,0,0,0.02)', 
                  borderTop: '4px solid #dc2626', cursor: 'pointer', transition: 'all 0.2s ease',
                  transform: selectedStatusFilter === 'Documents Required' ? 'translateY(-2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>DOCS REQUIRED</span>
                <h3 style={{ fontSize: '1.8rem', color: '#991b1b', margin: 0, fontWeight: 900 }}>{statDocsRequired}</h3>
              </div>

              <div 
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'In Progress' ? 'ALL' : 'In Progress')}
                style={{ 
                  background: 'white', padding: '1.15rem', borderRadius: '12px', 
                  border: selectedStatusFilter === 'In Progress' ? '2px solid #ea580c' : '1px solid #e2e8f0', 
                  boxShadow: selectedStatusFilter === 'In Progress' ? '0 4px 14px rgba(234, 88, 12, 0.2)' : '0 2px 8px rgba(0,0,0,0.02)', 
                  borderTop: '4px solid #ea580c', cursor: 'pointer', transition: 'all 0.2s ease',
                  transform: selectedStatusFilter === 'In Progress' ? 'translateY(-2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>IN PROGRESS</span>
                <h3 style={{ fontSize: '1.8rem', color: '#c2410c', margin: 0, fontWeight: 900 }}>{statInProgress}</h3>
              </div>

              <div 
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Completed' ? 'ALL' : 'Completed')}
                style={{ 
                  background: 'white', padding: '1.15rem', borderRadius: '12px', 
                  border: selectedStatusFilter === 'Completed' ? '2px solid #16a34a' : '1px solid #e2e8f0', 
                  boxShadow: selectedStatusFilter === 'Completed' ? '0 4px 14px rgba(22, 163, 74, 0.2)' : '0 2px 8px rgba(0,0,0,0.02)', 
                  borderTop: '4px solid #16a34a', cursor: 'pointer', transition: 'all 0.2s ease',
                  transform: selectedStatusFilter === 'Completed' ? 'translateY(-2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>COMPLETED</span>
                <h3 style={{ fontSize: '1.8rem', color: '#15803d', margin: 0, fontWeight: 900 }}>{statCompleted}</h3>
              </div>

              <div 
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Rejected' ? 'ALL' : 'Rejected')}
                style={{ 
                  background: 'white', padding: '1.15rem', borderRadius: '12px', 
                  border: selectedStatusFilter === 'Rejected' ? '2px solid #475569' : '1px solid #e2e8f0', 
                  boxShadow: selectedStatusFilter === 'Rejected' ? '0 4px 14px rgba(71, 85, 105, 0.2)' : '0 2px 8px rgba(0,0,0,0.02)', 
                  borderTop: '4px solid #475569', cursor: 'pointer', transition: 'all 0.2s ease',
                  transform: selectedStatusFilter === 'Rejected' ? 'translateY(-2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>REJECTED</span>
                <h3 style={{ fontSize: '1.8rem', color: '#334155', margin: 0, fontWeight: 900 }}>{statRejected}</h3>
              </div>

            </div>
          </div>

          {/* APPLICATION / COMPLAINT WORKSTATION TABLE */}
          <div style={{ background: 'white', padding: '1.75rem', borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            
            {/* DEPARTMENT VIEW SWITCHER BUTTONS */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <button
                onClick={() => setSelectedDeptFilter('ALL')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: selectedDeptFilter === 'ALL' ? 800 : 600,
                  background: selectedDeptFilter === 'ALL' ? '#0b2f45' : '#f8fafc',
                  color: selectedDeptFilter === 'ALL' ? 'white' : '#475569',
                  border: selectedDeptFilter === 'ALL' ? '1px solid #0b2f45' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                🌐 All Municipal Requests ({allPortalRequests.length})
              </button>

              <button
                onClick={() => setSelectedDeptFilter('MY')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: selectedDeptFilter === 'MY' ? 800 : 600,
                  background: selectedDeptFilter === 'MY' ? '#008b95' : '#f8fafc',
                  color: selectedDeptFilter === 'MY' ? 'white' : '#475569',
                  border: selectedDeptFilter === 'MY' ? '1px solid #008b95' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                ⭐ Public Works & Road Infra ({allPortalRequests.filter(r => (r.department || '').toLowerCase().includes('public works') || (r.department || '').toLowerCase().includes('road')).length})
              </button>

              <button
                onClick={() => setSelectedDeptFilter('WATER')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: selectedDeptFilter === 'WATER' ? 800 : 600,
                  background: selectedDeptFilter === 'WATER' ? '#0284c7' : '#f8fafc',
                  color: selectedDeptFilter === 'WATER' ? 'white' : '#475569',
                  border: selectedDeptFilter === 'WATER' ? '1px solid #0284c7' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                💧 Water & Sewerage Services ({allPortalRequests.filter(r => (r.department || '').toLowerCase().includes('water') || r.serviceId === 'water-sewerage').length})
              </button>

              <button
                onClick={() => setSelectedDeptFilter('VITAL')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: selectedDeptFilter === 'VITAL' ? 800 : 600,
                  background: selectedDeptFilter === 'VITAL' ? '#16a34a' : '#f8fafc',
                  color: selectedDeptFilter === 'VITAL' ? 'white' : '#475569',
                  border: selectedDeptFilter === 'VITAL' ? '1px solid #16a34a' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                📜 Birth & Death Certificates ({allPortalRequests.filter(r => (r.department || '').toLowerCase().includes('vital') || r.serviceId === 'birth-death').length})
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ color: '#0b2f45', margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.3rem' }}>
                  {selectedDeptFilter === 'ALL' ? '🌐 All Municipal Applications & Complaints Queue' : selectedDeptFilter === 'WATER' ? '💧 Water & Sewerage Department Queue' : selectedDeptFilter === 'VITAL' ? '📜 Vital Statistics (Birth & Death) Queue' : '⭐ Public Works & Road Infra Queue'}
                </h3>
                <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  Showing active workflow records for {selectedDeptFilter === 'ALL' ? 'all municipal departments' : selectedDeptFilter === 'WATER' ? 'Water Supply & Sewerage (BWSSB)' : selectedDeptFilter === 'VITAL' ? 'Vital Statistics Division' : `${user?.department || 'Public Works'}`}.
                </span>
              </div>

              <span style={{ fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.75rem', borderRadius: '12px', fontWeight: 800 }}>
                {filteredQueue.length} Items Displayed
              </span>
            </div>

            {/* RESPONSIVE DATA TABLE */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 800 }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Request ID</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Citizen</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Service / Issue</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Ward / Zone</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Department</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Submitted Date</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Assigned Officer</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.map((req) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s ease' }}>
                      
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#008b95' }}>
                        {req.id}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: '#0b2f45', fontWeight: 700 }}>
                        {req.citizenName || req.citizen || 'Citizen'}<br />
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>{req.citizenEmail}</span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: '#334155', fontWeight: 600 }}>
                        {req.issue || req.serviceName || req.service}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                        {req.location || req.wardName || 'Ward 112'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.825rem' }}>
                        {req.department}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                        {req.submissionDate || 'Today'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontSize: '0.775rem',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '12px',
                          fontWeight: 800,
                          background: req.status === 'Approved' || req.status === 'Resolved' || req.status === 'Completed' ? '#dcfce7' : req.status === 'Documents Required' ? '#fee2e2' : '#fef9c3',
                          color: req.status === 'Approved' || req.status === 'Resolved' || req.status === 'Completed' ? '#15803d' : req.status === 'Documents Required' ? '#991b1b' : '#a16207'
                        }}>
                          ● {req.status || 'Submitted'}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: '#0b2f45', fontWeight: 700, fontSize: '0.825rem' }}>
                        {req.assignedOfficerName || user?.fullName || 'Er. Rajesh Kumar'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                          
                          <button
                            onClick={() => openInspectModal(req, 'details')}
                            style={{ background: '#008b95', border: 'none', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            title="View & Inspect Request Details"
                          >
                            <Eye size={14} /> Inspect
                          </button>

                          {/* Show Req Docs ONLY when documents have NOT been requested yet */}
                          {req.status !== 'Documents Required' && req.status !== 'Completed' && req.status !== 'Approved' && req.status !== 'Resolved' && req.status !== 'Rejected' && (
                            <button
                              onClick={() => handleQuickRequestDocs(req)}
                              style={{ background: '#fef3c7', border: '1px solid #fde047', color: '#92400e', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                              title="Request Additional Documents from Citizen"
                            >
                              <FileUp size={14} /> Req Docs
                            </button>
                          )}

                          {/* When status is Documents Required, allow officer to take action or review */}
                          {req.status === 'Documents Required' && (
                            <button
                              onClick={() => openInspectModal(req, 'action')}
                              style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                              title="Take Action / Approve once verified"
                            >
                              <CheckCircle2 size={14} /> Action
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </section>

      {/* COMPREHENSIVE OFFICER ACTION MODAL */}
      {selectedRequest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 47, 69, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '700px', borderRadius: '16px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.65rem', borderRadius: '10px', fontWeight: 800 }}>
                  OFFICER WORKSTATION ACTIONS
                </span>
                <h3 style={{ margin: '0.4rem 0 0 0', color: '#0b2f45', fontSize: '1.35rem', fontWeight: 800 }}>
                  Inspect Request: {selectedRequest.id}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)} 
                style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL TABS NAVIGATION */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.35rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <button onClick={() => setActiveModalTab('details')} style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.825rem', fontWeight: activeModalTab === 'details' ? 800 : 600, border: 'none', background: activeModalTab === 'details' ? '#008b95' : '#f8fafc', color: activeModalTab === 'details' ? 'white' : '#475569', cursor: 'pointer' }}>
                📋 Request Info
              </button>
              <button onClick={() => setActiveModalTab('evidence')} style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.825rem', fontWeight: activeModalTab === 'evidence' ? 800 : 600, border: 'none', background: activeModalTab === 'evidence' ? '#008b95' : '#f8fafc', color: activeModalTab === 'evidence' ? 'white' : '#475569', cursor: 'pointer' }}>
                📷 Photo / Video Evidence {selectedRequest.evidence ? '🟢' : ''}
              </button>
              <button onClick={() => setActiveModalTab('action')} style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.825rem', fontWeight: activeModalTab === 'action' ? 800 : 600, border: 'none', background: activeModalTab === 'action' ? '#008b95' : '#f8fafc', color: activeModalTab === 'action' ? 'white' : '#475569', cursor: 'pointer' }}>
                ⚙️ Status Action & Remarks
              </button>
            </div>

            {/* TAB 1: REQUEST INFO */}
            {activeModalTab === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div><span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block', fontWeight: 800 }}>CITIZEN APPLICANT</span><strong>{selectedRequest.citizenName || selectedRequest.citizen || 'Citizen'}</strong></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block', fontWeight: 800 }}>CITIZEN EMAIL</span><strong>{selectedRequest.citizenEmail}</strong></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block', fontWeight: 800 }}>SERVICE / ISSUE</span><strong>{selectedRequest.issue || selectedRequest.serviceName || selectedRequest.service}</strong></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block', fontWeight: 800 }}>DEPARTMENT</span><strong>{selectedRequest.department}</strong></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block', fontWeight: 800 }}>WARD / JURISDICTION</span><strong>{selectedRequest.location || selectedRequest.wardName || 'Ward 112'}</strong></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block', fontWeight: 800 }}>ASSIGNED OFFICER</span><strong>{selectedRequest.assignedOfficerName || user?.fullName || 'Er. Rajesh Kumar'}</strong></div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#0b2f45', fontWeight: 800 }}>📜 Status Change Audit Trail History:</h5>
                  {selectedRequest.statusHistory && selectedRequest.statusHistory.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedRequest.statusHistory.map((h, i) => (
                        <div key={i} style={{ background: 'white', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.825rem' }}>
                          <span style={{ fontWeight: 800, color: '#008b95' }}>{h.previousStatus ? `${h.previousStatus} ➔ ${h.newStatus}` : h.newStatus}</span> • <span style={{ color: '#64748b' }}>{new Date(h.updatedAt).toLocaleString()}</span>
                          <p style={{ margin: '0.2rem 0 0 0', color: '#334155' }}>Officer: {h.updatedBy} | Remarks: "{h.remarks}"</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Initial submission logged on {selectedRequest.submissionDate || 'Today'}.</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: EVIDENCE & DOCUMENTS INSPECTION */}
            {activeModalTab === 'evidence' && (
              <div style={{ fontSize: '0.9rem' }}>
                {/* Official Documents Checklist Reference */}
                <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <h5 style={{ margin: '0 0 0.4rem 0', color: '#0f766e', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={16} /> Verification Documents Standard for this Service:
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.825rem', color: '#134e4a', lineHeight: '1.6' }}>
                    <li><strong>Property Ownership Proof:</strong> Property Tax e-Khata Extract / SAS Payment Receipt / Sale Deed</li>
                    <li><strong>Identity Proof:</strong> Aadhaar Card / Voter ID of Registered Applicant</li>
                    <li><strong>Site Inspection Photo:</strong> Property frontage / proposed water meter point location</li>
                  </ul>
                </div>

                {selectedRequest.evidence ? (
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <h5 style={{ margin: '0 0 0.75rem 0', color: '#0b2f45', fontWeight: 800 }}>
                      📷 Attached Supporting Document / Photo ({selectedRequest.evidence.type?.toUpperCase() || 'FILE'})
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      File Name: <strong>{selectedRequest.evidence.name}</strong> • Size: {selectedRequest.evidence.size}
                    </p>
                    
                    <div style={{ background: '#000', borderRadius: '10px', overflow: 'hidden', maxHeight: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {selectedRequest.evidence.type === 'video' ? (
                        <video src={selectedRequest.evidence.dataUrl} controls style={{ maxHeight: '320px', width: '100%' }} />
                      ) : (
                        <img src={selectedRequest.evidence.dataUrl} alt="Evidence Preview" style={{ maxHeight: '320px', maxWidth: '100%', objectFit: 'contain' }} />
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#f8fafc', padding: '2rem 1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                    <Info size={30} style={{ color: '#64748b', marginBottom: '0.5rem' }} />
                    <h4 style={{ margin: 0, color: '#334155', fontWeight: 700 }}>No Documents or Photos Attached by Applicant Yet</h4>
                    <span style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.35rem', display: 'block' }}>
                      You can request specific documents (e-Khata, Title Deed, Aadhaar, Site Photo) using the <strong>"Status Action & Remarks"</strong> tab.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ACTION & STATUS TRANSITION */}
            {activeModalTab === 'action' && (
              <form onSubmit={handleStatusUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                    Select Action Status Transition *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewStatus(val);
                      if (val === 'Documents Required' && !officerRemarks) {
                        setOfficerRemarks('Official Notice: Please upload your Property Tax e-Khata Certificate and Aadhaar ID for verification.');
                      }
                    }}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                  >
                    <optgroup label="⚙️ Complaint Workflow Stages">
                      <option value="Assigned">Assigned (Received at Officer Desk)</option>
                      <option value="In Progress">In Progress (Field Inspection Dispatched)</option>
                      <option value="Resolved">Resolved (Work Order / Rectification Complete)</option>
                      <option value="Closed">Closed (Case Formally Closed)</option>
                    </optgroup>
                    <optgroup label="📋 Application Workflow Stages">
                      <option value="Under Verification">Under Verification</option>
                      <option value="Documents Required">Documents Required (Citizen Action Needed)</option>
                      <option value="Under Processing">Under Processing</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed (Certificate / Connection Issued)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Quick Document Selection Chips for Officers */}
                {newStatus === 'Documents Required' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f766e', marginBottom: '0.35rem' }}>
                      📋 Quick Select Required Documents:
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {[
                        'Property Tax e-Khata Certificate',
                        'Title / Sale Deed',
                        'Aadhaar / Citizen ID Proof',
                        'Water Meter Point Site Photo',
                        'Electricity Bill (BESCOM Proof)'
                      ].map((docName, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const newText = officerRemarks ? `${officerRemarks}, ${docName}` : `Official Notice: Please provide ${docName}`;
                            setOfficerRemarks(newText);
                          }}
                          style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', padding: '0.25rem 0.6rem', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          + {docName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                    Add Official Officer Remarks / Notice *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter official action notes or specify required documents..."
                    value={officerRemarks}
                    onChange={(e) => setOfficerRemarks(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669', fontWeight: 800, padding: '0.85rem' }}>
                  Save Action Record & Record Audit Log
                </button>
              </form>
            )}

            <button onClick={() => setSelectedRequest(null)} className="btn btn-outline-light" style={{ width: '100%', marginTop: '1.25rem' }}>
              Close Workstation Modal
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

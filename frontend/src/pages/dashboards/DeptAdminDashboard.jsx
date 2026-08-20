import React, { useState } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Building, Users, FileText, PlusCircle, CheckCircle, ShieldCheck, LogOut, Send, AlertTriangle, Eye, UserCheck, RefreshCw, BarChart2, FileSpreadsheet, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMunicipalData } from '../../context/DataContext';

export const DeptAdminDashboard = ({ onNavigate }) => {
  const { user, createOfficerOrAdminAccount, logout } = useAuth();
  const { showToast, getDepartmentAdminQueue, reassignRequestToOfficer, updateRequestStatus, data } = useMunicipalData();

  // BACKEND AUTHORIZATION SECURITY FILTER:
  // Returns ONLY requests belonging to this Department Admin's authorized department.
  const deptQueue = getDepartmentAdminQueue(user);

  // Active Department Name & Code
  const deptName = user?.department || 'Public Works / Electrical Department';

  // Available Officers in Database for Assignment/Reassignment
  const allOfficers = data.officers || [];
  const deptOfficers = allOfficers.filter(o => 
    o.department === deptName || o.departmentId === user?.departmentId
  ).length > 0 ? allOfficers.filter(o => 
    o.department === deptName || o.departmentId === user?.departmentId
  ) : allOfficers;

  // Fallback demo queue if database is empty
  const defaultDeptQueue = [
    {
      id: 'MUN-2026-992014',
      citizenName: 'Smt. Kavitha R.',
      citizenEmail: 'citizen@bbmp.gov.in',
      serviceName: 'Road & Streetlight Complaints',
      department: deptName,
      wardName: 'Ward 112 (Malleshwaram)',
      submissionDate: 'Aug 14, 2026',
      status: 'Submitted',
      assignedOfficerId: 'user-officer-1',
      assignedOfficerName: 'Er. Rajesh Kumar',
      notes: 'Dispatched road asphalt repair vehicle.'
    },
    {
      id: 'MUN-2026-881204',
      citizenName: 'Sri Anand Kumar',
      citizenEmail: 'anand@bbmp.gov.in',
      serviceName: 'Road & Streetlight Complaints',
      department: deptName,
      wardName: 'Ward 112 (Malleshwaram)',
      submissionDate: 'Aug 12, 2026',
      status: 'In Progress',
      assignedOfficerId: 'user-officer-1',
      assignedOfficerName: 'Er. Rajesh Kumar',
      notes: 'LED street light fixture replaced.'
    },
    {
      id: 'MUN-2026-771920',
      citizenName: 'Smt. Lakshmi R.',
      citizenEmail: 'lakshmi@bbmp.gov.in',
      serviceName: 'Road & Streetlight Complaints',
      department: deptName,
      wardName: 'Ward 114 (Rajajinagar)',
      submissionDate: 'Aug 10, 2026',
      status: 'Resolved',
      assignedOfficerId: 'user-officer-1',
      assignedOfficerName: 'Er. Rajesh Kumar',
      notes: 'Pothole cold-mix patching completed.'
    }
  ];

  const activeQueue = deptQueue.length > 0 ? deptQueue : defaultDeptQueue;

  // Active View Tabs
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'officers', 'reports'
  const [statusFilter, setStatusFilter] = useState('All');

  // Reassignment Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [targetOfficerId, setTargetOfficerId] = useState('');
  const [reassignRemarks, setReassignRemarks] = useState('');

  // Department Statistics
  const statTotal = activeQueue.length;
  const statSubmitted = activeQueue.filter(r => r.status === 'Submitted').length;
  const statInProgress = activeQueue.filter(r => r.status === 'In Progress' || r.status === 'Under Verification' || r.status === 'Under Processing').length;
  const statResolved = activeQueue.filter(r => r.status === 'Resolved' || r.status === 'Approved' || r.status === 'Completed').length;
  const statDocsReq = activeQueue.filter(r => r.status === 'Documents Required').length;

  const handleReassignSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest || !targetOfficerId) {
      showToast("Please select a target officer.", "warning");
      return;
    }

    const success = reassignRequestToOfficer(selectedRequest.id, targetOfficerId, reassignRemarks, user);
    if (success) {
      setSelectedRequest(null);
      setTargetOfficerId('');
      setReassignRemarks('');
    }
  };

  const filteredQueue = statusFilter === 'All' 
    ? activeQueue 
    : activeQueue.filter(r => r.status === statusFilter);

  return (
    <div id="main-content">
      {/* Department Admin Banner */}
      <div style={{ background: '#f8fafc', padding: '2.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Department Admin Control Center' }]} onNavigate={onNavigate} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', background: '#008b95', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: 800 }}>
                🏛️ AUTHORIZED DEPARTMENT ADMIN
              </span>
              <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0 0.25rem 0', fontWeight: 800 }}>
                {deptName} Admin Portal
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                Administrator: <strong>{user?.fullName || 'Sri Munish Moudgil'}</strong> • Authorized Jurisdiction: <strong>All Municipal Zones</strong>
              </p>
            </div>

            <button 
              onClick={logout}
              className="btn btn-outline-light"
              style={{ borderColor: '#cbd5e1', color: '#64748b' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

        </div>
      </div>

      <section style={{ padding: '2.5rem 0', background: '#f1f5f9' }}>
        <div className="container">
          
          {/* DEPARTMENT STATISTICS METRICS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.25rem' }}>
            
            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderTop: '4px solid #008b95' }}>
              <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>TOTAL DEPT REQUESTS</span>
              <h3 style={{ fontSize: '2rem', color: '#0b2f45', margin: 0, fontWeight: 900 }}>{statTotal}</h3>
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderTop: '4px solid #d97706' }}>
              <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>NEW / SUBMITTED</span>
              <h3 style={{ fontSize: '2rem', color: '#b45309', margin: 0, fontWeight: 900 }}>{statSubmitted}</h3>
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderTop: '4px solid #ea580c' }}>
              <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>IN PROGRESS</span>
              <h3 style={{ fontSize: '2rem', color: '#c2410c', margin: 0, fontWeight: 900 }}>{statInProgress}</h3>
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderTop: '4px solid #991b1b' }}>
              <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>DOCS REQUIRED</span>
              <h3 style={{ fontSize: '2rem', color: '#991b1b', margin: 0, fontWeight: 900 }}>{statDocsReq}</h3>
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderTop: '4px solid #16a34a' }}>
              <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>RESOLVED / COMPLETED</span>
              <h3 style={{ fontSize: '2rem', color: '#15803d', margin: 0, fontWeight: 900 }}>{statResolved}</h3>
            </div>

          </div>

          {/* MAIN TABS NAVIGATION */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('requests')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'requests' ? 800 : 600,
                border: activeTab === 'requests' ? '2px solid #008b95' : '1px solid #cbd5e1',
                background: activeTab === 'requests' ? '#008b95' : 'white',
                color: activeTab === 'requests' ? 'white' : '#475569',
                cursor: 'pointer'
              }}
            >
              📋 Manage Department Requests & Assign Officers
            </button>

            <button
              onClick={() => setActiveTab('officers')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'officers' ? 800 : 600,
                border: activeTab === 'officers' ? '2px solid #008b95' : '1px solid #cbd5e1',
                background: activeTab === 'officers' ? '#008b95' : 'white',
                color: activeTab === 'officers' ? 'white' : '#475569',
                cursor: 'pointer'
              }}
            >
              👮 Department Officers Directory ({deptOfficers.length})
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'reports' ? 800 : 600,
                border: activeTab === 'reports' ? '2px solid #008b95' : '1px solid #cbd5e1',
                background: activeTab === 'reports' ? '#008b95' : 'white',
                color: activeTab === 'reports' ? 'white' : '#475569',
                cursor: 'pointer'
              }}
            >
              📊 Performance Reports & SLA Audit
            </button>
          </div>

          {/* TAB 1: MANAGE DEPARTMENT REQUESTS & REASSIGNMENT */}
          {activeTab === 'requests' && (
            <div style={{ background: 'white', padding: '1.75rem', borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                <div>
                  <h3 style={{ color: '#0b2f45', margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.25rem' }}>
                    {deptName} Requests & Officer Assignments
                  </h3>
                  <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
                    Backend Security Filtered: Displaying requests belonging strictly to <strong>{deptName}</strong>.
                  </span>
                </div>

                {/* Filter Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569' }}>Filter Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    <option value="All">All Department Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Documents Required">Documents Required</option>
                    <option value="Approved">Approved</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* REQUESTS TABLE */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 800 }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Request ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Citizen</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Service</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Ward / Jurisdiction</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Submitted Date</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Assigned Officer</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Admin Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueue.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#008b95' }}>
                          {req.id}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#0b2f45', fontWeight: 700 }}>
                          {req.citizenName || req.citizen}<br />
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>{req.citizenEmail}</span>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#334155', fontWeight: 600 }}>
                          {req.serviceName || req.service}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                          {req.wardName || req.location || 'Ward 112'}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                          {req.submissionDate}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '12px',
                            fontWeight: 800,
                            background: req.status === 'Approved' || req.status === 'Resolved' || req.status === 'Completed' ? '#dcfce7' : req.status === 'Documents Required' ? '#fee2e2' : '#fef9c3',
                            color: req.status === 'Approved' || req.status === 'Resolved' || req.status === 'Completed' ? '#15803d' : req.status === 'Documents Required' ? '#991b1b' : '#a16207'
                          }}>
                            ● {req.status}
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: '#0b2f45', fontWeight: 700, fontSize: '0.825rem' }}>
                          {req.assignedOfficerName || 'Er. Rajesh Kumar'}
                        </td>

                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => { setSelectedRequest(req); setTargetOfficerId(req.assignedOfficerId || 'user-officer-1'); }}
                            style={{ background: '#0284c7', border: 'none', color: 'white', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <RefreshCw size={13} /> Reassign Officer
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 2: DEPARTMENT OFFICERS DIRECTORY */}
          {activeTab === 'officers' && (
            <div style={{ background: 'white', padding: '1.75rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ color: '#0b2f45', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                {deptName} Authorized Officer Directory
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Active municipal officers authorized to process requests for {deptName}.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {deptOfficers.map((off) => (
                  <div key={off.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1.25rem', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#0b2f45', fontSize: '1.05rem' }}>{off.fullName}</strong>
                      <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 800 }}>Active</span>
                    </div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#475569' }}>Email: <strong>{off.email}</strong></p>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#475569' }}>Ward Jurisdiction: <strong>{off.wardName || off.ward || 'Ward 112'}</strong></p>
                    <p style={{ margin: 0, fontSize: '0.825rem', color: '#008b95', fontWeight: 700 }}>Authorized Services: {off.authorizedServiceKeys ? off.authorizedServiceKeys.join(', ') : 'All Dept Services'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DEPARTMENT PERFORMANCE REPORTS */}
          {activeTab === 'reports' && (
            <div style={{ background: 'white', padding: '1.75rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ color: '#0b2f45', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                📊 {deptName} Performance & SLA Compliance Audit Report
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Official department performance metrics, SLA turnaround timelines, and officer work distribution.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '1.25rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 700 }}>SLA Compliance Rate</span>
                  <h4 style={{ fontSize: '1.8rem', color: '#0f766e', margin: '0.25rem 0 0 0', fontWeight: 900 }}>96.4%</h4>
                </div>
                <div style={{ background: '#e0f2fe', border: '1px solid #bae6fd', padding: '1.25rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 700 }}>Avg Turnaround Time</span>
                  <h4 style={{ fontSize: '1.8rem', color: '#0369a1', margin: '0.25rem 0 0 0', fontWeight: 900 }}>24.8 Hours</h4>
                </div>
                <div style={{ background: '#f0fff4', border: '1px solid #86efac', padding: '1.25rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>Citizen Satisfaction Rating</span>
                  <h4 style={{ fontSize: '1.8rem', color: '#166534', margin: '0.25rem 0 0 0', fontWeight: 900 }}>4.8 / 5.0</h4>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* REASSIGNMENT MODAL WINDOW */}
      {selectedRequest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 47, 69, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '550px', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            
            <h3 style={{ color: '#0b2f45', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
              Reassign Request: {selectedRequest.id}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Service: <strong>{selectedRequest.serviceName || selectedRequest.service}</strong> • Current Officer: <strong>{selectedRequest.assignedOfficerName || 'Er. Rajesh Kumar'}</strong>
            </p>

            <form onSubmit={handleReassignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Select Authorized Target Officer *
                </label>
                <select
                  value={targetOfficerId}
                  onChange={(e) => setTargetOfficerId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                >
                  {deptOfficers.map(off => (
                    <option key={off.id} value={off.id}>
                      {off.fullName} ({off.email}) - {off.wardName || off.ward || 'Ward 112'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0b2f45', marginBottom: '0.4rem' }}>
                  Reassignment Reason / Admin Remarks
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter reason for reassigning ticket to this officer..."
                  value={reassignRemarks}
                  onChange={(e) => setReassignRemarks(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedRequest(null)} className="btn btn-outline-light" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#0284c7', borderColor: '#0284c7', fontWeight: 800 }}>Confirm Reassignment</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

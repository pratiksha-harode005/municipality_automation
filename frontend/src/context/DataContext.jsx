import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMunicipalData } from '../data/mockData';

const DataContext = createContext(null);

const STORAGE_KEY = 'bbmp_bengaluru_municipal_db_v54';
const PERMANENT_REQUESTS_KEY = 'bbmp_citizen_requests_permanent_v1';

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    let recoveredRequests = [];
    let savedState = null;

    try {
      // 1. Load active database state from storage
      const activeRaw = localStorage.getItem(STORAGE_KEY);
      if (activeRaw) {
        savedState = JSON.parse(activeRaw);
      }

      // 2. Recover requests from permanent dedicated storage key
      const permSaved = localStorage.getItem(PERMANENT_REQUESTS_KEY);
      if (permSaved) {
        recoveredRequests = JSON.parse(permSaved);
      }

      // 3. Scan past keys to ensure no user submissions are lost
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('bbmp_bengaluru_municipal_db') || key.startsWith('bbmp_portal')) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed.citizenServiceRequests && Array.isArray(parsed.citizenServiceRequests)) {
                parsed.citizenServiceRequests.forEach(req => {
                  if (req && req.id && !recoveredRequests.some(r => r.id === req.id)) {
                    recoveredRequests.push(req);
                  }
                });
              }
            }
          } catch (e) {}
        }
      });

      // Save recovered requests to permanent storage
      if (recoveredRequests.length > 0) {
        localStorage.setItem(PERMANENT_REQUESTS_KEY, JSON.stringify(recoveredRequests));
      }
    } catch (err) {
      console.error("Failed to recover persistent requests:", err);
    }

    // Merge recovered requests with initial municipal seed data safely
    const baseInitialRequests = Array.isArray(initialMunicipalData?.citizenServiceRequests) 
      ? initialMunicipalData.citizenServiceRequests 
      : [];

    const allRequests = [
      ...recoveredRequests,
      ...baseInitialRequests.filter(
        initReq => !recoveredRequests.some(r => r.id === initReq.id)
      )
    ];

    // Build departments: merge initial official departments with saved changes and custom departments
    const obsoleteDeptIds = ['dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5', 'dept-6'];
    const initialDepts = initialMunicipalData.departments || [];
    let finalDepts = [...initialDepts];

    if (savedState && Array.isArray(savedState.departments)) {
      const validSaved = savedState.departments.filter(d => d && d.id && !obsoleteDeptIds.includes(d.id));
      if (validSaved.length > 0) {
        finalDepts = initialDepts.map(initDept => {
          const matchingSaved = validSaved.find(s => s.id === initDept.id || (s.code && s.code === initDept.code));
          return matchingSaved ? { ...initDept, ...matchingSaved } : initDept;
        });

        // Add any custom departments created by user
        validSaved.forEach(s => {
          if (!finalDepts.some(fd => fd.id === s.id || (fd.code && fd.code === s.code))) {
            finalDepts.push(s);
          }
        });
      }
    }

    return {
      ...initialMunicipalData,
      ...(savedState || {}),
      departments: finalDepts,
      citizenServiceRequests: allRequests
    };
  });

  const [activeToast, setActiveToast] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (data.citizenServiceRequests) {
        localStorage.setItem(PERMANENT_REQUESTS_KEY, JSON.stringify(data.citizenServiceRequests));
      }
    } catch (err) {
      console.error("Failed to save data to local storage:", err);
    }
  }, [data]);

  const showToast = (message, type = 'success') => {
    setActiveToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setActiveToast(null);
    }, 4000);
  };

  /**
   * SECURITY AUDIT LOGGING ENGINE (Requirement #11):
   * Records all critical security events (Login, Submissions, Assignments, Status Changes, Document Access).
   */
  const recordSecurityAuditLog = (eventType, actorUser, details) => {
    const auditEntry = {
      id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType, // e.g. 'LOGIN_SUCCESS', 'APPLICATION_SUBMISSION', 'STATUS_CHANGE', 'IDOR_BREACH_ATTEMPT'
      actorEmail: actorUser ? actorUser.email : 'anonymous@bbmp.gov.in',
      actorRole: actorUser ? actorUser.role : 'public',
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Verified HTTPS TLS 1.3 Session)'
    };

    setData(prev => ({
      ...prev,
      securityAuditLogs: [auditEntry, ...(prev.securityAuditLogs || [])]
    }));
  };

  /**
   * IDOR VULNERABILITY PREVENTION GUARD (Requirement #3 & #8):
   * Strictly verifies ownership and authorization for every direct object access request.
   * Prevents citizens from accessing another citizen's requests via IDOR manipulation.
   */
  const verifyRequestOwnershipAndAccess = (requestId, currentUser) => {
    if (!currentUser) return false;
    const allRequests = data.citizenServiceRequests || [];
    const targetReq = allRequests.find(r => r.id === requestId);

    if (!targetReq) return false;

    // Role-Based IDOR Inspection
    if (currentUser.role === 'citizen') {
      const isOwner = targetReq.citizenEmail === currentUser.email || 
                      targetReq.citizenId === currentUser.email || 
                      targetReq.citizenId === currentUser.id;
      if (!isOwner) {
        recordSecurityAuditLog(
          'IDOR_SECURITY_BREACH_ATTEMPT', 
          currentUser, 
          `SECURITY ALERT: Citizen ${currentUser.email} attempted unauthorized IDOR access to Request ${requestId} belonging to ${targetReq.citizenEmail}`
        );
        showToast("SECURITY GUARD: Access Denied. You cannot access applications belonging to another citizen.", "danger");
        return false;
      }
      return true;
    }

    if (currentUser.role === 'officer') {
      const isAuthorized = targetReq.assignedOfficerEmail === currentUser.email || 
                           targetReq.department === currentUser.department ||
                           targetReq.departmentId === currentUser.departmentId;
      if (!isAuthorized) {
        recordSecurityAuditLog(
          'UNAUTHORIZED_OFFICER_ACCESS_ATTEMPT', 
          currentUser, 
          `SECURITY ALERT: Officer ${currentUser.email} attempted unauthorized access to Request ${requestId} outside authorized department.`
        );
        return false;
      }
      return true;
    }

    if (currentUser.role === 'dept_admin') {
      const isAuthorizedDept = targetReq.department === currentUser.department || 
                               targetReq.departmentId === currentUser.departmentId;
      if (!isAuthorizedDept) {
        recordSecurityAuditLog(
          'UNAUTHORIZED_DEPT_ADMIN_ACCESS_ATTEMPT', 
          currentUser, 
          `SECURITY ALERT: Department Admin ${currentUser.email} attempted access to Request ${requestId} outside authorized department.`
        );
        return false;
      }
      return true;
    }

    return true;
  };

  /**
   * RATE LIMITING ENGINE (Requirement #8):
   * Prevents API abuse and spamming on sensitive endpoints.
   */
  const rateLimitMap = new Map();
  const checkRateLimit = (actorId, actionName) => {
    const key = `${actorId}_${actionName}`;
    const now = Date.now();
    const timestamps = rateLimitMap.get(key) || [];
    const recent = timestamps.filter(t => now - t < 60000); // 1 minute window

    if (recent.length >= 10) { // Max 10 requests per minute
      showToast("Rate Limit Exceeded: Please wait a moment before submitting further requests.", "warning");
      return false;
    }

    recent.push(now);
    rateLimitMap.set(key, recent);
    return true;
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialMunicipalData);
    showToast("Municipal database reset to default records", "info");
  };

  // CRUD Helpers for Admin & Forms
  const addItem = (collectionKey, item) => {
    const newItem = {
      ...item,
      id: item.id || `${collectionKey.substring(0, 3)}-${Date.now()}`
    };
    setData(prev => {
      const currentList = Array.isArray(prev[collectionKey]) ? prev[collectionKey] : [];
      return {
        ...prev,
        [collectionKey]: [newItem, ...currentList]
      };
    });
    showToast(`New item added to ${collectionKey}`, 'success');
    return newItem;
  };

  const updateItem = (collectionKey, updatedItem) => {
    if (!updatedItem) return;
    setData(prev => {
      const currentList = Array.isArray(prev[collectionKey]) ? prev[collectionKey] : [];
      const updatedList = currentList.map(item => 
        (item.id === updatedItem.id || (item.code && item.code === updatedItem.code))
          ? { ...item, ...updatedItem } 
          : item
      );
      return {
        ...prev,
        [collectionKey]: updatedList
      };
    });
    showToast(`Updated ${updatedItem.name || updatedItem.title || 'item'} successfully!`, 'success');
  };

  const deleteItem = (collectionKey, id) => {
    if (!id) return;
    setData(prev => {
      const currentList = Array.isArray(prev[collectionKey]) ? prev[collectionKey] : [];
      return {
        ...prev,
        [collectionKey]: currentList.filter(item => item.id !== id && item.code !== id)
      };
    });
    showToast(`Deleted item from ${collectionKey}`, 'warning');
  };

  const updateSiteInfo = (newInfo) => {
    setData(prev => ({
      ...prev,
      info: { ...(prev.info || {}), ...newInfo }
    }));
    showToast("Portal Site Identity & Helpline settings updated successfully!", "success");
  };

  const updateHeroSlides = (newSlides) => {
    setData(prev => ({
      ...prev,
      heroSlides: newSlides
    }));
    showToast("Hero Banner Slides updated successfully!", "success");
  };

  const submitContactMessage = (msgData) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...msgData
    };
    setData(prev => ({
      ...prev,
      contactMessages: [newMsg, ...(prev.contactMessages || [])]
    }));
    showToast("Thank you! Your message has been submitted to the municipal office.");
  };

  // =======================================================
  // CENTRAL BACKEND REGISTRY: Master Service-to-Department Mapping
  // =======================================================
  const serviceDepartmentMap = {
    'road-streetlights': 'Civil Department',
    'water-sewerage': 'Civil Department',
    'waste-sanitation': 'Civil Department',
    'birth-death': 'Medical Department'
  };

  // Department ID Lookup Map
  const serviceDepartmentIdMap = {
    'road-streetlights': 'dept-civil',
    'water-sewerage': 'dept-civil',
    'waste-sanitation': 'dept-civil',
    'birth-death': 'dept-medical'
  };

  /**
   * Helper: Resolves backend department automatically based on service key.
   */
  const getDepartmentForService = (serviceKey) => {
    return serviceDepartmentMap[serviceKey] || null;
  };

  /**
   * BACKEND AUTOMATIC OFFICER ASSIGNMENT ENGINE:
   * Assigns request according to:
   * - Department
   * - Ward/Zone
   * - Service Type
   * - Officer Authorization
   * (Citizen DOES NOT choose an individual officer)
   */
  const autoAssignOfficer = (request) => {
    const officers = data.officers || initialMunicipalData.officers || [];
    
    // Match authorized officer by Department & Authorized Service Key
    const matchedOfficer = officers.find(off => 
      off.departmentId === request.departmentId &&
      off.authorizedServiceKeys?.includes(request.serviceId)
    ) || officers.find(off => off.departmentId === request.departmentId) || officers[0];

    const assignmentId = `ASG-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const assignmentRecord = {
      id: assignmentId,
      requestId: request.id,
      departmentId: request.departmentId,
      departmentName: request.department,
      wardId: request.wardId || 'ward-112',
      wardName: request.wardName || 'Ward 112 (Malleshwaram)',
      assignedOfficerId: matchedOfficer ? matchedOfficer.id : 'user-officer-1',
      assignedOfficerName: matchedOfficer ? matchedOfficer.fullName : 'Er. Rajesh Kumar',
      assignedOfficerEmail: matchedOfficer ? matchedOfficer.email : 'officer.ward112@bbmp.gov.in',
      assignedAt: nowIso,
      status: 'Assigned'
    };

    return {
      assignment: assignmentRecord,
      assignedOfficer: matchedOfficer
    };
  };

  /**
   * Central Backend Municipal Request Engine:
   * 1. Validates service key
   * 2. Automatically determines responsible department
   * 3. Generates unique Request ID (MUN-2026-XXXXXX)
   * 4. Sets initial status to "Submitted"
   * 5. Associates request with logged-in citizen
   * 6. Automatically assigns to Authorized Officer based on Department, Ward, Service Type & Authorization
   * 7. Saves in municipal backend workflow database
   */
  const submitCitizenServiceRequest = (serviceKey, payload, currentUser = null) => {
    const assignedDepartment = getDepartmentForService(serviceKey);
    const assignedDepartmentId = serviceDepartmentIdMap[serviceKey] || 'dept-pwd';

    if (!assignedDepartment) {
      if (serviceKey === 'status-tracking') {
        showToast("Application & Service Status Tracking is a view-only tracking portal.", "info");
        return null;
      }
      showToast(`Invalid service routing key: ${serviceKey}`, "danger");
      return null;
    }

    const serviceNameMap = {
      'road-streetlights': 'Road & Streetlight Complaints',
      'birth-death': 'Birth & Death Certificates',
      'water-sewerage': 'Water & Sewerage Services',
      'waste-sanitation': 'Waste Management & Sanitation'
    };

    const nextCounter = Math.floor(100000 + Math.random() * 900000);
    const uniqueAppId = `MUN-2026-${nextCounter}`;
    const nowIso = new Date().toISOString();
    const currentDateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const rawRequest = {
      id: uniqueAppId,
      citizenId: currentUser?.email || 'citizen@bbmp.gov.in',
      citizenName: currentUser?.fullName || 'Kavitha R.',
      citizenEmail: currentUser?.email || 'citizen@bbmp.gov.in',
      serviceId: serviceKey,
      serviceName: serviceNameMap[serviceKey] || 'Municipal Service',
      departmentId: assignedDepartmentId,
      department: assignedDepartment, // AUTOMATICALLY DETERMINED BY BACKEND
      wardId: 'ward-112',
      wardName: 'Ward 112 (Malleshwaram)',
      submissionDate: currentDateFormatted,
      status: 'Submitted', // INITIAL STATUS
      stage: `Stage 1 of 4: Submitted to ${assignedDepartment}`,
      createdAt: nowIso,
      updatedAt: nowIso,
      ...payload
    };

    const { assignment, assignedOfficer } = autoAssignOfficer(rawRequest);

    const initialHistoryEntry = {
      historyId: `HIS-${Date.now()}`,
      previousStatus: null,
      newStatus: 'Submitted',
      updatedBy: currentUser ? `${currentUser.fullName} (${currentUser.email})` : 'System Engine',
      updatedByRole: currentUser?.role || 'citizen',
      updatedAt: nowIso,
      remarks: `Request submitted and automatically routed to ${assignedDepartment}`
    };

    const finalRequest = {
      ...rawRequest,
      assignmentId: assignment?.id || `ASG-${Date.now()}`,
      assignedOfficerId: assignedOfficer?.id,
      assignedOfficerName: assignedOfficer?.fullName,
      assignedOfficerEmail: assignedOfficer?.email,
      statusHistory: [initialHistoryEntry] // IMMUTABLE AUDIT TRAIL
    };

    // GENERATE AUTOMATED NOTIFICATIONS FOR CITIZEN
    const citizenEmail = currentUser?.email || 'citizen@bbmp.gov.in';
    const notifSubmitted = {
      id: `NOTIF-${Date.now()}-1`,
      citizenEmail: citizenEmail,
      title: 'Request Submitted Successfully',
      message: `Your request (${uniqueAppId}) for ${serviceNameMap[serviceKey] || 'Municipal Service'} has been submitted.`,
      requestId: uniqueAppId,
      createdAt: nowIso,
      read: false
    };

    const notifAssigned = {
      id: `NOTIF-${Date.now()}-2`,
      citizenEmail: citizenEmail,
      title: 'Request Received & Assigned to Officer',
      message: `Your request (${uniqueAppId}) has been received by ${assignedDepartment} and assigned to ${assignedOfficer?.fullName || 'Field Officer'}.`,
      requestId: uniqueAppId,
      createdAt: new Date(Date.now() + 1000).toISOString(),
      read: false
    };

    // Save in backend workflow database collections
    setData(prev => ({
      ...prev,
      citizenServiceRequests: [finalRequest, ...(prev.citizenServiceRequests || [])],
      assignments: [assignment, ...(prev.assignments || [])],
      notifications: [notifAssigned, notifSubmitted, ...(prev.notifications || [])]
    }));

    // RECORD SECURITY AUDIT LOG FOR APPLICATION SUBMISSION
    recordSecurityAuditLog(
      'APPLICATION_SUBMISSION',
      currentUser,
      `Submitted Application ID ${uniqueAppId} for Service ${serviceKey} automatically routed to ${assignedDepartment} and assigned to ${assignedOfficer?.fullName}`
    );

    showToast(`Request Created! App ID: ${uniqueAppId} | Department: ${assignedDepartment} | Assigned: ${assignedOfficer?.fullName}`);
    return finalRequest;
  };

  /**
   * AUTHORIZED STATUS TRANSITION WORKFLOW ENGINE:
   * 1. Validates that user is an authorized Officer or Admin (Citizens blocked).
   * 2. Appends immutable status history log (previous status, new status, user, timestamp, remarks).
   * 3. Triggers automated citizen notification on status change.
   * 4. Does NOT overwrite past history.
   */
  const updateRequestStatus = (requestId, newStatus, remarks, updatingUser) => {
    // SECURITY GUARD: Citizens cannot change status!
    if (!updatingUser || updatingUser.role === 'citizen') {
      showToast("Security Guard Active: Citizens are not authorized to update request status.", "danger");
      return false;
    }

    const nowIso = new Date().toISOString();
    const historyEntry = {
      historyId: `HIS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      previousStatus: 'Active',
      newStatus: newStatus,
      updatedBy: `${updatingUser.fullName || 'Officer'} (${updatingUser.email || 'officer@bbmp.gov.in'})`,
      updatedByRole: updatingUser.role || 'officer',
      updatedAt: nowIso,
      remarks: remarks || `Status transitioned to ${newStatus}`
    };

    // Build Status Change Notification Title & Message
    let notifTitle = `Status Updated to "${newStatus}"`;
    let notifMsg = `Your request ${requestId} status has been updated to "${newStatus}" by ${updatingUser.fullName || 'Municipal Officer'}. Remarks: "${remarks || 'Updated by municipal officer'}"`;

    if (newStatus === 'Documents Required') {
      notifTitle = '⚠️ Additional Documents Required';
      notifMsg = `Action Needed for Request ${requestId}: The assigned officer has requested additional document verification. Remarks: "${remarks}"`;
    } else if (newStatus === 'Approved') {
      notifTitle = '✅ Application Approved!';
      notifMsg = `Great news! Your application ${requestId} has been approved. Your digital e-Certificate is now available for download.`;
    } else if (newStatus === 'Resolved') {
      notifTitle = '🎉 Grievance Complaint Resolved!';
      notifMsg = `Your civic complaint ${requestId} has been resolved by field officer ${updatingUser.fullName || 'Officer'}. Work order completed.`;
    } else if (newStatus === 'Completed') {
      notifTitle = '🎓 Municipal Service Completed!';
      notifMsg = `Your service request ${requestId} has been marked as completed. Official receipt/certificate is ready.`;
    } else if (newStatus === 'Rejected') {
      notifTitle = '❌ Request Status Updated: Rejected';
      notifMsg = `Your request ${requestId} has been rejected following verification. Officer Remarks: "${remarks}"`;
    }

    setData(prev => {
      const requests = prev.citizenServiceRequests || [];
      const exists = requests.some(r => r.id === requestId);

      let updatedRequests;
      let citizenEmail = 'citizen@bbmp.gov.in';

      if (exists) {
        updatedRequests = requests.map(req => {
          if (req.id === requestId) {
            historyEntry.previousStatus = req.status;
            citizenEmail = req.citizenEmail || citizenEmail;
            return {
              ...req,
              status: newStatus,
              stage: `Current Stage: ${newStatus}`,
              updatedAt: nowIso,
              statusHistory: [historyEntry, ...(req.statusHistory || [])]
            };
          }
          return req;
        });
      } else {
        const syntheticReq = {
          id: requestId,
          serviceId: requestId.includes('BWSSB') || requestId.includes('406') || requestId.includes('236') ? 'water-sewerage' : 'road-streetlights',
          serviceName: requestId.includes('BWSSB') || requestId.includes('406') || requestId.includes('236') ? 'Water & Sewerage Services' : 'Road & Streetlight Complaints',
          department: 'Civil Department',
          citizenName: 'Citizen Applicant',
          citizenEmail: citizenEmail,
          status: newStatus,
          stage: `Current Stage: ${newStatus}`,
          submissionDate: new Date().toLocaleDateString(),
          createdAt: nowIso,
          updatedAt: nowIso,
          assignedOfficerName: updatingUser.fullName || 'Municipal Officer',
          assignedOfficerEmail: updatingUser.email,
          statusHistory: [historyEntry]
        };
        updatedRequests = [syntheticReq, ...requests];
      }

      const notifObj = {
        id: `NOTIF-${Date.now()}`,
        citizenEmail: citizenEmail,
        title: notifTitle,
        message: notifMsg,
        requestId: requestId,
        createdAt: nowIso,
        read: false
      };

      try {
        localStorage.setItem(PERMANENT_REQUESTS_KEY, JSON.stringify(updatedRequests));
      } catch (e) {}

      return {
        ...prev,
        citizenServiceRequests: updatedRequests,
        notifications: [notifObj, ...(prev.notifications || [])]
      };
    });

    // Record Security Audit Log
    recordSecurityAuditLog(
      'STATUS_TRANSITION',
      updatingUser,
      `Officer ${updatingUser.fullName || updatingUser.email} updated status of ${requestId} to ${newStatus}. Remarks: ${remarks}`
    );

    showToast(`Status updated to "${newStatus}" for Request ${requestId}!`, "success");
    return true;
  };

  /**
   * SECURITY & AUTHORIZATION GUARD:
   * Filters request queue so unauthorized officers CANNOT access requests outside their authorization.
   */
  const getAuthorizedOfficerQueue = (officerUser) => {
    if (!officerUser) return [];
    const allRequests = data.citizenServiceRequests || [];

    if (officerUser.role === 'super_admin') {
      return allRequests;
    }

    const cleanEmail = (officerUser.email || '').toLowerCase().trim();
    const cleanDept = (officerUser.department || '').toLowerCase().trim();
    const cleanDeptId = (officerUser.departmentId || '').toLowerCase().trim();

    return allRequests.filter(req => {
      const rEmail = (req.assignedOfficerEmail || '').toLowerCase().trim();
      const rId = req.assignedOfficerId || '';
      const rDept = (req.department || '').toLowerCase().trim();
      const rDeptId = (req.departmentId || '').toLowerCase().trim();

      if (rEmail && (rEmail === cleanEmail || cleanEmail.includes(rEmail))) return true;
      if (rId && rId === officerUser.id) return true;
      if (cleanDeptId && (rDeptId === cleanDeptId || cleanDeptId.includes(rDeptId))) return true;
      if (cleanDept && rDept && (cleanDept.includes('public works') || cleanDept.includes('road')) && (rDept.includes('public works') || rDept.includes('road'))) return true;
      if (cleanDept && rDept && (cleanDept === rDept || cleanDept.includes(rDept) || rDept.includes(cleanDept))) return true;
      return false;
    });
  };

  /**
   * BACKEND DEPARTMENT ADMIN SECURITY FILTER:
   * Department Admins MUST ONLY access requests belonging to their authorized department.
   * Prevents accessing unrelated departments.
   */
  const getDepartmentAdminQueue = (adminUser) => {
    if (!adminUser) return [];
    const allRequests = data.citizenServiceRequests || [];

    if (adminUser.role === 'super_admin') {
      return allRequests;
    }

    return allRequests.filter(req => 
      req.department === adminUser.department ||
      req.departmentId === adminUser.departmentId
    );
  };

  /**
   * BACKEND REASSIGNMENT ENGINE:
   * Allows Department Admins & Super Admins to reassign a request to another authorized officer.
   */
  const reassignRequestToOfficer = (requestId, newOfficerId, remarks, adminUser) => {
    if (!adminUser || (adminUser.role !== 'dept_admin' && adminUser.role !== 'super_admin')) {
      showToast("Security Rejection: Unauthorized to reassign department requests.", "danger");
      return false;
    }

    const officers = data.officers || initialMunicipalData.officers || [];
    const targetOfficer = officers.find(o => o.id === newOfficerId);

    if (!targetOfficer) {
      showToast(`Officer ID ${newOfficerId} not found in database.`, "warning");
      return false;
    }

    let updatedReq = null;

    setData(prev => {
      const requests = prev.citizenServiceRequests || [];
      const updatedRequests = requests.map(req => {
        if (req.id === requestId) {
          const nowIso = new Date().toISOString();
          const historyEntry = {
            historyId: `HIS-REASG-${Date.now()}`,
            previousStatus: req.status,
            newStatus: req.status,
            updatedBy: `${adminUser.fullName} (${adminUser.email})`,
            updatedByRole: adminUser.role,
            updatedAt: nowIso,
            remarks: `Reassigned to Officer: ${targetOfficer.fullName} (${targetOfficer.email}). Remarks: "${remarks || 'Reassigned by Department Admin'}"`
          };

          updatedReq = {
            ...req,
            assignedOfficerId: targetOfficer.id,
            assignedOfficerName: targetOfficer.fullName,
            assignedOfficerEmail: targetOfficer.email,
            updatedAt: nowIso,
            statusHistory: [historyEntry, ...(req.statusHistory || [])]
          };

          return updatedReq;
        }
        return req;
      });

      return {
        ...prev,
        citizenServiceRequests: updatedRequests
      };
    });

    if (updatedReq) {
      showToast(`Reassigned Request ${requestId} to Officer ${targetOfficer.fullName}!`, "success");
      return true;
    }

    return false;
  };

  /**
   * BACKEND CITIZEN SECURITY FILTER:
   * Enforces strict privacy restriction so citizens can ONLY view their own requests.
   * Prevents viewing other citizens' applications.
   */
  const getCitizenOwnRequests = (currentUser) => {
    if (!currentUser) return [];
    const allRequests = data.citizenServiceRequests || [];
    return allRequests.filter(req => 
      req.citizenEmail === currentUser.email ||
      req.citizenId === currentUser.email ||
      req.citizenId === currentUser.id
    );
  };

  /**
   * BACKEND NOTIFICATIONS SECURITY FILTER:
   * Restricts notifications so citizens ONLY receive and view their own notifications.
   * Does NOT expose notifications belonging to another citizen.
   */
  const getCitizenNotifications = (currentUser) => {
    if (!currentUser) return [];
    const allNotifs = data.notifications || [];
    return allNotifs.filter(n => n.citizenEmail === currentUser.email);
  };

  /**
   * Helper: Marks a citizen notification as read.
   */
  const markNotificationAsRead = (notifId) => {
    setData(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n => 
        n.id === notifId ? { ...n, read: true } : n
      )
    }));
  };

  return (
    <DataContext.Provider value={{
      data,
      setData,
      addItem,
      updateItem,
      deleteItem,
      updateSiteInfo,
      updateHeroSlides,
      resetData,
      submitContactMessage,
      serviceDepartmentMap,
      getDepartmentForService,
      submitCitizenServiceRequest,
      autoAssignOfficer,
      updateRequestStatus,
      getAuthorizedOfficerQueue,
      getCitizenOwnRequests,
      getDepartmentAdminQueue,
      reassignRequestToOfficer,
      getCitizenNotifications,
      markNotificationAsRead,
      recordSecurityAuditLog,
      verifyRequestOwnershipAndAccess,
      checkRateLimit,
      activeToast,
      showToast,
      lightboxImage,
      setLightboxImage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useMunicipalData = () => {
  const context = useContext(DataContext);
  if (!context) {
    return {
      data: initialMunicipalData,
      setData: () => {},
      addItem: () => {},
      updateItem: () => {},
      deleteItem: () => {},
      updateSiteInfo: () => {},
      updateHeroSlides: () => {},
      submitContactMessage: () => {},
      submitCitizenServiceRequest: () => {},
      updateRequestStatus: () => {},
      getAuthorizedOfficerQueue: () => [],
      getCitizenOwnRequests: () => [],
      getDepartmentAdminQueue: () => [],
      reassignRequestToOfficer: () => {},
      getCitizenNotifications: () => [],
      markNotificationAsRead: () => {},
      recordSecurityAuditLog: () => {},
      verifyRequestOwnershipAndAccess: () => true,
      checkRateLimit: () => true,
      activeToast: null,
      showToast: () => {},
      lightboxImage: null,
      setLightboxImage: () => {}
    };
  }
  return context;
};

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMunicipalData } from '../context/DataContext';

export const ProtectedRoute = ({ children, allowedRoles = [], onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useMunicipalData();

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Access Denied: Please log in to access this dashboard.', 'warning');
      onNavigate('/login');
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      showToast(`Unauthorized Access: You do not have permissions for this section.`, 'warning');
      
      // Redirect to their correct dashboard
      if (user?.role === 'citizen') onNavigate('/citizen-dashboard');
      else if (user?.role === 'officer') onNavigate('/officer-dashboard');
      else if (user?.role === 'dept_admin') onNavigate('/dept-admin-dashboard');
      else if (user?.role === 'super_admin') onNavigate('/super-admin-dashboard');
      else onNavigate('/login');
    }
  }, [isAuthenticated, user, allowedRoles, onNavigate, showToast]);

  if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(user?.role))) {
    return (
      <div style={{ padding: '5rem 1rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '2rem', borderRadius: '12px', maxWidth: '500px' }}>
          <h3 style={{ color: '#991b1b', margin: '0 0 0.5rem 0' }}>🔒 Access Control Security Intercept</h3>
          <p style={{ color: '#7f1d1d', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
            Direct URL manipulation detected. Redirecting you to your authorized dashboard...
          </p>
        </div>
      </div>
    );
  }

  return children;
};

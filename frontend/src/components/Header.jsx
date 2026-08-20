import React from 'react';
import { ShieldCheck, ChevronDown, LogOut, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = ({ currentPath = '/', onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    {
      label: 'Government',
      path: '/people',
      dropdown: [
        { label: 'Meet Our Officials', path: '/people' },
        { label: 'GBA Administration', path: '/gba-administration' },
        { label: 'City Corporations', path: '/city-corporations' },
        { label: 'Municipal Departments', path: '/departments' }
      ]
    },
    {
      label: 'Departments',
      path: '/services',
      dropdown: [
        { label: 'All Departments & Services', path: '/services' },
        { label: 'Civil Department (Roads, Water, Sanitation)', path: '/services#road-streetlights' },
        { label: 'Medical Department (Birth & Death Certificates)', path: '/services#birth-death' }
      ]
    },
    { label: 'Directory', path: '/directory' },
    { label: 'Events', path: '/events' },
    { label: 'News', path: '/news' },
    { label: 'Contact', path: '/contact' }
  ];

  const isAdminActive = currentPath.startsWith('/admin');

  return (
    <header className="main-header" style={{ borderTop: 'none' }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* NAVBAR */}
      <nav className="primary-nav">
        <div className="container nav-container">
          
          {/* Left Side Official Kalyan Healthcare Logo */}
          <div className="header-brand-wrap">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
              className="header-brand-logo-link"
              title="Kalpanaaa Govt Official Portal"
            >
              <img 
                src="/images/kalyanaaa-govt-logo.png" 
                alt="Kalpanaaa Govt Official Logo" 
                className="header-brand-logo-img"
              />
            </a>
          </div>

          <ul className="nav-menu">
            {navItems.map((item, idx) => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <li key={idx} className={`nav-item ${isActive ? 'active' : ''}`}>
                  <a 
                    href={item.path} 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.path);
                    }} 
                    className="nav-link"
                  >
                    <span>{item.label}</span>
                    {item.dropdown && <ChevronDown size={14} style={{ opacity: 0.7 }} />}
                  </a>

                  {item.dropdown && (
                    <ul className="dropdown-menu">
                      {item.dropdown.map((sub, subIdx) => (
                        <li key={subIdx} className="dropdown-item">
                          <a 
                            href={sub.path} 
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigate(sub.path);
                            }}
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Dedicated Dynamic Auth Button on the Right */}
          <div className="nav-admin-btn-wrap" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <a
                  href={
                    user?.role === 'citizen' ? '/citizen-dashboard' :
                    user?.role === 'officer' ? '/officer-dashboard' : '/super-admin-dashboard'
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    const targetDashboard = 
                      user?.role === 'citizen' ? '/citizen-dashboard' :
                      user?.role === 'officer' ? '/officer-dashboard' : '/super-admin-dashboard';
                    onNavigate(targetDashboard);
                  }}
                  className="nav-admin-btn active"
                  style={{ background: '#008b95', color: 'white', borderColor: '#008b95', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <ShieldCheck size={16} />
                  <span>
                    {user?.role === 'citizen' ? 'Citizen Dashboard' :
                     user?.role === 'officer' ? 'Officer Dashboard' : 'Admin Dashboard'}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={logout}
                  className="nav-admin-btn"
                  style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.35)', cursor: 'pointer' }}
                  title="Logout of session"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/login');
                }}
                className="nav-admin-btn"
                style={{ background: '#008b95', color: 'white', borderColor: '#008b95', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Lock size={15} />
                <span>Portal Login</span>
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

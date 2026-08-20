import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Search, ShieldCheck, LogOut, Lock, PhoneCall, Sparkles, Building2, Layers, AlertCircle, FileText, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileMenu = ({ isOpen, onClose, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const toggleSubmenu = (idx) => {
    setOpenSubmenu(openSubmenu === idx ? null : idx);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    {
      label: 'Civic Services & Permits',
      path: '/services',
      icon: <Layers size={18} />,
      sub: [
        { label: '⚡ All Municipal Services', path: '/services' },
        { label: '🛣️ Road, Potholes & Streetlights', path: '/services#road-streetlights' },
        { label: '📜 Birth & Death Registration', path: '/services#birth-death' },
        { label: '💧 Water Connection & Sewerage', path: '/services#water-sewerage' },
        { label: '🚚 Waste Management & Tipper Schedule', path: '/services#solid-waste' },
        { label: '🔍 Grievance & Application Tracker', path: '/services#tracking' }
      ]
    },
    {
      label: 'About Municipal Corporation',
      path: '/about',
      icon: <Building2 size={18} />,
      sub: [
        { label: '🏢 About BBMP / Corporation', path: '/about' },
        { label: '🏛️ History & Heritage Milestones', path: '/about#history' },
        { label: '🎯 Mission, Vision & City Charter', path: '/about#mission' },
        { label: '📊 Key Municipal Statistics', path: '/about#stats' }
      ]
    },
    {
      label: 'Government & Administration',
      path: '/people',
      icon: <ShieldCheck size={18} />,
      sub: [
        { label: '👥 Meet Our Public Officials', path: '/people' },
        { label: '🏛️ Greater Bengaluru Authority (GBA)', path: '/gba-administration' },
        { label: '🏙️ 5 City Corporations', path: '/city-corporations' },
        { label: '📂 Municipal Departments CMS', path: '/departments' }
      ]
    },
    { label: 'Municipal Directory', path: '/directory' },
    { label: 'Upcoming Public Events', path: '/events' },
    { label: 'News & Official Notices', path: '/news' },
    { label: 'Important Public Notices', path: '/notices' },
    { label: 'Government Documents & Forms', path: '/documents' },
    { label: 'City Photo Galleries', path: '/galleries' },
    { label: 'Contact Us & Grievance Cell', path: '/contact' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      onNavigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleNavClick = (path) => {
    onClose();
    onNavigate(path);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 26, 38, 0.96)',
      backdropFilter: 'blur(12px)',
      zIndex: 9999,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Top Drawer Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'rgba(11, 47, 69, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img 
            src="https://res.cloudinary.com/mcizaxyv/image/upload/v1787210271/bbmp_gov/kalyanaaa-govt-logo.png" 
            alt="Govt Logo" 
            style={{ height: '32px', width: 'auto' }}
          />
          <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.5px' }}>
            MUNICIPAL PORTAL
          </div>
        </div>
        <button 
          onClick={onClose} 
          style={{ 
            color: 'white', 
            background: 'rgba(255,255,255,0.1)', 
            border: 'none', 
            padding: '6px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <div style={{ padding: '1.25rem', flex: 1 }}>
        
        {/* User Status Card */}
        {isAuthenticated ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 139, 149, 0.25) 0%, rgba(11, 47, 69, 0.5) 100%)',
            border: '1px solid rgba(0, 139, 149, 0.4)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#99f6e4', fontWeight: 800, textTransform: 'uppercase' }}>
                  Logged in as {user?.role}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>
                  {user?.fullName || user?.email}
                </div>
              </div>
              <span style={{
                background: '#008b95',
                color: 'white',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {user?.role === 'super_admin' ? '👑 Admin' : user?.role === 'officer' ? '👮 Officer' : '👤 Citizen'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  const targetDashboard = 
                    user?.role === 'citizen' ? '/citizen-dashboard' :
                    user?.role === 'officer' ? '/officer-dashboard' : '/super-admin-dashboard';
                  handleNavClick(targetDashboard);
                }}
                style={{
                  flex: 1,
                  background: '#008b95',
                  color: 'white',
                  padding: '0.55rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <ShieldCheck size={16} /> Open Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              onClick={() => handleNavClick('/login')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #008b95 0%, #0f766e 100%)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 139, 149, 0.35)'
              }}
            >
              <Lock size={18} /> Official Portal Login
            </button>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <input 
            type="text" 
            placeholder="Search services, wards, notices..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              fontSize: '0.9rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              outline: 'none'
            }}
          />
          <button 
            type="submit" 
            style={{ 
              background: '#008b95', 
              color: 'white', 
              border: 'none', 
              padding: '0 1rem', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Search size={18} />
          </button>
        </form>

        {/* Nav Items List */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map((item, idx) => (
            <li key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a 
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.path);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.85rem 0',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'white',
                    textDecoration: 'none',
                    flex: 1
                  }}
                >
                  {item.label}
                </a>

                {item.sub && (
                  <button 
                    onClick={() => toggleSubmenu(idx)} 
                    style={{ 
                      color: '#99f6e4', 
                      background: 'rgba(255,255,255,0.06)', 
                      border: 'none', 
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {openSubmenu === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                )}
              </div>

              {item.sub && openSubmenu === idx && (
                <ul style={{ listStyle: 'none', paddingLeft: '0.75rem', paddingBottom: '0.75rem', borderLeft: '2px solid #008b95', marginLeft: '0.5rem', marginBottom: '0.5rem' }}>
                  {item.sub.map((sub, sIdx) => (
                    <li key={sIdx} style={{ margin: '0.35rem 0' }}>
                      <a 
                        href={sub.path}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(sub.path);
                        }}
                        style={{ color: '#cbd5e1', fontSize: '0.9rem', textDecoration: 'none', display: 'block', padding: '0.25rem 0' }}
                      >
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Quick Emergency & Helpline Banner */}
        <div style={{
          marginTop: '1.5rem',
          background: 'rgba(217, 119, 6, 0.15)',
          border: '1px solid rgba(217, 119, 6, 0.35)',
          borderRadius: '10px',
          padding: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <PhoneCall size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: '#fcd34d', fontWeight: 800 }}>BBMP 24/7 HELPLINE</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>1533 / (080) 2297 5555</div>
          </div>
        </div>

      </div>
    </div>
  );
};

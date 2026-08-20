import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Search, ShieldCheck } from 'lucide-react';

export const MobileMenu = ({ isOpen, onClose, onNavigate }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const toggleSubmenu = (idx) => {
    setOpenSubmenu(openSubmenu === idx ? null : idx);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    {
      label: 'About Municipal',
      path: '/about',
      sub: [
        { label: 'About Greenfield', path: '/about' },
        { label: 'History & Heritage', path: '/about#history' },
        { label: 'Mission & Vision', path: '/about#mission' },
        { label: 'Key Statistics', path: '/about#stats' }
      ]
    },
    {
      label: 'Government',
      path: '/people',
      sub: [
        { label: 'Meet Our Officials', path: '/people' },
        { label: 'GBA Administration', path: '/gba-administration' },
        { label: 'City Corporations', path: '/city-corporations' },
        { label: 'Municipal Departments', path: '/departments' }
      ]
    },
    {
      label: 'Departments',
      path: '/services',
      sub: [
        { label: 'All Departments & Services', path: '/services' },
        { label: 'Civil Department (Roads, Water, Sanitation)', path: '/services#road-streetlights' },
        { label: 'Medical Department (Birth & Death)', path: '/services#birth-death' }
      ]
    },
    { label: 'Municipal Directory', path: '/directory' },
    { label: 'Upcoming Events', path: '/events' },
    { label: 'Latest News', path: '/news' },
    { label: 'Important Notices', path: '/notices' },
    { label: 'Government Documents', path: '/documents' },
    { label: 'City Photo Galleries', path: '/galleries' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Admin CMS Portal', path: '/admin', isSpecial: true }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      onNavigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 31, 46, 0.95)',
      backdropFilter: 'blur(8px)',
      zIndex: 2500,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: 'serif' }}>
          GREENFIELD MUNICIPAL
        </div>
        <button onClick={onClose} style={{ color: 'white', background: 'none', border: 'none', padding: '6px' }}>
          <X size={28} />
        </button>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Search municipal site..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white'
            }}
          />
          <button type="submit" style={{ background: '#007791', color: 'white', border: 'none', padding: '0 1.25rem', borderRadius: '6px' }}>
            <Search size={20} />
          </button>
        </form>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map((item, idx) => (
            <li key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a 
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    onNavigate(item.path);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 0',
                    fontSize: '1.1rem',
                    fontWeight: item.isSpecial ? 700 : 500,
                    color: item.isSpecial ? '#fcd34d' : 'white',
                    textDecoration: 'none'
                  }}
                >
                  {item.isSpecial && <ShieldCheck size={18} />}
                  {item.label}
                </a>

                {item.sub && (
                  <button onClick={() => toggleSubmenu(idx)} style={{ color: 'white', background: 'none', border: 'none', padding: '0.5rem' }}>
                    {openSubmenu === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
              </div>

              {item.sub && openSubmenu === idx && (
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', paddingBottom: '0.75rem' }}>
                  {item.sub.map((sub, sIdx) => (
                    <li key={sIdx} style={{ margin: '0.5rem 0' }}>
                      <a 
                        href={sub.path}
                        onClick={(e) => {
                          e.preventDefault();
                          onClose();
                          onNavigate(sub.path);
                        }}
                        style={{ color: '#cbd5e1', fontSize: '0.95rem', textDecoration: 'none' }}
                      >
                        • {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

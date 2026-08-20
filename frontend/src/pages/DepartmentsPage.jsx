import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Building2, Phone, Mail, UserCheck, Search, ArrowRight } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const DepartmentsPage = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const [searchTerm, setSearchTerm] = useState('');

  const departments = data.departments || [];

  const filteredDepts = departments.filter(d => {
    const term = searchTerm.toLowerCase();
    return d.name.toLowerCase().includes(term) ||
           d.description.toLowerCase().includes(term) ||
           d.head.toLowerCase().includes(term);
  });

  return (
    <div id="main-content">
      {/* 1. Hero Banner */}
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Municipal Departments' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Greater Bengaluru Municipal Departments</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '680px' }}>
            Executive administrative wings responsible for urban infrastructure, revenue taxation, public health, environmental sanitation, and disaster governance.
          </p>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">

          {/* Search Box */}
          <div style={{
            background: 'white',
            padding: '1.25rem 1.5rem',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            marginBottom: '2.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search department name (e.g. Revenue, Infrastructure, Waste Management, Health)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem', outline: 'none' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Showing {filteredDepts.length} Department{filteredDepts.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Department Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {filteredDepts.map((dept, index) => (
              <div 
                key={dept.id}
                onClick={() => onNavigate(`/departments/${dept.slug}`)}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 14px rgba(11, 47, 69, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                {/* Cover Image */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img 
                    src={dept.image} 
                    alt={dept.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,47,69,0.85) 0%, transparent 60%)' }} />
                  
                  <span style={{ position: 'absolute', bottom: '12px', left: '16px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)' }}>
                    Division {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-sans)' }}>
                    {dept.name}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: '1.55', marginBottom: '1.25rem' }}>
                    {dept.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                      <UserCheck size={16} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Executive Head:</strong> {dept.head}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                      <Phone size={16} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                      <span><strong>Department Contact:</strong> {dept.phone}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                      <Mail size={16} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                      <span><strong>Email Helpline:</strong> {dept.email}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      BBMP Executive Wing
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/departments/${dept.slug}`);
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      <span>View Department Details & Portals</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

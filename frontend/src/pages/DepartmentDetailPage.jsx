import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Phone, Mail, UserCheck, ExternalLink, ArrowLeft, ShieldAlert, FileText, CheckCircle2, AlertTriangle, Cpu, Layers, MapPin, Globe, CreditCard } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const DepartmentDetailPage = ({ slug, onNavigate }) => {
  const { data } = useMunicipalData();

  const depts = data.departments || [];
  const dept = depts.find(d => d.slug.toLowerCase() === (slug || '').toLowerCase()) || depts[0];

  return (
    <div id="main-content">
      {/* 1. Hero Header */}
      <div className="page-hero">
        <div className="container">
          <Breadcrumb 
            items={[
              { label: 'Municipal Departments', path: '/departments' },
              { label: dept.name }
            ]} 
            onNavigate={onNavigate} 
          />

          <span style={{ background: '#008b95', color: '#ffffff', fontSize: '0.8rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Greater Bengaluru Executive Wing
          </span>

          <h1 className="page-hero-title" style={{ marginTop: '0.75rem', fontSize: '2.35rem' }}>
            {dept.name} Department
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '750px' }}>
            {dept.description}
          </p>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>

          {/* Back Button */}
          <div style={{ marginBottom: '1.75rem' }}>
            <button 
              onClick={() => onNavigate('/departments')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-secondary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to All Municipal Departments</span>
            </button>
          </div>

          {/* Banner Image */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '340px', marginBottom: '2.5rem', boxShadow: '0 8px 24px rgba(11, 47, 69, 0.1)', border: '1px solid var(--color-border)', position: 'relative' }}>
            <img src={dept.image} alt={dept.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,47,69,0.85) 0%, transparent 50%)' }} />
            
            <div style={{ position: 'absolute', bottom: '20px', left: '24px', color: '#ffffff' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                {dept.name} Executive Division
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', color: '#cbd5e1', fontSize: '0.95rem' }}>
                Governed by Greater Bengaluru Authority (GBA)
              </p>
            </div>
          </div>

          {/* Structural Governance Note */}
          {dept.structuralNote && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.25rem 1.5rem', borderRadius: '10px', marginBottom: '2.5rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <Layers size={22} style={{ color: '#1d4ed8', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e40af', margin: '0 0 0.35rem 0' }}>
                  Governance Architecture Note (2025 Structural Division)
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#1e3a8a', margin: 0, lineHeight: '1.55' }}>
                  {dept.structuralNote}
                </p>
              </div>
            </div>
          )}

          {/* Executive Leadership & Contact Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 14px rgba(11, 47, 69, 0.05)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '0.85rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={18} style={{ color: 'var(--color-secondary)' }} />
                <span>Executive Department Head</span>
              </h3>
              <p style={{ color: 'var(--color-primary)', fontSize: '1.05rem', fontWeight: 800, margin: 0, lineHeight: '1.5' }}>
                {dept.head}
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 14px rgba(11, 47, 69, 0.05)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '0.85rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} style={{ color: 'var(--color-secondary)' }} />
                <span>Helpline & Email Support</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div><strong>Revenue Helpline:</strong> {dept.phone}</div>
                <div><strong>Email Support:</strong> <a href={`mailto:${dept.email}`} style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>{dept.email}</a></div>
              </div>
            </div>

          </div>

          {/* Official Portals */}
          {dept.portals && (
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={20} style={{ color: 'var(--color-secondary)' }} />
                <span>Official Digital Portals</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {dept.portals.map((portal, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{portal.name}</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.2rem', wordBreak: 'break-all' }}>{portal.url}</div>
                    </div>

                    <div style={{ marginTop: '1.25rem' }}>
                      <a 
                        href={`https://${portal.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-secondary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}
                      >
                        <span>{portal.action}</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Functions / Services */}
          {dept.coreFunctions && (
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={20} style={{ color: 'var(--color-secondary)' }} />
                <span>Core Functions & Services</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {dept.coreFunctions.map((fn, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem', fontSize: '0.98rem' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                      <span>{fn.title}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', margin: 0, lineHeight: '1.5' }}>
                      {fn.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citizen Rules & Guidelines */}
          {dept.citizenRules && (
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} style={{ color: '#d97706' }} />
                <span>Citizen Compliance Rules & Guidelines</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {dept.citizenRules.map((ruleItem, idx) => (
                  <div key={idx} style={{ background: '#fffbeb', padding: '1.25rem', borderRadius: '10px', border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#92400e', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <AlertTriangle size={18} style={{ color: '#b45309', flexShrink: 0 }} />
                      <span>{ruleItem.rule}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#78350f', margin: 0, lineHeight: '1.5' }}>
                      {ruleItem.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button 
              onClick={() => onNavigate('/services')}
              className="btn btn-primary"
              style={{ fontSize: '0.95rem', padding: '0.8rem 2rem' }}
            >
              Access Online Services Portal
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};

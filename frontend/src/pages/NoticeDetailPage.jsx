import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { AlertCircle, Calendar, Building2, Download, Printer, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const NoticeDetailPage = ({ slug, onNavigate }) => {
  const { data, showToast } = useMunicipalData();

  const notice = data.notices.find(n => n.slug === slug) || data.notices[0];

  return (
    <div id="main-content">
      <div className="page-hero" style={{ background: notice.severity === 'Urgent' ? '#9b2c2c' : 'var(--color-primary)' }}>
        <div className="container">
          <Breadcrumb 
            items={[
              { label: 'Important Notices', path: '/notices' },
              { label: notice.title }
            ]} 
            onNavigate={onNavigate} 
          />
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '0.5rem 0' }}>
            <span style={{
              background: notice.severity === 'Urgent' ? '#feb2b2' : '#e0f2fe',
              color: notice.severity === 'Urgent' ? '#742a2a' : '#0369a1',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              {notice.type} ({notice.severity})
            </span>
            <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
              Issued: {notice.date}
            </span>
          </div>
          <h1 className="page-hero-title">{notice.title}</h1>
        </div>
      </div>

      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{
            border: '2px solid var(--color-border)',
            borderRadius: '8px',
            padding: '2.5rem',
            background: 'var(--color-bg-body)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building2 size={28} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.1rem' }}>GREENFIELD MUNICIPAL</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>OFFICIAL EXECUTIVE ADVISORY</span>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Ref ID: <strong>NOT-{notice.id}</strong>
              </div>
            </div>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Department Issuer: {notice.department || 'Office of Municipal Services'}
            </h3>

            <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-text-main)', marginBottom: '2rem' }}>
              {notice.content}
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-primary)' }}>Official Public Record Attachment</strong>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>PDF Notice Document • 450 KB</span>
              </div>
              <button 
                onClick={() => showToast(`Downloaded PDF document for "${notice.title}"`)}
                className="btn btn-primary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => onNavigate('/notices')}
              className="btn btn-outline-light"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Notices Archive</span>
            </button>
            <button 
              onClick={() => window.print()}
              className="btn btn-dark"
            >
              <Printer size={16} />
              <span>Print Official Copy</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { AlertCircle, AlertTriangle, Info, ArrowRight, Calendar } from 'lucide-react';

export const NoticeCard = ({ notice, onNavigate }) => {
  const isUrgent = notice.severity === 'Urgent' || notice.severity === 'Warning';

  return (
    <div className={`notice-card ${isUrgent ? 'urgent' : ''}`}>
      <div className="notice-icon">
        {notice.severity === 'Urgent' ? (
          <AlertCircle size={28} />
        ) : notice.severity === 'Warning' ? (
          <AlertTriangle size={28} />
        ) : (
          <Info size={28} />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            background: isUrgent ? '#fed7d7' : '#e2e8f0',
            color: isUrgent ? '#c53030' : '#2d3748'
          }}>
            {notice.type || notice.severity}
          </span>
          <span className="notice-meta" style={{ margin: 0 }}>
            <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Issued: {notice.date}
          </span>
        </div>

        <h3 className="notice-title">
          <a 
            href={`/notices/${notice.slug}`} 
            onClick={(e) => { e.preventDefault(); onNavigate(`/notices/${notice.slug}`); }}
            style={{ color: 'inherit' }}
          >
            {notice.title}
          </a>
        </h3>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          {notice.summary}
        </p>

        <a 
          href={`/notices/${notice.slug}`} 
          onClick={(e) => { e.preventDefault(); onNavigate(`/notices/${notice.slug}`); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.85rem', color: isUrgent ? '#c53030' : 'var(--color-secondary)' }}
        >
          <span>Read Full Notice</span>
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
};

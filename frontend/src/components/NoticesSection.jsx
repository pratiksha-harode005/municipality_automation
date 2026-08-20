import React from 'react';
import { ArrowRight, Bell } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { NoticeCard } from './NoticeCard';

export const NoticesSection = ({ onNavigate }) => {
  const { data } = useMunicipalData();

  return (
    <section className="notices-section">
      <div className="container">
        <div className="section-title-wrap">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <Bell size={16} />
            Official Bulletins
          </div>
          <h2 className="section-title">Important Notices</h2>
          <p className="section-subtitle">
            Critical municipal alerts, public hearings, service maintenance advisories, and emergency weather instructions.
          </p>
        </div>

        <div>
          {data.notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onNavigate={onNavigate} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a 
            href="/notices" 
            onClick={(e) => { e.preventDefault(); onNavigate('/notices'); }}
            className="btn btn-outline-light"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
          >
            <span>View All Public Notices Archive</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

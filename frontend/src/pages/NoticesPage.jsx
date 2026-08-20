import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { NoticeCard } from '../components/NoticeCard';
import { Bell, Filter, Search } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const NoticesPage = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  const filteredNotices = data.notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = selectedSeverity === 'All' || n.severity === selectedSeverity || n.type === selectedSeverity;
    return matchesSearch && matchesSev;
  });

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Important Public Notices' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Official Bulletins & Public Notices</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px' }}>
            Official municipal bulletins, water utility maintenance advisories, emergency alerts, public hearing notices, and ordinances.
          </p>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">
          {/* Controls */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            marginBottom: '2rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search notices by keyword or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.25rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} style={{ color: 'var(--color-secondary)' }} />
              <select 
                value={selectedSeverity} 
                onChange={(e) => setSelectedSeverity(e.target.value)}
                style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white' }}
              >
                <option value="All">All Notice Types</option>
                <option value="Urgent">Emergency / Urgent</option>
                <option value="Warning">Maintenance Warning</option>
                <option value="Public Hearing">Public Hearing</option>
                <option value="Info">General Info</option>
              </select>
            </div>
          </div>

          <div>
            {filteredNotices.map(notice => (
              <NoticeCard key={notice.id} notice={notice} onNavigate={onNavigate} />
            ))}
          </div>

          {filteredNotices.length === 0 && (
            <div style={{ textAlignment: 'center', padding: '3rem', background: 'white', borderRadius: '8px' }}>
              <Bell size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
              <h3>No Public Notices Found</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>There are no active municipal notices matching your search criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

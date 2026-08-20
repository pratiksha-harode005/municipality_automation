import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PersonCard } from '../components/PersonCard';
import { Search, UserCheck } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const PeoplePage = ({ initialMode = 'all', onNavigate }) => {
  const { data } = useMunicipalData();
  const [searchTerm, setSearchTerm] = useState('');

  const peopleList = data.people || [];

  // GBA Administration Officials (Chief Commissioner & Special Commissioners ONLY)
  const gbaOfficials = peopleList.filter(p => {
    const pos = (p.position || '').toLowerCase();
    return pos.includes('chief commissioner') || pos.includes('special commissioner');
  });

  // Target list based on selected view mode (all vs gba)
  const currentCategoryPeople = initialMode === 'gba' ? gbaOfficials : peopleList;

  // Filtered by search term
  const filteredPeople = currentCategoryPeople.filter(p => {
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || 
           p.position.toLowerCase().includes(term) ||
           p.department.toLowerCase().includes(term);
  });

  return (
    <div id="main-content">
      {/* Page Hero Header */}
      <div className="page-hero">
        <div className="container">
          <Breadcrumb 
            items={[{ label: initialMode === 'gba' ? 'GBA Administration' : 'Meet Our Officials' }]} 
            onNavigate={onNavigate} 
          />
          <h1 className="page-hero-title">
            {initialMode === 'gba' ? 'GBA Administration Executives' : 'Meet Our Officials & Leadership'}
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '680px' }}>
            {initialMode === 'gba' 
              ? 'Chief Commissioner and Special Commissioners directing GBA municipal policy, revenue, finance, admin, and welfare.'
              : 'Complete directory of Hon’ble Deputy Chief Minister, Chief Commissioner, Special Commissioners, and Municipal Directors.'
            }
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
                placeholder={initialMode === 'gba' ? "Search Chief Commissioner or Special Commissioners..." : "Search official name, IAS designation, or department..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.3rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem', outline: 'none' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Showing {filteredPeople.length} Official{filteredPeople.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Officials Grid Display */}
          <div className="officials-grid">
            {filteredPeople.map((person) => (
              <PersonCard key={person.id} person={person} onNavigate={onNavigate} />
            ))}
          </div>

          {filteredPeople.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3.5rem 2rem', background: 'white', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <UserCheck size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>No Officials Found</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>Try clearing your search query.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="btn btn-primary"
                style={{ fontSize: '0.875rem' }}
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

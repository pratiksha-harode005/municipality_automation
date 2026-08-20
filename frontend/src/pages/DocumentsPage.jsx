import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { DocumentCard } from '../components/DocumentCard';
import { Search, Filter, Folder, Download } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const DocumentsPage = ({ onNavigate }) => {
  const { data, showToast } = useMunicipalData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Financial Reports', 'Council Minutes', 'Planning & Zoning', 'Permits & Licenses', 'Environmental Reports'];

  const filteredDocs = data.documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'All' || doc.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Public Documents & Budget' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Government Records & Documents Library</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px' }}>
            Access official annual municipal budget publications, city council meeting transcripts, zoning maps, and permit instruction handbooks.
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
                placeholder="Search document title, keyword, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.25rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} style={{ color: 'var(--color-secondary)' }} />
              <select 
                value={selectedCat} 
                onChange={(e) => setSelectedCat(e.target.value)}
                style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white' }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="document-list">
            {filteredDocs.map(doc => (
              <DocumentCard key={doc.id} doc={doc} onNavigate={onNavigate} />
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div style={{ textAlignment: 'center', padding: '3rem', background: 'white', borderRadius: '8px' }}>
              <Folder size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
              <h3>No Public Documents Found</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your search phrase or category filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Image as ImageIcon, Eye, Filter } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const GalleriesPage = ({ onNavigate }) => {
  const { data, setLightboxImage } = useMunicipalData();
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Architecture & Landmarks', 'Parks & Recreation', 'Community Events'];

  const filteredGalleries = data.galleries.filter(gal => {
    return selectedCat === 'All' || gal.category === selectedCat;
  });

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Photo Galleries' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Greenfield Community Photo Galleries</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px' }}>
            Visual showcase of our city hall architecture, public park trails, heritage festivals, and municipal community projects.
          </p>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">
          {/* Filter */}
          <div style={{
            background: 'white',
            padding: '1.25rem 1.5rem',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Filter size={16} style={{ color: 'var(--color-secondary)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>Category Filter:</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCat(cat)}
                  className={`btn ${selectedCat === cat ? 'btn-primary' : 'btn-outline-light'}`}
                  style={{
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.825rem',
                    color: selectedCat === cat ? 'white' : 'var(--color-primary)',
                    borderColor: 'var(--color-primary)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="gallery-grid">
            {filteredGalleries.map((gal) => (
              <div 
                key={gal.id} 
                className="gallery-item"
                style={{ height: '280px' }}
                onClick={() => onNavigate(`/galleries/${gal.slug}`)}
              >
                <img src={gal.coverImage} alt={gal.title} loading="lazy" />
                <div className="gallery-overlay">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-secondary)', fontWeight: 700 }}>
                    <ImageIcon size={12} />
                    <span>{gal.category} • {gal.images ? gal.images.length : 4} Photos</span>
                  </div>
                  <h3 className="gallery-item-title">{gal.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Eye size={12} />
                    <span>Click to open gallery album</span>
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

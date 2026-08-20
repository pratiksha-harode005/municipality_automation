import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Image as ImageIcon, Eye, ArrowLeft } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const GalleryDetailPage = ({ slug, onNavigate }) => {
  const { data, setLightboxImage } = useMunicipalData();

  const gallery = data.galleries.find(g => g.slug === slug) || data.galleries[0];
  const photos = gallery.images || [gallery.coverImage];

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb 
            items={[
              { label: 'Photo Galleries', path: '/galleries' },
              { label: gallery.title }
            ]} 
            onNavigate={onNavigate} 
          />
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
            {gallery.category} • Album Created: {gallery.date}
          </span>
          <h1 className="page-hero-title" style={{ marginTop: '0.5rem' }}>{gallery.title}</h1>
        </div>
      </div>

      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container">
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '750px', marginBottom: '2.5rem', lineHeight: '1.7' }}>
            {gallery.description}
          </p>

          <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
            Album Photos ({photos.length}) — Click image to expand lightbox
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {photos.map((imgUrl, idx) => (
              <div 
                key={idx}
                onClick={() => setLightboxImage({ src: imgUrl, title: `${gallery.title} - Photo #${idx + 1}`, description: gallery.description })}
                style={{
                  height: '220px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img src={imgUrl} alt={`${gallery.title} photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.3)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  color: 'white'
                }} className="photo-hover-overlay">
                  <Eye size={28} />
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('/galleries')}
            className="btn btn-outline-light"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={16} />
            <span>Return to All Photo Galleries</span>
          </button>
        </div>
      </section>
    </div>
  );
};

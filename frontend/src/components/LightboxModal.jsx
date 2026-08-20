import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const LightboxModal = () => {
  const { lightboxImage, setLightboxImage } = useMunicipalData();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setLightboxImage]);

  if (!lightboxImage) return null;

  return (
    <div className="lightbox-modal" onClick={() => setLightboxImage(null)}>
      <button className="lightbox-close" onClick={() => setLightboxImage(null)} title="Close (Esc)">
        <X size={24} />
      </button>

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={lightboxImage.src} alt={lightboxImage.title || 'Municipal photo view'} />
        <div className="lightbox-caption">
          <h4 style={{ color: 'white', marginBottom: '0.3rem', fontSize: '1.2rem' }}>{lightboxImage.title}</h4>
          {lightboxImage.description && <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{lightboxImage.description}</p>}
        </div>
      </div>
    </div>
  );
};

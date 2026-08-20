import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { initialMunicipalData } from '../data/mockData';
import { useMunicipalData } from '../context/DataContext';

export const GallerySection = ({ onNavigate }) => {
  const { setLightboxImage } = useMunicipalData();
  const scrollRef = useRef(null);
  const galleries = initialMunicipalData.galleries;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="home-gallery-slider-section">
      {/* Faint "Galleries" watermark */}
      <div className="home-gallery-watermark" aria-hidden="true">Galleries</div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="home-gallery-slider-wrapper">
          {/* Left Arrow Button */}
          <button 
            type="button"
            className="gallery-nav-arrow arrow-left" 
            onClick={scrollLeft}
            aria-label="Previous Galleries"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Cards Track */}
          <div className="home-gallery-track" ref={scrollRef}>
            {galleries.map((gal) => (
              <div 
                key={gal.id} 
                className="hgal-card"
                onClick={() => setLightboxImage({ src: gal.coverImage, title: gal.title, description: gal.description })}
              >
                {/* Full cover image */}
                <img src={gal.coverImage} alt={gal.title} className="hgal-card-img" loading="lazy" />

                {/* Dark gradient overlay */}
                <div className="hgal-card-overlay" />

                {/* Text Content at bottom */}
                <div className="hgal-card-content">
                  <h3 className="hgal-card-title">{gal.title}</h3>
                  <div className="hgal-card-meta">
                    {gal.date} in <span className="meta-category">{gal.category.toUpperCase()}</span>
                  </div>
                  <div className="hgal-card-count">
                    {gal.imageCount || (gal.images ? gal.images.length : 8)} images
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button 
            type="button"
            className="gallery-nav-arrow arrow-right" 
            onClick={scrollRight}
            aria-label="Next Galleries"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Oval pill button at bottom */}
        <div className="home-gallery-footer">
          <a
            href="/galleries"
            className="btn-more-galleries"
            onClick={(e) => { e.preventDefault(); onNavigate('/galleries'); }}
          >
            MORE GALLERIES
          </a>
        </div>
      </div>
    </section>
  );
};

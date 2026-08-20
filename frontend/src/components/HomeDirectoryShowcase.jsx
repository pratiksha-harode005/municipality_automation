import React from 'react';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const HomeDirectoryShowcase = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  // Limit showcase on home page to exactly 8 cards (4 x 2 layout)
  const listings = (data?.directory || []).slice(0, 8);

  return (
    <section className="home-directory-section">
      {/* Faint watermark */}
      <div className="home-directory-watermark" aria-hidden="true">Directory</div>

      <div className="container">
        <div className="home-directory-header">
          <div className="dir-title-container">
            <span className="section-badge-pill">
              <Building2 size={13} /> Official Facilities & Departments
            </span>
            <h2 className="section-title">Explore Municipal Directory</h2>
          </div>
        </div>

        <div className="home-directory-grid">
          {listings.map((item, index) => (
            <a
              key={item.id || index}
              href={`/directory/${item.slug}`}
              className="hdir-card group"
              style={{ animationDelay: `${index * 0.07}s` }}
              onClick={(e) => { e.preventDefault(); onNavigate(`/directory/${item.slug}`); }}
            >
              {/* Full cover image with zoom effect */}
              <img
                src={item.image}
                alt={item.name}
                className="hdir-card-img"
                loading="lazy"
              />

              {/* High-Contrast Mixed Shadow Gradient Overlay (Black & White Mix for max visibility) */}
              <div className="hdir-card-overlay" />

              {/* Category Pill Top Left */}
              {item.category && (
                <span className="hdir-card-category-pill">
                  {item.category}
                </span>
              )}

              {/* Text info at bottom with ultra-high contrast shadow */}
              <div className="hdir-card-info">
                <h3 className="hdir-card-title">{item.name}</h3>
                <p className="hdir-card-address">
                  <MapPin size={14} strokeWidth={2.2} />
                  <span>{item.address}</span>
                </p>
                <span className="hdir-card-action">
                  <span>Read More</span>
                  <ArrowRight size={14} className="action-arrow" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* View all link */}
        <div className="home-directory-footer">
          <a
            href="/directory"
            className="btn btn-primary btn-shine"
            onClick={(e) => { e.preventDefault(); onNavigate('/directory'); }}
          >
            <span>Explore Complete Municipal Directory</span>
            <ArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
};

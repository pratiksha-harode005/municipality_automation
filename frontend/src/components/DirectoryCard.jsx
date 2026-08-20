import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

export const DirectoryCard = ({ item, onNavigate }) => {
  return (
    <a
      href={`/directory/${item.slug}`}
      className="hdir-card group"
      style={{ animation: 'none', opacity: 1 }}
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
  );
};

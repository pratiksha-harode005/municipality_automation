import React, { useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';

export const InteractiveMap = ({ locations = [] }) => {
  const [selectedPin, setSelectedPin] = useState(locations[0] || null);

  const defaultLocations = [
    { name: "Greenfield City Hall", address: "100 Municipal Plaza", type: "Government", lat: 50, lng: 45 },
    { name: "Memorial Public Library", address: "350 Library Way", type: "Library", lat: 30, lng: 70 },
    { name: "Fire & Rescue Headquarters", address: "500 Safety Blvd", type: "Safety", lat: 70, lng: 30 },
    { name: "Oak Street Recreation Center", address: "420 Oak Street", type: "Parks", lat: 60, lng: 80 }
  ];

  const pins = locations.length > 0 ? locations : defaultLocations;

  return (
    <div style={{ background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
      <div style={{
        padding: '0.75rem 1.25rem',
        background: '#0f3854',
        color: 'white',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        fontSize: '0.9rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Navigation size={16} style={{ color: '#007791' }} />
          <span>Interactive Greenfield Municipal District Map</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Click pin to inspect facility</span>
      </div>

      <div style={{ position: 'relative', height: '340px', background: '#dbeafe', overflow: 'hidden' }}>
        {/* SVG Grid / Map outline mockup */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#bfdbfe" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Main Street Road representation */}
          <path d="M 0 170 Q 300 150 1200 180" fill="none" stroke="#93c5fd" strokeWidth="12" />
          <path d="M 400 0 Q 380 200 450 400" fill="none" stroke="#93c5fd" strokeWidth="8" />
        </svg>

        {/* Render Pins */}
        {pins.map((pin, idx) => {
          const isSelected = selectedPin?.name === pin.name;
          return (
            <button
              key={idx}
              onClick={() => setSelectedPin(pin)}
              style={{
                position: 'absolute',
                top: `${pin.lat || (30 + idx * 15)}%`,
                left: `${pin.lng || (25 + idx * 20)}%`,
                transform: 'translate(-50%, -100%)',
                background: isSelected ? '#c53030' : '#0f3854',
                color: 'white',
                border: '2px solid white',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                zIndex: isSelected ? 10 : 2
              }}
            >
              <MapPin size={14} style={{ color: isSelected ? '#fcd34d' : '#62b6cb' }} />
              <span>{pin.name}</span>
            </button>
          );
        })}

        {/* Active Pin Detail Card Overlay */}
        {selectedPin && (
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '15px',
            right: '15px',
            background: 'white',
            borderRadius: '8px',
            padding: '0.85rem 1.25rem',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            borderLeft: '5px solid #008b95',
            zIndex: 20
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f3854', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedPin.name}
              </h4>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedPin.address || selectedPin.location}
              </p>
            </div>
            
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(selectedPin.name + " " + (selectedPin.address || selectedPin.location || ''))}`} 
              target="_blank" 
              rel="noreferrer"
              style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                color: 'white',
                background: '#008b95',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                flexShrink: 0,
                marginLeft: 'auto',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0, 139, 149, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Get Directions</span>
              <Navigation size={13} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

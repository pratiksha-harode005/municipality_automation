import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { DirectoryCard } from './DirectoryCard';

export const DirectorySection = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const listings = data.directory.slice(0, 3);

  return (
    <section className="directory-section">
      <div className="container">
        <div className="section-title-wrap">
          <h2 className="section-title">Municipal Directory</h2>
          <p className="section-subtitle">
            Find official municipal department addresses, direct phone numbers, email contacts, and operating hours.
          </p>
        </div>

        <div className="directory-grid">
          {listings.map((item) => (
            <DirectoryCard key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a 
            href="/directory" 
            onClick={(e) => { e.preventDefault(); onNavigate('/directory'); }}
            className="btn btn-primary"
          >
            <span>Explore Complete Municipal Directory</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

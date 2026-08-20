import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { InteractiveMap } from '../components/InteractiveMap';
import { DirectoryCard } from '../components/DirectoryCard';
import { Building, MapPin, Phone, Mail, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const DirectoryDetailPage = ({ slug, onNavigate }) => {
  const { data } = useMunicipalData();

  const listing = data.directory.find(d => d.slug === slug) || data.directory[0];
  const related = data.directory.filter(d => d.id !== listing.id).slice(0, 2);

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb 
            items={[
              { label: 'Municipal Directory', path: '/directory' },
              { label: listing.name }
            ]} 
            onNavigate={onNavigate} 
          />
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
            {listing.category}
          </span>
          <h1 className="page-hero-title" style={{ marginTop: '0.5rem' }}>{listing.name}</h1>
        </div>
      </div>

      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          <div>
            <div style={{ height: '360px', borderRadius: '8px', overflow: 'hidden', marginBottom: '2rem' }}>
              <img src={listing.image} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              About this Facility / Department
            </h2>
            <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
              {listing.description}
            </p>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Location & Map
            </h3>
            <InteractiveMap locations={[{ name: listing.name, address: listing.address }]} />
          </div>

          <div>
            <div style={{ background: 'var(--color-bg-body)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1.25rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                Contact & Operating Info
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <MapPin size={20} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-primary)' }}>Address</strong>
                    <span style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>{listing.address}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Phone size={20} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-primary)' }}>Phone Number</strong>
                    <span style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>{listing.phone}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Mail size={20} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-primary)' }}>Official Email</strong>
                    <span style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>{listing.email}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Clock size={20} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-primary)' }}>Operating Hours</strong>
                    <span style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>{listing.hours}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <a 
                  href="/contact" 
                  onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Send Inquiry Message
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Listings */}
      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">
          <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
            Related Municipal Directory Facilities
          </h3>
          <div className="directory-grid">
            {related.map(item => (
              <DirectoryCard key={item.id} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

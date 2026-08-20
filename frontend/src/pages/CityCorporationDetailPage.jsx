import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { MapPin, Phone, Mail, Layers, ShieldCheck, FileText, CheckCircle2, ArrowLeft, Building, HelpCircle, Users, Award, Vote, Landmark, Sparkles, Newspaper, Calendar, ExternalLink, Navigation } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const CityCorporationDetailPage = ({ slug, onNavigate }) => {
  const { data } = useMunicipalData();

  const corps = data.cityCorporations || [];
  const corp = corps.find(c => c.slug.toLowerCase() === (slug || '').toLowerCase()) || corps[0];

  const mapSearchQuery = encodeURIComponent(`${corp.name}, ${corp.headquarters}`);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;

  return (
    <div id="main-content">
      {/* 1. Page Hero Banner */}
      <div className="page-hero">
        <div className="container">
          <Breadcrumb 
            items={[
              { label: 'City Corporations', path: '/city-corporations' },
              { label: corp.name }
            ]} 
            onNavigate={onNavigate} 
          />

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#008b95', color: '#ffffff', fontSize: '0.8rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {corp.shortCode}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.18)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
              {corp.wards} Demarcated Wards
            </span>
            {corp.area && (
              <span style={{ background: 'rgba(255,255,255,0.18)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                Area: {corp.area}
              </span>
            )}
          </div>

          <h1 className="page-hero-title" style={{ marginTop: '0.75rem', fontSize: '2.35rem' }}>
            {corp.name}
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '750px' }}>
            {corp.overview || corp.description}
          </p>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>

          {/* Back Button */}
          <div style={{ marginBottom: '1.75rem' }}>
            <button 
              onClick={() => onNavigate('/city-corporations')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-secondary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to All City Corporations</span>
            </button>
          </div>

          {/* Cover Banner */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '380px', marginBottom: '2.5rem', boxShadow: '0 8px 24px rgba(11, 47, 69, 0.1)', border: '1px solid var(--color-border)', position: 'relative' }}>
            <img src={corp.image} alt={corp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,47,69,0.85) 0%, transparent 50%)' }} />
            
            <div style={{ position: 'absolute', bottom: '20px', left: '24px', color: '#ffffff' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                {corp.name} Jurisdiction
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', color: '#cbd5e1', fontSize: '0.95rem' }}>
                Central Business District & Heritage Urban Core of Namma Bengaluru
              </p>
            </div>
          </div>

          {/* 2. Key Stats Matrix */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.75rem', border: '1px solid var(--color-border)', boxShadow: '0 4px 14px rgba(11, 47, 69, 0.05)', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} style={{ color: 'var(--color-secondary)' }} />
              <span>Corporation Key Statistics</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Demarcated Wards</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.2rem' }}>{corp.wards} Wards</div>
              </div>

              {corp.area && (
                <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Land Area</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.2rem' }}>{corp.area}</div>
                </div>
              )}

              {corp.voters && (
                <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Registered Voters</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.2rem' }}>{corp.voters}</div>
                </div>
              )}

              {corp.constituencies && (
                <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Assembly Constituencies</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.2rem' }}>{corp.constituencies}</div>
                </div>
              )}
            </div>

            {corp.governingLaw && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                <strong>Governing Statute:</strong> {corp.governingLaw} | <strong>Founded:</strong> {corp.founded}
              </div>
            )}
          </div>

          {/* 3. Interactive GIS Location Map Section */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.75rem', border: '1px solid var(--color-border)', boxShadow: '0 4px 14px rgba(11, 47, 69, 0.05)', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 800, margin: 0, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} style={{ color: 'var(--color-secondary)' }} />
                  <span>Headquarters GIS Map & Location</span>
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                  Interactive Google Map location for {corp.name} administrative headquarters.
                </p>
              </div>

              <a 
                href={externalMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light"
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', padding: '0.45rem 1.15rem', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Navigation size={15} />
                <span>Get Directions on Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Embedded Google Map iframe */}
            <div style={{ borderRadius: '10px', overflow: 'hidden', height: '360px', border: '1px solid #cbd5e1', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)' }}>
              <iframe 
                title={`${corp.name} Location Map`}
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={mapEmbedUrl}
                style={{ border: 0, filter: 'contrast(1.05)' }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>

            <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '0.85rem 1.15rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
              <span><strong>HQ Address:</strong> {corp.headquarters}</span>
            </div>
          </div>

          {/* 4. Headquarters & Leadership Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            
            {/* Control Room & Contacts */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 14px rgba(11, 47, 69, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} style={{ color: 'var(--color-secondary)' }} />
                <span>Contact & Helpline Numbers</span>
              </h3>
              
              <div style={{ background: '#f8fafc', padding: '1.15rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', fontWeight: 700, margin: 0, lineHeight: '1.5' }}>
                  {corp.headquarters}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={15} style={{ color: 'var(--color-secondary)' }} />
                  <span><strong>Central Control Room:</strong> {corp.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={15} style={{ color: 'var(--color-secondary)' }} />
                  <span><strong>Official Email:</strong> {corp.email}</span>
                </div>
                {corp.officialPortal && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ExternalLink size={15} style={{ color: 'var(--color-secondary)' }} />
                    <span><strong>Official Web Portal:</strong> <a href={`https://${corp.officialPortal}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>{corp.officialPortal}</a></span>
                  </div>
                )}
                {corp.phoneInProgramme && (
                  <div style={{ marginTop: '0.5rem', background: '#e0f2fe', color: '#0369a1', padding: '0.75rem 0.9rem', borderRadius: '6px', fontSize: '0.825rem', fontWeight: 700, border: '1px solid #bae6fd' }}>
                    📞 <strong>Weekly Citizen Phone-in:</strong> {corp.phoneInProgramme}
                  </div>
                )}
              </div>
            </div>

            {/* Leadership Executive Officers */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 14px rgba(11, 47, 69, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} style={{ color: 'var(--color-secondary)' }} />
                <span>Executive Leadership</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                {corp.administrator && (
                  <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Administrator / GBA Chief Commissioner</span>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.15rem' }}>{corp.administrator}</div>
                  </div>
                )}

                {corp.municipalCommissioner && (
                  <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Municipal Commissioner</span>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.15rem' }}>{corp.municipalCommissioner}</div>
                  </div>
                )}

                {corp.mayorStatus && (
                  <div style={{ background: '#fffbeb', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>Mayor / Deputy Mayor / Opposition</span>
                    <div style={{ fontWeight: 700, color: '#92400e', marginTop: '0.15rem' }}>{corp.mayorStatus}</div>
                  </div>
                )}
              </div>

              {corp.votingSystem && (
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Vote size={14} style={{ color: 'var(--color-secondary)' }} />
                  <span>Voting System: <strong>{corp.votingSystem}</strong> (Next Election: <strong>{corp.nextElection}</strong>)</span>
                </div>
              )}
            </div>

          </div>

          {/* 5. Neighborhoods & Localities Tags */}
          {corp.localities && (
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={18} style={{ color: 'var(--color-secondary)' }} />
                <span>Confirmed Localities & Neighborhoods ({corp.localities.length})</span>
              </h3>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {corp.localities.map((loc, idx) => (
                  <span 
                    key={idx}
                    style={{ background: '#f1f5f9', color: 'var(--color-primary)', border: '1px solid #cbd5e1', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    📍 {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. Notable Landmarks */}
          {corp.landmarks && (
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Landmark size={18} style={{ color: 'var(--color-secondary)' }} />
                <span>Notable Landmarks in {corp.shortCode} Jurisdiction</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {corp.landmarks.map((landmark, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={15} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                    <span>{landmark}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Recent Civic Activities & Updates */}
          {corp.recentActivities && (
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Newspaper size={18} style={{ color: 'var(--color-secondary)' }} />
                <span>Recent Civic Activity & Updates</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {corp.recentActivities.map((act, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '1.15rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' }}>{act.title}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={13} /> {act.date}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', margin: 0, lineHeight: '1.5' }}>
                      {act.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Action Button to Services */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button 
              onClick={() => onNavigate('/services')}
              className="btn btn-primary"
              style={{ fontSize: '0.95rem', padding: '0.8rem 2rem' }}
            >
              Access Zonal Citizen Services & E-Khata Portal
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};

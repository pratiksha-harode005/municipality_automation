import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PersonCard } from '../components/PersonCard';
import { Phone, Mail, MapPin, Building, Send, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const PersonDetailPage = ({ slug, onNavigate }) => {
  const { data, submitContactMessage } = useMunicipalData();
  const [msgSubject, setMsgSubject] = useState('');
  const [msgText, setMsgText] = useState('');
  const [senderEmail, setSenderEmail] = useState('');

  const person = data.people.find(p => p.slug === slug) || data.people[0];
  const related = data.people.filter(p => p.id !== person.id).slice(0, 3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msgText.trim()) {
      submitContactMessage({
        name: `Citizen Inquiry to ${person.name}`,
        email: senderEmail || 'citizen@example.com',
        subject: `Direct Inquiry: ${msgSubject || person.position}`,
        message: msgText
      });
      setMsgSubject('');
      setMsgText('');
      setSenderEmail('');
    }
  };

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb 
            items={[
              { label: 'Elected Officials & Directors', path: '/people' },
              { label: person.name }
            ]} 
            onNavigate={onNavigate} 
          />
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
            {person.department}
          </span>
          <h1 className="page-hero-title" style={{ marginTop: '0.5rem' }}>{person.name}</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>{person.position}</p>
        </div>
      </div>

      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
          <div>
            <div style={{ borderRadius: '8px', overflow: 'hidden', height: '360px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
              <img src={person.portrait} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ background: 'var(--color-bg-body)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.4rem' }}>
                Direct Office Contact
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <Phone size={16} style={{ color: 'var(--color-secondary)' }} />
                  <span>{person.phone}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <Mail size={16} style={{ color: 'var(--color-secondary)' }} />
                  <span>{person.email}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <Building size={16} style={{ color: 'var(--color-secondary)', marginTop: '2px' }} />
                  <span>Office: Greenfield City Hall Plaza, Suite 200</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Biography & Leadership Overview
            </h2>
            <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
              {person.bio}
            </p>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
              Core Official Responsibilities
            </h3>
            <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)', fontSize: '1rem', marginBottom: '2.5rem', background: 'var(--color-bg-body)', padding: '1.25rem', borderRadius: '6px', borderLeft: '4px solid var(--color-secondary)' }}>
              {person.responsibilities}
            </p>

            {/* Direct Message Form */}
            <div style={{ background: 'var(--color-bg-body)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                Send Direct Inquiry to {person.name}
              </h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--color-primary)' }}>Your Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="name@domain.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--color-primary)' }}>Subject / Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Constituent Question"
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--color-primary)' }}>Message</label>
                  <textarea 
                    rows={4} 
                    required 
                    placeholder="Type your message to the official..."
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Send size={16} />
                  <span>Submit Message to Office</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Related Officials */}
      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">
          <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
            Other Municipal Officials
          </h3>
          <div className="officials-grid">
            {related.map(item => (
              <PersonCard key={item.id} person={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

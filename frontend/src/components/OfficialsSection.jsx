import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { PersonCard } from './PersonCard';

export const OfficialsSection = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const officials = data.people.slice(0, 4);

  return (
    <section className="officials-section">
      <div className="container">
        <div className="section-title-wrap">
          <h2 className="section-title">Meet Our Officials</h2>
          <p className="section-subtitle">
            Dedicated civic leadership working together for local progress, community wellbeing, and public accountability.
          </p>
        </div>

        <div className="officials-grid">
          {officials.map((person) => (
            <PersonCard key={person.id} person={person} onNavigate={onNavigate} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a 
            href="/people" 
            onClick={(e) => { e.preventDefault(); onNavigate('/people'); }}
            className="btn btn-primary"
          >
            <span>View All Elected Officials & Department Directors</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

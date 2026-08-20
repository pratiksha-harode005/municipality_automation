import React from 'react';
import { Mail, Phone, ArrowRight } from 'lucide-react';

export const PersonCard = ({ person, onNavigate }) => {
  return (
    <div className="official-card">
      <div className="official-img-wrap">
        <img src={person.portrait} alt={person.name} loading="lazy" />
      </div>
      
      <div className="official-info">
        <h3 className="official-name">{person.name}</h3>
        <div className="official-role">{person.position}</div>
        <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Department: <strong>{person.department}</strong>
        </p>

        <a 
          href={`/people/${person.slug}`} 
          onClick={(e) => { e.preventDefault(); onNavigate(`/people/${person.slug}`); }}
          className="btn btn-outline-light"
          style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', width: '100%', fontSize: '0.85rem' }}
        >
          <span>View Profile & Contact</span>
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
};

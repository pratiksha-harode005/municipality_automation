import React from 'react';
import { PhoneCall, Search } from 'lucide-react';

export const CTASection = ({ onNavigate }) => {
  return (
    <section className="cta-section">
      <div className="container cta-content">
        <h2 className="cta-title">Have a Question or Need Assistance?</h2>
        <p className="cta-text">
          Our municipal administration team is here to assist citizens with public records, permit applications, utility inquiries, and emergency reporting.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/contact" 
            onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}
            className="btn btn-primary cta-btn-primary"
          >
            <PhoneCall size={18} />
            <span>Contact Municipal Office</span>
          </a>

          <a 
            href="/services" 
            onClick={(e) => { e.preventDefault(); onNavigate('/services'); }}
            className="btn btn-outline-light cta-btn-secondary"
          >
            <Search size={18} />
            <span>Find a Service or Department</span>
          </a>
        </div>
      </div>
    </section>
  );
};

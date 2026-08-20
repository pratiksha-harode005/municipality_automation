import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { DocumentCard } from './DocumentCard';

export const DocumentsSection = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const recentDocs = data.documents.slice(0, 4);

  return (
    <section className="documents-section">
      <div className="container">
        <div className="section-title-wrap">
          <h2 className="section-title">Latest Documents</h2>
          <p className="section-subtitle">
            Access official municipal budget publications, Town Council meeting minutes, urban master plans, and license handbooks.
          </p>
        </div>

        <div className="document-list">
          {recentDocs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onNavigate={onNavigate} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a 
            href="/documents" 
            onClick={(e) => { e.preventDefault(); onNavigate('/documents'); }}
            className="btn btn-primary"
          >
            <span>View All Public Documents Library</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

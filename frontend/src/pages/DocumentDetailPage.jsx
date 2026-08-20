import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { FileText, Download, Calendar, Building, ShieldCheck, ArrowLeft, Eye } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { downloadMunicipalDocument } from '../utils/documentDownloader';

export const DocumentDetailPage = ({ slug, onNavigate }) => {
  const { data, showToast } = useMunicipalData();

  const doc = data.documents.find(d => d.slug === slug) || data.documents[0];

  const handleDownload = () => {
    downloadMunicipalDocument(doc);
    showToast(`✅ Successfully downloaded: "${doc.title}" (${doc.fileSize || 'PDF'})`, 'success');
  };

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb 
            items={[
              { label: 'Public Documents', path: '/documents' },
              { label: doc.title }
            ]} 
            onNavigate={onNavigate} 
          />
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
            {doc.category}
          </span>
          <h1 className="page-hero-title" style={{ marginTop: '0.5rem' }}>{doc.title}</h1>
        </div>
      </div>

      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Document Summary & Scope
            </h2>
            <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
              {doc.summary}
            </p>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Interactive Document Preview
            </h3>

            {/* Embedded PDF mockup box */}
            <div style={{
              height: '400px',
              background: '#f1f5f9',
              borderRadius: '8px',
              border: '2px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <FileText size={56} style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {doc.title}
              </h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
                Official Municipal Record Document Format: PDF. Click below to view in full resolution or download.
              </p>
              <button 
                onClick={handleDownload}
                className="btn btn-primary"
              >
                <Download size={18} />
                <span>Download PDF File ({doc.fileSize})</span>
              </button>
            </div>
          </div>

          <div>
            <div style={{ background: 'var(--color-bg-body)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '1.25rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                Document Metadata
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ color: 'var(--color-primary)', display: 'block' }}>Publishing Department</strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>{doc.department}</span>
                </div>

                <div>
                  <strong style={{ color: 'var(--color-primary)', display: 'block' }}>Filing Date</strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>{doc.date}</span>
                </div>

                <div>
                  <strong style={{ color: 'var(--color-primary)', display: 'block' }}>File Format</strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>{doc.fileType} (Portable Document Format)</span>
                </div>

                <div>
                  <strong style={{ color: 'var(--color-primary)', display: 'block' }}>File Size</strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>{doc.fileSize}</span>
                </div>

                <div>
                  <strong style={{ color: 'var(--color-primary)', display: 'block' }}>Public Access Level</strong>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Unrestricted Public Domain Record</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button 
                  onClick={handleDownload}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Download size={18} />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { FileText, Download, Calendar, ExternalLink } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { downloadMunicipalDocument } from '../utils/documentDownloader';

export const DocumentCard = ({ doc, onNavigate }) => {
  const { showToast } = useMunicipalData();

  const handleDownload = (e) => {
    e.preventDefault();
    downloadMunicipalDocument(doc);
    showToast(`✅ Successfully downloaded: "${doc.title}"`, 'success');
  };

  return (
    <div className="document-row">
      <div className="doc-info">
        <div className="doc-icon">
          <FileText size={22} />
        </div>
        <div>
          <a 
            href={`/documents/${doc.slug}`} 
            onClick={(e) => { e.preventDefault(); onNavigate(`/documents/${doc.slug}`); }}
            className="doc-title"
          >
            {doc.title}
          </a>
          <div className="doc-meta">
            <span>Category: <strong>{doc.category}</strong></span>
            <span>Department: <strong>{doc.department}</strong></span>
            <span>Date: <strong>{doc.date}</strong></span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', background: '#e2e8f0', color: '#4a5568', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
          {doc.fileType || 'PDF'} • {doc.fileSize || '2 MB'}
        </span>
        <button 
          onClick={handleDownload}
          className="btn btn-primary"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          title={`Download ${doc.title}`}
        >
          <Download size={14} />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

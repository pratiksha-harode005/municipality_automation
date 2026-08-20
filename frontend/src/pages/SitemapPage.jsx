import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SitemapSection } from '../components/SitemapSection';

export const SitemapPage = ({ onNavigate }) => {
  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Visual Sitemap' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Greenfield Visual Directory & Sitemap</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px' }}>
            Structured overview of all portal pages, public service links, government departments, and community resources.
          </p>
        </div>
      </div>

      <SitemapSection onNavigate={onNavigate} />
    </div>
  );
};

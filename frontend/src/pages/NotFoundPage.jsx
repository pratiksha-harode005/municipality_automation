import React from 'react';
import { Home, Search, AlertCircle } from 'lucide-react';

export const NotFoundPage = ({ onNavigate }) => {
  return (
    <div id="main-content" style={{ padding: '6rem 0', background: 'var(--color-bg-body)', minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlignment: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: '#fff5f5',
          color: '#c53030',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <AlertCircle size={44} />
        </div>

        <h1 style={{ fontSize: '4rem', fontFamily: 'serif', color: 'var(--color-primary)', margin: 0, lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', margin: '0.5rem 0 1rem' }}>Page Not Found</h2>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
          The municipal portal page you are looking for may have been moved, renamed, or no longer exists.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
            className="btn btn-primary"
          >
            <Home size={18} />
            <span>Return to Homepage</span>
          </a>

          <a 
            href="/search" 
            onClick={(e) => { e.preventDefault(); onNavigate('/search'); }}
            className="btn btn-outline-light"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
          >
            <Search size={18} />
            <span>Search Website</span>
          </a>
        </div>
      </div>
    </div>
  );
};

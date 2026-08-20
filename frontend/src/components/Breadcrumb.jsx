import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

export const Breadcrumb = ({ items = [], onNavigate }) => {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else if (items && items.length > 0 && items[0].path) {
      onNavigate(items[0].path);
    } else if (onNavigate) {
      onNavigate('/');
    }
  };

  return (
    <div className="breadcrumb-nav-container">
      <button 
        type="button" 
        className="back-nav-btn"
        onClick={handleBack}
        title="Go back to previous page"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <span className="breadcrumb-nav-divider" aria-hidden="true">|</span>

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('/'); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <Home size={13} />
          <span>Home</span>
        </a>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight size={14} style={{ opacity: 0.6 }} />
              {isLast ? (
                <span className="breadcrumb-last">{item.label}</span>
              ) : (
                <a 
                  href={item.path} 
                  onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(item.path); }}
                >
                  {item.label}
                </a>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

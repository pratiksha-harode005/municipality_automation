import React from 'react';
import { CreditCard, FileCheck, AlertTriangle, Wrench, Folder, Trees, Heart, Bus, ArrowRight } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

const serviceImages = {
  'pay-taxes':            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80',
  'permits-licenses':     'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&q=80',
  'report-issue':         'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80',
  'public-works':         'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=700&q=80',
  'government-documents': 'https://images.unsplash.com/photo-1568234928966-359c35dd8327?w=700&q=80',
  'parks-recreation':     'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=700&q=80',
  'health-services':      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80',
  'transport-roads':      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&q=80',
};

export const QuickServicesSection = ({ onNavigate }) => {
  const { data } = useMunicipalData();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'CreditCard':    return <CreditCard size={20} />;
      case 'FileCheck':     return <FileCheck size={20} />;
      case 'AlertTriangle': return <AlertTriangle size={20} />;
      case 'Wrench':        return <Wrench size={20} />;
      case 'Folder':        return <Folder size={20} />;
      case 'Trees':         return <Trees size={20} />;
      case 'Heart':         return <Heart size={20} />;
      case 'Bus':           return <Bus size={20} />;
      default:              return <FileCheck size={20} />;
    }
  };

  return (
    <section className="quick-services-section">
      <div className="container">
        <div className="services-grid">
          {data.services.map((item, index) => (
            <a
              key={item.id}
              href={item.link}
              className="service-card"
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={(e) => { e.preventDefault(); onNavigate(item.link); }}
            >
              {/* Full background image */}
              <img
                src={serviceImages[item.slug]}
                alt={item.title}
                className="service-card-bg"
                loading="lazy"
              />

              {/* Dark gradient overlay */}
              <div className="service-card-overlay" />

              {/* Light blue hover tint */}
              <div className="service-card-hover-tint" />

              {/* Category chip top-left */}
              <span className="service-card-chip">
                {getIcon(item.icon)}
                {item.category}
              </span>

              {/* Text at bottom */}
              <div className="service-card-info">
                <h3 className="service-card-title">{item.title}</h3>
                <span className="service-card-cta">
                  Access Service <ArrowRight size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

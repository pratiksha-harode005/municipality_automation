import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText, PhoneCall, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const Hero = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const defaultHeroSlides = [
    {
      id: 'slide-1',
      url: '/bbmp-council-building.png',
      title: 'BBMP Central Council Building',
      location: 'Hudson Circle, Central Bengaluru'
    },
    {
      id: 'slide-2',
      url: '/bbmp-head-office.png',
      title: 'BBMP Head Office Secretariat',
      location: 'Hudson Circle / N.R. Square, Bengaluru'
    },
    {
      id: 'slide-3',
      url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1920&q=80',
      title: 'Vidhana Soudha Secretariat',
      location: 'Dr. Ambedkar Veedhi'
    },
    {
      id: 'slide-4',
      url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=80',
      title: 'Bengaluru Town Hall',
      location: 'Hudson Circle'
    },
    {
      id: 'slide-5',
      url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1920&q=80',
      title: 'Cubbon Park Canopy',
      location: 'Kasturba Road'
    }
  ];

  const heroSlides = (data && data.heroSlides && data.heroSlides.length > 0) ? data.heroSlides : defaultHeroSlides;

  // Auto-rotate background image every 5 seconds (5000ms)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [heroSlides.length]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(heroSearchQuery.trim())}`);
    }
  };

  const quickTags = [
    { label: 'Pay SAS e-Khata Tax', path: '/services#taxes' },
    { label: 'Trade Licenses', path: '/services#permits' },
    { label: 'FixMyCity Pothole', path: '/services#report' },
    { label: 'Cubbon Park Booking', path: '/services#parks' }
  ];

  return (
    <>
      {/* 1. Hero Main Image Banner with Auto-Rotating Background Slider */}
      <section className="hero-section">
        {/* Animated Auto-Rotating Slideshow Layers */}
        <div className="hero-slides-wrapper">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`hero-slide-layer ${idx === currentSlideIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url('${slide.url}')` }}
            />
          ))}
        </div>

        {/* Dark Gradient Overlay */}
        <div className="hero-overlay"></div>

        {/* Hero Content Box */}
        <div className="container hero-content">
          
          {/* Live Operational Status Pill */}
          <div className="hero-live-badge">
            <span className="live-pulse-dot"></span>
            <span className="live-badge-text">
              <CheckCircle2 size={13} className="text-emerald" /> BBMP Namma Bengaluru Civic Services Active & Operational
            </span>
          </div>

          <h1 className="hero-title">
            Bruhat Bengaluru<br />
            <span className="hero-title-highlight">Mahanagara Palike (BBMP)</span>
          </h1>
          
          <p className="hero-description">
            {data.info.tagline} Access municipal property tax SAS e-Khata services, trade licenses, BBMP ward engineering, Namma Clinics, and lake conservation projects.
          </p>

          {/* High-Impact Visible Action Buttons */}
          <div className="hero-actions">
            <a 
              href="/services" 
              onClick={(e) => { e.preventDefault(); onNavigate('/services'); }}
              className="btn btn-primary btn-shine hero-btn-main"
            >
              <span>Explore BBMP Services</span>
              <ArrowRight size={18} />
            </a>
            
            <a 
              href="/contact" 
              onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}
              className="btn btn-outline-light hero-btn-secondary"
            >
              <PhoneCall size={18} />
              <span>Contact BBMP Control Room</span>
            </a>

            <a 
              href="/documents" 
              onClick={(e) => { e.preventDefault(); onNavigate('/documents'); }}
              className="btn btn-dark hero-btn-dark"
            >
              <FileText size={18} />
              <span>Public Documents</span>
            </a>
          </div>
        </div>

        {/* Slide Controls & Landmark Indicator Badge */}
        <div className="hero-slide-controls">
          <div className="hero-slide-caption">
            <span className="slide-landmark-name">📍 {heroSlides[currentSlideIndex].title}</span>
            <span className="slide-landmark-sub">{heroSlides[currentSlideIndex].location}</span>
          </div>

          <div className="hero-slide-dots">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`hero-dot ${idx === currentSlideIndex ? 'active' : ''}`}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Search Bar Placed Below Hero Image Banner */}
      <div className="hero-floating-search-section">
        <div className="container">
          <div className="hero-floating-search-card">
            <form onSubmit={handleSearchSubmit} className="hero-floating-search-form">
              <div className="hero-search-group">
                <Search size={22} className="hero-search-group-icon" />
                <input 
                  type="text" 
                  placeholder="Search BBMP e-Khata, property tax, ward services, or Namma Clinics..."
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  className="hero-search-group-input"
                />
                <button type="submit" className="hero-search-group-btn">
                  <span>Search Services</span>
                  <ArrowRight size={17} />
                </button>
              </div>
              
              {/* Quick Filter Tags Below Search Bar */}
              <div className="hero-floating-tags">
                <span className="floating-tags-label"><Sparkles size={13} /> Popular Searches:</span>
                {quickTags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="floating-tag-chip"
                    onClick={() => onNavigate(tag.path)}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

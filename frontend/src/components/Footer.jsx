import React from 'react';
import { Building2, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const Footer = ({ onNavigate }) => {
  const { data } = useMunicipalData();

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-top">
          
          {/* Column 1: Brand & Tagline */}
          <div className="footer-col brand-col">
            <div className="footer-brand-header">
              <div className="footer-brand-emblem">
                <Building2 size={24} />
              </div>
              <div className="footer-brand-titles">
                <h4 className="footer-brand-name">{data.info.name}</h4>
                <span className="footer-brand-badge">OFFICIAL GOVERNMENT PORTAL</span>
              </div>
            </div>

            <p className="footer-brand-desc">
              {data.info.tagline}
            </p>

            <div className="footer-social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('/about'); }}>About BBMP Bengaluru</a></li>
              <li><a href="/people" onClick={(e) => { e.preventDefault(); onNavigate('/people'); }}>Government & Officials</a></li>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); onNavigate('/services'); }}>Citizen Services</a></li>
              <li><a href="/directory" onClick={(e) => { e.preventDefault(); onNavigate('/directory'); }}>Municipal Directory</a></li>
              <li><a href="/events" onClick={(e) => { e.preventDefault(); onNavigate('/events'); }}>Upcoming Events</a></li>
              <li><a href="/admin" onClick={(e) => { e.preventDefault(); onNavigate('/admin'); }}>Admin & CMS Portal</a></li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="footer-col">
            <h4 className="footer-col-title">Information</h4>
            <ul className="footer-links">
              <li><a href="/news" onClick={(e) => { e.preventDefault(); onNavigate('/news'); }}>Latest News</a></li>
              <li><a href="/notices" onClick={(e) => { e.preventDefault(); onNavigate('/notices'); }}>Important Notices</a></li>
              <li><a href="/documents" onClick={(e) => { e.preventDefault(); onNavigate('/documents'); }}>Public Documents & Budget</a></li>
              <li><a href="/galleries" onClick={(e) => { e.preventDefault(); onNavigate('/galleries'); }}>Photo Galleries</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}>Contact Municipal Office</a></li>
              <li><a href="/sitemap" onClick={(e) => { e.preventDefault(); onNavigate('/sitemap'); }}>Visual Site Map</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact Info</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin size={18} className="contact-item-icon" />
                <span className="contact-item-text">{data.info.address}</span>
              </li>
              <li className="footer-contact-item">
                <Phone size={18} className="contact-item-icon" />
                <div className="contact-item-text-stack">
                  <span>(080) 2297 5555</span>
                  <span>(080) 2266 0000</span>
                </div>
              </li>
              <li className="footer-contact-item">
                <Mail size={18} className="contact-item-icon" />
                <div className="contact-item-text-stack">
                  <span>contact@bbmp.gov.in</span>
                  <span>commissioner@bbmp.gov.in</span>
                </div>
              </li>
              <li className="footer-contact-item">
                <Clock size={18} className="contact-item-icon" />
                <span className="contact-item-text">{data.info.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            Copyright © 2026 {data.info.name}. All Rights Reserved. Government of Karnataka.
          </div>
          <div className="footer-nav">
            <a href="/privacy" onClick={(e) => { e.preventDefault(); alert("BBMP Privacy Policy: Citizen data is protected under municipal privacy laws."); }}>Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); alert("Terms of Use: Official public portal of BBMP Municipal."); }}>Terms of Service</a>
            <a href="/accessibility" onClick={(e) => { e.preventDefault(); alert("Accessibility Statement: BBMP portal is WCAG 2.1 AA compliant."); }}>Accessibility</a>
            <a href="/sitemap" onClick={(e) => { e.preventDefault(); onNavigate('/sitemap'); }}>Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { Phone, Mail, AlertCircle, Eye, Search, Globe, ShieldAlert, X, Clock, Sun } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const TopBar = ({ onSearchClick }) => {
  const { data } = useMunicipalData();
  const [showAlert, setShowAlert] = useState(true);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="top-bar">
      <div className="container top-bar-inner">
        <div className="top-bar-info">
          <div className="top-bar-item">
            <Phone size={13} />
            <span>{data.info.phone}</span>
          </div>
          <div className="top-bar-item">
            <Mail size={13} />
            <span>{data.info.email}</span>
          </div>
          <div className="top-bar-item highlight">
            <ShieldAlert size={13} style={{ color: '#f59e0b' }} />
            <span>Emergency: <strong>{data.info.emergencyPhone}</strong></span>
          </div>
          {timeString && (
            <div className="top-bar-item time-widget" title="Local Greenfield Municipal Time">
              <Clock size={13} className="spin-slow" />
              <span className="monospace">{timeString}</span>
            </div>
          )}
          <div className="top-bar-item weather-widget">
            <Sun size={13} style={{ color: '#fcd34d' }} />
            <span>72°F Sunny</span>
          </div>
        </div>

        {showAlert && data.info.alertMessage && (
          <div className="top-bar-alert">
            <AlertCircle size={14} className="pulse-icon" />
            <span>{data.info.alertMessage}</span>
            <button 
              onClick={() => setShowAlert(false)} 
              className="alert-dismiss-btn"
              title="Dismiss alert"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="top-bar-actions">
          <button className="top-bar-btn search-trigger" onClick={onSearchClick} title="Quick Search">
            <Search size={13} />
            <span>Search</span>
          </button>
          <a href="/about#accessibility" className="top-bar-btn" title="Accessibility Options">
            <Eye size={13} />
            <span>Accessibility</span>
          </a>
          <div className="top-bar-item lang-selector" style={{ fontSize: '0.8rem' }}>
            <Globe size={13} />
            <span>EN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { EventCard } from './EventCard';

export const EventsSection = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const [activeTab, setActiveTab] = useState('All');

  const filterTabs = ['All', 'Environment', 'Government', 'Culture & Arts'];

  const allEvents = data.events || [];
  
  const filteredEvents = allEvents.filter(evt => {
    if (activeTab === 'All') return true;
    return evt.category === activeTab;
  }).slice(0, 4);

  return (
    <section className="events-section">
      <div className="container">
        {/* Section Header with vertical column alignment */}
        <div className="events-header">
          <div className="evt-title-container">
            <span className="section-badge-pill">
              <Calendar size={13} /> Community Calendar
            </span>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">
              There's always something happening in our community. Join public hearings, park cleanup drives, and community festivals.
            </p>

            {/* Interactive Category Filter Tabs */}
            <div className="events-filter-tabs">
              {filterTabs.map((tab, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`evt-filter-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {filteredEvents.map((evt, index) => (
            <EventCard key={evt.id} event={evt} onNavigate={onNavigate} index={index} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="events-empty-state">
            <p>No upcoming events listed under "{activeTab}" category.</p>
          </div>
        )}

        {/* Bottom CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a 
            href="/events" 
            onClick={(e) => { e.preventDefault(); onNavigate('/events'); }}
            className="btn btn-dark btn-shine"
          >
            <span>Browse Full Community Events Calendar</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

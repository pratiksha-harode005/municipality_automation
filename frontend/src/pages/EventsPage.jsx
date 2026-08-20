import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { EventCard } from '../components/EventCard';
import { Search, Calendar, Filter } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const EventsPage = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Culture & Arts', 'Environment', 'Government', 'Public Works'];

  const eventsList = data.events || [];
  const filteredEvents = eventsList.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          evt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Upcoming Events' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Community Events Calendar</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px' }}>
            Discover upcoming public town hall hearings, green clean-up days, heritage arts festivals, and recycling drives in Greenfield.
          </p>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">
          {/* Filters */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            marginBottom: '2rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search event title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.25rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} style={{ color: 'var(--color-secondary)' }} />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white' }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="events-grid">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onNavigate={onNavigate} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div style={{ textAlignment: 'center', padding: '3rem', background: 'white', borderRadius: '8px' }}>
              <Calendar size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
              <h3>No Events Found</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>No scheduled community events match your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

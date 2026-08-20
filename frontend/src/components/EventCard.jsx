import React, { useState } from 'react';
import { MapPin, Clock, ArrowRight, Calendar, Tag, ShieldCheck, Bookmark, Check } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const EventCard = ({ event, onNavigate, index = 0 }) => {
  const { showToast } = useMunicipalData();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Helper to parse date string like "Aug 29, 2026" or explicit month/day/year
  const parseDate = (dateStr, evtMonth, evtDay, evtYear) => {
    if (evtMonth && evtDay) {
      return {
        month: String(evtMonth).toUpperCase(),
        day: String(evtDay).replace(',', ''),
        year: evtYear || '2026'
      };
    }
    if (!dateStr) return { month: 'AUG', day: '25', year: '2026' };
    const parts = dateStr.split(' ');
    if (parts.length >= 2) {
      return {
        month: parts[0].toUpperCase(),
        day: parts[1].replace(',', ''),
        year: parts[2] || '2026'
      };
    }
    return { month: 'AUG', day: '25', year: '2026' };
  };

  const { month, day, year } = parseDate(event.date, event.month, event.day, event.year);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Culture & Arts': return { bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' };
      case 'Environment': return { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' };
      case 'Government': return { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' };
      case 'Public Works': return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
      default: return { bg: '#f0fdfa', color: '#0f766e', border: '#ccfbf1' };
    }
  };

  const catStyle = getCategoryColor(event.category);

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      showToast(`Added "${event.title}" to your saved calendar events!`);
    } else {
      showToast(`Removed from saved events.`, 'info');
    }
  };

  return (
    <article 
      style={{
        background: 'white',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer'
      }}
      onClick={() => onNavigate(`/events/${event.slug}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
      }}
    >
      {/* Top Image Container */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden', background: '#0f172a' }}>
        <img 
          src={event.image} 
          alt={event.title} 
          loading="lazy" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 60%)' }} />

        {/* Date Badge (Top Left) */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '10px',
          padding: '0.4rem 0.85rem',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
          <span style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#008b95', letterSpacing: '0.5px' }}>
            {month}
          </span>
          <span style={{ display: 'block', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
            {day}
          </span>
        </div>

        {/* Category Badge (Top Right) */}
        {event.category && (
          <span style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: catStyle.bg,
            color: catStyle.color,
            border: `1px solid ${catStyle.border}`,
            padding: '0.35rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.775rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Tag size={12} /> {event.category}
          </span>
        )}

        {/* Bookmark / Save Button (Bottom Right of Image) */}
        <button
          onClick={handleBookmark}
          title={isBookmarked ? "Saved to Calendar" : "Save Event"}
          style={{
            position: 'absolute',
            bottom: '0.85rem',
            right: '0.85rem',
            background: isBookmarked ? '#008b95' : 'rgba(255, 255, 255, 0.9)',
            color: isBookmarked ? 'white' : '#0f172a',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease'
          }}
        >
          {isBookmarked ? <Check size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Title */}
        <h3 style={{ 
          fontSize: '1.2rem', 
          color: '#0f172a', 
          fontFamily: 'var(--font-serif)', 
          margin: '0 0 1rem 0', 
          fontWeight: 700,
          lineHeight: '1.4'
        }}>
          {event.title}
        </h3>

        {/* Meta Info Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#64748b' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} style={{ color: '#008b95', flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: '#334155' }}>{event.date || `${month} ${day}, ${year}`}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={15} style={{ color: '#008b95', flexShrink: 0 }} />
            <span>{event.time || '10:00 AM – 4:00 PM'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <MapPin size={15} style={{ color: '#008b95', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {event.location}
            </span>
          </div>
        </div>

        {/* Description Summary */}
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#64748b', 
          lineHeight: '1.5', 
          margin: '0 0 1.5rem 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {event.summary || event.description}
        </p>

        {/* Action Button Footer */}
        <div style={{ 
          borderTop: '1px solid #f1f5f9', 
          paddingTop: '1rem', 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center' 
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>
            {event.organizer ? event.organizer.substring(0, 24) + '...' : 'Municipal Board'}
          </span>

          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            fontSize: '0.875rem', 
            fontWeight: 700, 
            color: '#008b95' 
          }}>
            View Details <ArrowRight size={15} />
          </span>
        </div>

      </div>
    </article>
  );
};

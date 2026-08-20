import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { InteractiveMap } from '../components/InteractiveMap';
import { EventCard } from '../components/EventCard';
import { 
  Calendar, Clock, MapPin, Share2, CheckCircle2, AlertCircle, 
  Building2, Users, Target, Award, Info, Phone, Mail, Compass, 
  ShieldCheck, Check, HelpCircle, FileText, ChevronDown, Download
} from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { getGoogleCalendarUrl, downloadIcsFile, getOutlookCalendarUrl } from '../utils/calendarHelper';

export const EventDetailPage = ({ slug, onNavigate }) => {
  const { data, showToast } = useMunicipalData();
  const [rsvped, setRsvped] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const event = data.events.find(e => e.slug === slug) || data.events[0];
  const related = data.events.filter(e => e.id !== event.id).slice(0, 2);

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

  const handleRSVP = () => {
    setRsvped(true);
    showToast(`RSVP Confirmed! You are registered for "${event.title}".`);
  };

  const defaultAgenda = [
    { time: "09:30 AM – 10:00 AM", title: "Citizen Registration & Welcome Desk", detail: "Arrival, formal citizen registration, and distribution of event briefing materials." },
    { time: "10:00 AM – 11:30 AM", title: "Keynote Address & Departmental Review", detail: "Official briefing by the presiding host authority on project objectives and milestones." },
    { time: "11:30 AM – 12:30 PM", title: "Interactive Public Discussion & Q&A", detail: "Open floor for citizen feedback, petition submissions, and expert answers." },
    { time: "12:30 PM – 01:00 PM", title: "Resolution Adoption & Closing Remarks", detail: "Adoption of civic action plans and issuance of official participation certificates." }
  ];

  const defaultOutcomes = [
    "Direct interaction with presiding municipal officers and chief engineers",
    "On-spot submission and tracking of ward infrastructure petitions",
    "Official participation record registered with Greater Bengaluru Municipal Corporation",
    "Access to published civic reports, guidelines, and action blueprints"
  ];

  const eventAgenda = Array.isArray(event.agenda) && event.agenda.length > 0 ? event.agenda : defaultAgenda;
  const eventOutcomes = Array.isArray(event.keyOutcomes) && event.keyOutcomes.length > 0 ? event.keyOutcomes : defaultOutcomes;

  return (
    <div id="main-content">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <Breadcrumb 
            items={[
              { label: 'Upcoming Events', path: '/events' },
              { label: event.title }
            ]} 
            onNavigate={onNavigate} 
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
              {event.category || 'Government'}
            </span>
            <span style={{ background: '#16a34a', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} /> Official Government Event
            </span>
          </div>
          <h1 className="page-hero-title" style={{ marginTop: '0.75rem' }}>{event.title}</h1>
        </div>
      </div>

      {/* Main Content Details */}
      <section style={{ padding: '3.5rem 0', background: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          
          {/* Left Column: Details, Purpose, Agenda, Outcomes */}
          <div>
            {/* Event Photo */}
            <div style={{ height: '380px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <img 
                src={event.image} 
                alt={event.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80'; }} 
              />
            </div>

            {/* 1. WHY THIS EVENT IS HAPPENING (PURPOSE & OBJECTIVES) */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)', 
              border: '1px solid #99f6e4', 
              borderRadius: '12px', 
              padding: '1.75rem', 
              marginBottom: '2.25rem',
              boxShadow: '0 2px 12px rgba(0, 139, 149, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <Target size={22} style={{ color: '#008b95' }} />
                <h3 style={{ margin: 0, color: '#0b2f45', fontSize: '1.25rem', fontWeight: 800 }}>
                  Why This Event is Happening (Purpose & Civic Objectives)
                </h3>
              </div>
              <p style={{ lineHeight: '1.75', color: '#1e293b', fontSize: '1rem', margin: 0, fontWeight: 500 }}>
                {event.whyHappening || 'To uphold democratic municipal transparency, ensure public fiscal accountability, and provide all Bengaluru citizens and Resident Welfare Associations (RWAs) a statutory platform to participate in citywide infrastructure planning and submit petitions directly to municipal leadership.'}
              </p>
            </div>

            {/* 2. EVENT OVERVIEW & DESCRIPTION */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '0.85rem', fontWeight: 800 }}>
                Event Overview & Program Scope
              </h3>
              <p style={{ lineHeight: '1.8', color: 'var(--color-text-muted)', fontSize: '1.025rem', margin: 0 }}>
                {event.description || event.summary || event.excerpt}
              </p>
            </div>

            {/* 3. OFFICIAL PROGRAM AGENDA & TIMELINE */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Calendar size={22} style={{ color: '#008b95' }} />
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>
                  Official Event Agenda & Schedule
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '3px solid #008b95', paddingLeft: '1.25rem', marginLeft: '0.5rem' }}>
                {eventAgenda.map((item, idx) => (
                  <div key={idx} style={{ position: 'relative', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ position: 'absolute', left: '-1.7rem', top: '1.2rem', width: '12px', height: '12px', borderRadius: '50%', background: '#008b95', border: '2px solid white' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: '#008b95', fontSize: '0.875rem' }}>⏰ {item.time}</span>
                      <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>Stage {idx + 1}</span>
                    </div>
                    <h4 style={{ margin: '0 0 0.35rem 0', color: '#0b2f45', fontSize: '1rem', fontWeight: 700 }}>{item.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5' }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. TARGET AUDIENCE & WHO SHOULD ATTEND */}
            <div style={{ marginBottom: '2.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <Users size={20} style={{ color: '#008b95' }} />
                <h4 style={{ margin: 0, color: '#0b2f45', fontSize: '1.15rem', fontWeight: 800 }}>
                  Who Should Attend & Target Participants
                </h4>
              </div>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                {event.targetAudience || 'Open to all Bengaluru Ward Residents, Resident Welfare Associations (RWAs), Civic Engineers, Activists, Local Business Owners, Students, and Urban Planning Researchers.'}
              </p>
            </div>

            {/* 5. KEY CITIZEN OUTCOMES & BENEFITS */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Award size={22} style={{ color: '#16a34a' }} />
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>
                  Key Outcomes & Citizen Takeaways
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {eventOutcomes.map((outcome, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: '#f0fdf4', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 600, lineHeight: '1.4' }}>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. EVENT VENUE LOCATION & MAP */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <MapPin size={22} style={{ color: '#008b95' }} />
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>
                  Event Location & Venue Map
                </h3>
              </div>
              <InteractiveMap locations={[{ name: event.location, address: event.address || event.location }]} />
            </div>

          </div>

          {/* Right Column: Sticky Sidebar Card */}
          <div>
            <div style={{ background: 'var(--color-bg-body)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', position: 'sticky', top: '100px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              
              {/* Date Box */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--color-primary)', color: 'white', padding: '1rem 1.25rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'serif', lineHeight: '1', textAlign: 'center' }}>
                  {event.month || month}<br/><span style={{ fontSize: '2.1rem' }}>{event.day || day}</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>{event.year || year}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Official Public Schedule</div>
                </div>
              </div>

              {/* Schedule & Location Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Clock size={20} style={{ color: '#008b95', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Timing Schedule</strong>
                    <span style={{ fontSize: '0.925rem', color: '#334155', fontWeight: 600 }}>{event.time}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <MapPin size={20} style={{ color: '#008b95', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Venue Location</strong>
                    <span style={{ fontSize: '0.925rem', color: '#334155', fontWeight: 700 }}>{event.location}</span>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>{event.address}</span>
                  </div>
                </div>
              </div>

              {/* HOST / ORGANIZER INFORMATION CARD */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.15rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                  <Building2 size={16} style={{ color: '#008b95' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#008b95', textTransform: 'uppercase', letterSpacing: '0.5px' }}>HOSTED & ORGANIZED BY</span>
                </div>
                <h5 style={{ margin: '0 0 0.35rem 0', color: '#0b2f45', fontSize: '0.95rem', fontWeight: 800 }}>
                  {event.organizer || 'Chief Commissioner Secretariat & GBA Executive Council'}
                </h5>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                  {event.hostRole || 'Presiding Municipal Authority & City Council Secretariat'}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#475569', borderTop: '1px dashed #cbd5e1', paddingTop: '0.45rem' }}>
                  📞 {event.hostContact || 'Helpdesk: 1533 / 080-22660000'}
                </div>
              </div>

              {/* ENTRY & ADMISSION GUIDELINES */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <ShieldCheck size={15} style={{ color: '#16a34a' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>ENTRY GUIDELINES</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#166534', lineHeight: '1.4' }}>
                  {event.entryGuidelines || 'Free Public Entry for all citizens. Photo ID (Aadhaar / Voter Card) recommended for petition logging.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button 
                  onClick={handleRSVP} 
                  disabled={rsvped}
                  className={`btn ${rsvped ? 'btn-dark' : 'btn-primary'}`}
                  style={{ width: '100%', justifyContent: 'center', fontWeight: 800 }}
                >
                  {rsvped ? <CheckCircle2 size={18} /> : <Calendar size={18} />}
                  <span>{rsvped ? 'RSVP Registered (Confirmed)' : 'RSVP / Attend Event'}</span>
                </button>

                {/* Real Functional Add to Calendar Button & Menu */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                    className="btn btn-outline-light"
                    style={{ width: '100%', borderColor: '#008b95', color: '#008b95', justifyContent: 'center', fontWeight: 800, background: showCalendarMenu ? '#f0fdfa' : 'white' }}
                  >
                    <Calendar size={16} />
                    <span>Add to Calendar</span>
                    <ChevronDown size={14} style={{ transform: showCalendarMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  </button>

                  {/* Calendar Options Dropdown */}
                  {showCalendarMenu && (
                    <div style={{
                      position: 'absolute',
                      bottom: '105%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      padding: '0.5rem',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}>
                      <button
                        onClick={() => {
                          const url = getGoogleCalendarUrl(event);
                          window.open(url, '_blank', 'noopener,noreferrer');
                          showToast(`📅 Opening Google Calendar for "${event.title}"`, 'success');
                          setShowCalendarMenu(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#f8fafc',
                          color: '#0b2f45',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e0f2fe'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>📅</span>
                        <span>Google Calendar</span>
                      </button>

                      <button
                        onClick={() => {
                          downloadIcsFile(event);
                          showToast(`✅ Downloaded "${event.title}.ics" calendar file!`, 'success');
                          setShowCalendarMenu(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#f8fafc',
                          color: '#0b2f45',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e0f2fe'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>🍏</span>
                        <span>Apple / Outlook (.ics File)</span>
                      </button>

                      <button
                        onClick={() => {
                          const url = getOutlookCalendarUrl(event);
                          window.open(url, '_blank', 'noopener,noreferrer');
                          showToast(`📧 Opening Outlook Web Calendar for "${event.title}"`, 'success');
                          setShowCalendarMenu(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#f8fafc',
                          color: '#0b2f45',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e0f2fe'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>📨</span>
                        <span>Outlook Web</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">
          <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem', fontWeight: 800 }}>
            Other Upcoming Municipal Events
          </h3>
          <div className="events-grid">
            {related.map(item => (
              <EventCard key={item.id} event={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Search, FileText, Calendar, Newspaper, Bell, Building, Users, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const SearchPage = ({ initialQuery = '', onNavigate }) => {
  const { data } = useMunicipalData();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const q = query.toLowerCase().trim();

  const results = {
    services: q ? (data.services || []).filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) : [],
    news: q ? data.news.filter(n => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)) : [],
    events: q ? data.events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)) : [],
    directory: q ? data.directory.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)) : [],
    documents: q ? data.documents.filter(doc => doc.title.toLowerCase().includes(q) || doc.summary.toLowerCase().includes(q)) : [],
    notices: q ? data.notices.filter(not => not.title.toLowerCase().includes(q) || not.content.toLowerCase().includes(q)) : [],
    people: q ? data.people.filter(p => p.name.toLowerCase().includes(q) || p.position.toLowerCase().includes(q)) : [],
    galleries: q ? data.galleries.filter(g => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)) : []
  };

  const totalResults = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Global Search' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Search Greenfield Government Portal</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px' }}>
            Find news, public meeting agendas, official budget documents, facility contacts, and notices.
          </p>
        </div>
      </div>

      <section style={{ padding: '4rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Search input box */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2.5rem',
            display: 'flex',
            gap: '0.75rem'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Type search terms e.g. budget, water, mayor, clean-up..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)'
                }}
              />
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>
            <button className="btn btn-primary" style={{ padding: '0 1.75rem', fontSize: '1rem' }}>
              Search
            </button>
          </div>

          {q ? (
            <div>
              <div style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
              </div>

              {/* Citizen Services Results */}
              {results.services.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} style={{ color: '#008b95' }} />
                    <span>Citizen Public Services ({results.services.length})</span>
                  </h3>
                  {results.services.map(srv => (
                    <div key={srv.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '0.75rem', background: '#ccfbf1', color: '#0f766e', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>CITIZEN SERVICE</span>
                      <h4 style={{ margin: '0.3rem 0', fontSize: '1.1rem' }}>
                        <a href={`/services#${srv.slug || srv.id}`} onClick={(e) => { e.preventDefault(); onNavigate(`/services#${srv.slug || srv.id}`); }}>{srv.name}</a>
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>{srv.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* News Results */}
              {results.news.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Newspaper size={18} style={{ color: 'var(--color-secondary)' }} />
                    <span>News Articles ({results.news.length})</span>
                  </h3>
                  {results.news.map(n => (
                    <div key={n.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '6px', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '0.75rem', background: 'var(--color-bg-subtle)', color: 'var(--color-secondary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>NEWS</span>
                      <h4 style={{ margin: '0.3rem 0', fontSize: '1.1rem' }}>
                        <a href={`/news/${n.slug}`} onClick={(e) => { e.preventDefault(); onNavigate(`/news/${n.slug}`); }}>{n.title}</a>
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>{n.excerpt}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Documents Results */}
              {results.documents.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} style={{ color: 'var(--color-secondary)' }} />
                    <span>Public Documents ({results.documents.length})</span>
                  </h3>
                  {results.documents.map(doc => (
                    <div key={doc.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '6px', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0284c7', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>DOCUMENT</span>
                      <h4 style={{ margin: '0.3rem 0', fontSize: '1.1rem' }}>
                        <a href={`/documents/${doc.slug}`} onClick={(e) => { e.preventDefault(); onNavigate(`/documents/${doc.slug}`); }}>{doc.title}</a>
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>{doc.summary}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Directory Results */}
              {results.directory.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building size={18} style={{ color: 'var(--color-secondary)' }} />
                    <span>Directory Listings ({results.directory.length})</span>
                  </h3>
                  {results.directory.map(d => (
                    <div key={d.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '6px', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#d97706', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>FACILITY</span>
                      <h4 style={{ margin: '0.3rem 0', fontSize: '1.1rem' }}>
                        <a href={`/directory/${d.slug}`} onClick={(e) => { e.preventDefault(); onNavigate(`/directory/${d.slug}`); }}>{d.name}</a>
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>{d.address} • {d.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Events Results */}
              {results.events.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} style={{ color: 'var(--color-secondary)' }} />
                    <span>Upcoming Events ({results.events.length})</span>
                  </h3>
                  {results.events.map(evt => (
                    <div key={evt.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '6px', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '0.75rem', background: '#f0fff4', color: '#2f855a', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>EVENT</span>
                      <h4 style={{ margin: '0.3rem 0', fontSize: '1.1rem' }}>
                        <a href={`/events/${evt.slug}`} onClick={(e) => { e.preventDefault(); onNavigate(`/events/${evt.slug}`); }}>{evt.title}</a>
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>{evt.month} {evt.day}, {evt.year} • {evt.location}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Notices Results */}
              {results.notices.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bell size={18} style={{ color: 'var(--color-accent)' }} />
                    <span>Notices & Bulletins ({results.notices.length})</span>
                  </h3>
                  {results.notices.map(not => (
                    <div key={not.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '6px', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '0.75rem', background: '#fff5f5', color: '#c53030', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>NOTICE</span>
                      <h4 style={{ margin: '0.3rem 0', fontSize: '1.1rem' }}>
                        <a href={`/notices/${not.slug}`} onClick={(e) => { e.preventDefault(); onNavigate(`/notices/${not.slug}`); }}>{not.title}</a>
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>{not.summary}</p>
                    </div>
                  ))}
                </div>
              )}

              {totalResults === 0 && (
                <div style={{ textAlignment: 'center', padding: '3rem', background: 'white', borderRadius: '8px' }}>
                  <Search size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                  <h3>No Search Results Found</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>No records match your query "{query}". Try checking spelling or using broader search terms.</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlignment: 'center', padding: '3rem', background: 'white', borderRadius: '8px' }}>
              <Search size={48} style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }} />
              <h3>Enter a Search Keyword Above</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>You can search for news, city council minutes, officials, permit applications, or facility hours.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

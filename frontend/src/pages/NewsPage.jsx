import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { NewsCard } from '../components/NewsCard';
import { Search, Bell, ChevronRight, Newspaper, Filter, RefreshCw } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const NewsPage = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dynamic unique categories extracted from municipal news dataset
  const categories = ['All', ...Array.from(new Set((data.news || []).map(n => n.category)))];

  const filteredNews = (data.news || []).filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.author && n.author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="main-content">
      {/* 1. News Hero Header */}
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Municipal News & Press Releases' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">BBMP Media Center & Public Announcements</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '650px' }}>
            Official municipal press releases, SAS e-Khata reforms, lake eco-restoration projects, Tender SURE road updates, and civic health bulletins across Namma Bengaluru.
          </p>
        </div>
      </div>

      {/* 2. Main News Directory & Sidebar */}
      <section style={{ padding: '4rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '2.5rem' }}>
          {/* Main Articles Grid */}
          <div>
            {/* Active Filter Indicators */}
            {(searchTerm || selectedCategory !== 'All') && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                  Showing <strong>{filteredNews.length}</strong> result{filteredNews.length !== 1 ? 's' : ''} {selectedCategory !== 'All' ? `in "${selectedCategory}"` : ''} {searchTerm ? `for "${searchTerm}"` : ''}
                </div>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }}
                >
                  <RefreshCw size={13} />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}

            <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
              {filteredNews.map(item => (
                <NewsCard key={item.id} news={item} onNavigate={onNavigate} />
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3.5rem 2rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Newspaper size={48} style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>No News Articles Found</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Try adjusting your search query or selected category filter.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  className="btn btn-primary"
                  style={{ fontSize: '0.875rem' }}
                >
                  View All News Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Search Box */}
            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.75rem', boxShadow: '0 4px 12px rgba(11, 47, 69, 0.04)' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: 800, fontFamily: 'var(--font-sans)' }}>Search News</h3>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Keywords (e.g. e-Khata, Lakes, Road)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.3rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            {/* Category Filter List */}
            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.75rem', boxShadow: '0 4px 12px rgba(11, 47, 69, 0.04)' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: 800, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={18} style={{ color: 'var(--color-secondary)' }} />
                <span>Categories</span>
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        textAlign: 'left',
                        fontWeight: selectedCategory === cat ? 800 : 500,
                        color: selectedCategory === cat ? '#ffffff' : 'var(--color-text-main)',
                        background: selectedCategory === cat ? 'linear-gradient(135deg, #0b2f45 0%, #008b95 100%)' : '#f8fafc',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '6px',
                        border: selectedCategory === cat ? '1px solid #008b95' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{cat}</span>
                      <ChevronRight size={14} style={{ opacity: selectedCategory === cat ? 1 : 0.6 }} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Notices Widget */}
            <div style={{ background: '#fffbeb', padding: '1.5rem', borderRadius: '10px', border: '1px solid #fcd34d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 800, marginBottom: '0.85rem' }}>
                <Bell size={18} />
                <span>Urgent Bulletins</span>
              </div>
              {(data.notices || []).slice(0, 3).map((notice, idx) => (
                <div key={idx} style={{ marginBottom: '0.75rem', borderBottom: idx < 2 ? '1px solid #fef3c7' : 'none', paddingBottom: '0.6rem' }}>
                  <a 
                    href={`/notices/${notice.slug}`} 
                    onClick={(e) => { e.preventDefault(); onNavigate(`/notices/${notice.slug}`); }}
                    style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0b2f45', lineHeight: '1.4', display: 'block' }}
                  >
                    {notice.title}
                  </a>
                  <span style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.2rem', display: 'block' }}>{notice.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

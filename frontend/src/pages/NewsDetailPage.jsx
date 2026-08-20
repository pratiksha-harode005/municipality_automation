import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { NewsCard } from '../components/NewsCard';
import { Calendar, User, Share2, Facebook, Twitter, Linkedin, Printer, ArrowLeft, Tag } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const NewsDetailPage = ({ slug, onNavigate }) => {
  const { data, showToast } = useMunicipalData();

  const newsList = data?.news || [];
  const article = newsList.find(n => n.slug.toLowerCase() === (slug || '').toLowerCase()) || newsList[0] || {
    title: "BBMP Municipal News Release",
    category: "Announcements",
    date: "2026-08-15",
    author: "BBMP Press Bureau",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Official announcement from Bruhat Bengaluru Mahanagara Palike.",
    content: "Full news release content for Bruhat Bengaluru Mahanagara Palike municipal administration."
  };

  const related = newsList.filter(n => n.id !== article.id).slice(0, 3);

  const handleShare = (platform) => {
    if (showToast) showToast(`Shared to ${platform}!`);
    else alert(`Shared to ${platform}!`);
  };

  return (
    <div id="main-content">
      {/* 1. Article Hero Banner */}
      <div className="page-hero">
        <div className="container">
          <Breadcrumb 
            items={[
              { label: 'Latest News', path: '/news' },
              { label: article.title }
            ]} 
            onNavigate={onNavigate} 
          />
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0, 139, 149, 0.18)', color: '#38bdf8', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '0.5rem' }}>
            <Tag size={13} />
            {article.category}
          </div>

          <h1 className="page-hero-title" style={{ marginTop: '0.75rem', fontSize: '2.25rem', lineHeight: '1.25' }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', gap: '1.5rem', color: '#cbd5e1', fontSize: '0.9rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} style={{ color: '#38bdf8' }} /> Published: {article.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} style={{ color: '#38bdf8' }} /> Issued by: {article.author || 'BBMP Secretariat'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Article Body & Actions */}
      <section style={{ padding: '4rem 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          
          {/* Back to News Listing Link */}
          <div style={{ marginBottom: '1.75rem' }}>
            <button 
              onClick={() => onNavigate('/news')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-secondary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to News Center</span>
            </button>
          </div>

          {/* Article Cover Image */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '440px', marginBottom: '2.5rem', boxShadow: '0 8px 24px rgba(11, 47, 69, 0.12)', border: '1px solid #e2e8f0' }}>
            <img 
              src={article.image} 
              alt={article.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
            />
          </div>

          {/* Lead Excerpt Highlight */}
          {article.excerpt && (
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', borderLeft: '4px solid var(--color-secondary)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-primary)', lineHeight: '1.6', marginBottom: '2rem' }}>
              "{article.excerpt}"
            </div>
          )}

          {/* Article Full Paragraph Content */}
          <div style={{ fontSize: '1.075rem', lineHeight: '1.85', color: '#334155', whiteSpace: 'pre-line', marginBottom: '3.5rem' }}>
            {article.content}
          </div>

          {/* Social Share & Print Actions */}
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            background: 'var(--color-bg-body)',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            marginBottom: '4rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Share2 size={16} /> Share Article:
              </span>
              <button onClick={() => handleShare('Facebook')} className="social-icon" title="Share on Facebook"><Facebook size={16} /></button>
              <button onClick={() => handleShare('Twitter')} className="social-icon" title="Share on Twitter"><Twitter size={16} /></button>
              <button onClick={() => handleShare('LinkedIn')} className="social-icon" title="Share on LinkedIn"><Linkedin size={16} /></button>
            </div>

            <button 
              onClick={() => window.print()}
              className="btn btn-outline-light"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', padding: '0.45rem 1.15rem', fontSize: '0.85rem', fontWeight: 700 }}
            >
              <Printer size={16} />
              <span>Print Press Release</span>
            </button>
          </div>
        </div>

        {/* 3. Related News Section */}
        <div className="container">
          <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '1.75rem', fontFamily: 'var(--font-serif)' }}>
            Related Municipal Announcements
          </h3>
          <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
            {related.map(item => (
              <NewsCard key={item.id} news={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const NewsCard = ({ news, onNavigate }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onNavigate(`/news/${news.slug}`);
  };

  return (
    <article 
      className="news-card" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="news-img-wrap">
        <img src={news.image} alt={news.title} loading="lazy" />
        <span className="news-category-badge">{news.category}</span>
      </div>
      
      <div className="news-content">
        <div className="news-date">
          <Calendar size={14} />
          <span>{news.date}</span>
          <span style={{ margin: '0 4px' }}>•</span>
          <User size={14} />
          <span>{news.author || 'BBMP Secretariat'}</span>
        </div>

        <h3 className="news-title">
          <a href={`/news/${news.slug}`} onClick={handleClick}>
            {news.title}
          </a>
        </h3>

        <p className="news-excerpt">{news.excerpt}</p>

        <div 
          className="news-read-more"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-secondary)', marginTop: 'auto' }}
        >
          <span>Read Full Article</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </article>
  );
};

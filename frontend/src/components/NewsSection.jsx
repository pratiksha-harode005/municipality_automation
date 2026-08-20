import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { NewsCard } from './NewsCard';

export const NewsSection = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const latestNews = data.news.slice(0, 3);

  return (
    <section className="news-section">
      <div className="container">
        <div className="section-title-wrap">
          <h2 className="section-title">Latest News</h2>
          <p className="section-subtitle">
            Stay informed about municipal projects, town council decisions, policy updates, and community initiatives.
          </p>
        </div>

        <div className="news-grid">
          {latestNews.map((item) => (
            <NewsCard key={item.id} news={item} onNavigate={onNavigate} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a 
            href="/news" 
            onClick={(e) => { e.preventDefault(); onNavigate('/news'); }}
            className="btn btn-primary"
          >
            <span>View All News & Announcements</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

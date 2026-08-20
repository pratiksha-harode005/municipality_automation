import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const LatestNewsShowcase = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const [startIndex, setStartIndex] = useState(0);
  const news = data.news || [];
  const cardCount = Math.min(3, news.length);
  const visibleNews = Array.from({ length: cardCount }, (_, index) => news[(startIndex + index) % news.length]);

  const move = (direction) => {
    setStartIndex((current) => (current + direction + news.length) % news.length);
  };

  if (!news.length) return null;

  return (
    <section className="latest-news-showcase" aria-label="Latest news">
      <div className="container latest-news-layout">
        <div className="latest-news-intro">
          <span className="latest-news-icon" aria-hidden="true">▤</span>
          <h2>Latest News</h2>
          <p>Stay up to date with community updates, council decisions, and municipal initiatives.</p>
          <a href="/news" onClick={(event) => { event.preventDefault(); onNavigate('/news'); }} className="latest-news-more">
            More News
          </a>
        </div>

        <div className="latest-news-slider">
          <button className="latest-news-arrow latest-news-prev" onClick={() => move(-1)} aria-label="Previous news"><ChevronLeft size={24} /></button>
          <div className="latest-news-cards">
            {visibleNews.map((item) => (
              <a key={item.id} href={`/news/${item.slug}`} onClick={(event) => { event.preventDefault(); onNavigate(`/news/${item.slug}`); }} className="latest-news-card" style={{ backgroundImage: `url('${item.image}')` }}>
                <span className="latest-news-card-overlay" />
                <span className="latest-news-card-copy">
                  <strong>{item.title}</strong>
                  <small>{new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} in {item.category}</small>
                </span>
              </a>
            ))}
          </div>
          <button className="latest-news-arrow latest-news-next" onClick={() => move(1)} aria-label="Next news"><ChevronRight size={24} /></button>
        </div>
      </div>
    </section>
  );
};

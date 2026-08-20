import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { DirectoryCard } from '../components/DirectoryCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { Search, Filter, MapPin, Building } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const DirectoryPage = ({ onNavigate }) => {
  const { data } = useMunicipalData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // grid or map
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['All', 'Government Offices', 'Education & Culture', 'Public Safety', 'Utilities & Infrastructure', 'Parks & Recreation'];

  const filteredListings = data.directory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Municipal Directory' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Municipal Directory & Facilities</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px' }}>
            Find addresses, contact phone numbers, operating hours, and location maps for all Greenfield government offices and public facilities.
          </p>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">
          {/* Search & Filter Controls */}
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
                placeholder="Search facility name, keyword, or service..."
                value={searchTerm}
                onChange={handleSearchChange}
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
                onChange={handleCategoryChange}
                style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white' }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
              <button 
                onClick={() => setViewMode('grid')}
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-light'}`}
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', color: viewMode === 'grid' ? 'white' : 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
              >
                Grid View
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline-light'}`}
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', color: viewMode === 'map' ? 'white' : 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
              >
                Map View
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <div style={{ marginBottom: '2.5rem' }}>
              <InteractiveMap locations={filteredListings.map(l => ({ name: l.name, address: l.address, type: l.category }))} />
            </div>
          ) : (
            <>
              <div className="directory-grid">
                {paginatedListings.map(item => (
                  <DirectoryCard key={item.id} item={item} onNavigate={onNavigate} />
                ))}
              </div>

              {/* Pagination matching reference design */}
              {totalPages > 1 && (
                <div className="custom-pagination">
                  {currentPage > 1 && (
                    <button 
                      className="pagination-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Prev
                    </button>
                  )}

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`pagination-item ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {currentPage < totalPages && (
                    <button 
                      className="pagination-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {filteredListings.length === 0 && (
            <div style={{ textAlignment: 'center', padding: '3rem', background: 'white', borderRadius: '8px' }}>
              <Building size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
              <h3>No Directory Listings Found</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your search keywords or clearing the category filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { ChevronRight } from 'lucide-react';

export const SitemapSection = ({ onNavigate }) => {
  const columns = [
    {
      title: "Government",
      links: [
        { label: "Mayor's Office", path: "/people/john-anderson-mayor" },
        { label: "Town Council", path: "/people" },
        { label: "Municipal Departments", path: "/about#departments" },
        { label: "Elected Officials", path: "/people" },
        { label: "Planning Commission", path: "/about#committees" }
      ]
    },
    {
      title: "Services",
      links: [
        { label: "Public Works & Utilities", path: "/services#utilities" },
        { label: "Water & Sewer Billing", path: "/services#taxes" },
        { label: "Building Permits & Licensing", path: "/services#permits" },
        { label: "Property Tax Assessments", path: "/services#taxes" },
        { label: "Citizen 311 Request Portal", path: "/services#report" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Upcoming Community Events", path: "/events" },
        { label: "City Photo Galleries", path: "/galleries" },
        { label: "Parks & Recreation Trails", path: "/directory/community-recreation-center" },
        { label: "Public Library Resources", path: "/directory/greenfield-public-library" },
        { label: "Senior Center Activities", path: "/directory/community-recreation-center" }
      ]
    },
    {
      title: "Information",
      links: [
        { label: "Latest News & Releases", path: "/news" },
        { label: "Official Public Notices", path: "/notices" },
        { label: "Annual Municipal Budget", path: "/documents/fy2026-annual-municipal-budget" },
        { label: "Municipal Directory", path: "/directory" },
        { label: "Contact Municipal Offices", path: "/contact" }
      ]
    }
  ];

  return (
    <section className="sitemap-section">
      <div className="container">
        <div className="section-title-wrap" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">Explore Our Municipal</h2>
          <p className="section-subtitle" style={{ color: '#cbd5e1' }}>
            Comprehensive sitemap of municipal departments, services, public records, and civic resources.
          </p>
        </div>

        <div className="sitemap-columns">
          {columns.map((col, idx) => (
            <div key={idx} className="sitemap-col">
              <h3 className="sitemap-col-title">{col.title}</h3>
              <ul className="sitemap-list">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a 
                      href={link.path} 
                      onClick={(e) => { e.preventDefault(); onNavigate(link.path); }}
                    >
                      <ChevronRight size={14} style={{ color: 'var(--color-secondary)' }} />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

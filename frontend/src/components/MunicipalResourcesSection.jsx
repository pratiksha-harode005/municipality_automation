import React from 'react';

const columns = [
  {
    title: 'Event Types',
    description: 'Support for recurring events is included out of the box.',
    links: ['One-time Event', 'Recurring Event', 'Multi-day Event', 'Ended Event'],
    path: '/events'
  },
  {
    title: 'Town Council',
    description: 'Meet the people guiding municipal decisions and services.',
    links: ['Council Meetings', 'Council Members', 'Public Agendas', 'Meeting Minutes'],
    path: '/people'
  },
  {
    title: 'Documents',
    description: 'Create, access, and download official public documents.',
    links: ['Town Board Applications', 'Residential Parking Permit', 'Fire Marshal Forms', 'Parking Strategic Plan'],
    path: '/documents'
  },
  {
    title: 'Pressville Theme',
    description: 'Specifically crafted for small to medium municipalities.',
    links: ['Documentation', 'Support', 'Purchase'],
    path: '/about'
  }
];

export const MunicipalResourcesSection = ({ onNavigate }) => (
  <section className="municipal-resources-section">
    <div className="container municipal-resources-box">
      {columns.map((column) => (
        <div className="municipal-resources-column" key={column.title}>
          <h2>{column.title}</h2>
          <p>{column.description}</p>
          <ul>
            {column.links.map((link) => (
              <li key={link}>
                <a href={column.path} onClick={(event) => { event.preventDefault(); onNavigate(column.path); }}>{link}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

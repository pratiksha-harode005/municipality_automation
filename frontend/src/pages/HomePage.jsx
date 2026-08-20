import React from 'react';
import { Hero } from '../components/Hero';
import { LatestNewsShowcase } from '../components/LatestNewsShowcase';
import { MunicipalResourcesSection } from '../components/MunicipalResourcesSection';
import { HomeDirectoryShowcase } from '../components/HomeDirectoryShowcase';
import { EventsSection } from '../components/EventsSection';
import { DocumentsSection } from '../components/DocumentsSection';
import { GallerySection } from '../components/GallerySection';
import { OfficialsSection } from '../components/OfficialsSection';
import { CTASection } from '../components/CTASection';

export const HomePage = ({ onNavigate }) => {
  return (
    <main id="main-content">
      <Hero onNavigate={onNavigate} />
      <LatestNewsShowcase onNavigate={onNavigate} />
      <MunicipalResourcesSection onNavigate={onNavigate} />
      <HomeDirectoryShowcase onNavigate={onNavigate} />
      <EventsSection onNavigate={onNavigate} />
      <GallerySection onNavigate={onNavigate} />
      <OfficialsSection onNavigate={onNavigate} />
      <DocumentsSection onNavigate={onNavigate} />
      <CTASection onNavigate={onNavigate} />
    </main>
  );
};

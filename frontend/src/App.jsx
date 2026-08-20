import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileMenu } from './components/MobileMenu';
import { LightboxModal } from './components/LightboxModal';
import { ToastNotification } from './components/ToastNotification';
import { FloatingQuickAccess } from './components/FloatingQuickAccess';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { DirectoryDetailPage } from './pages/DirectoryDetailPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { NoticesPage } from './pages/NoticesPage';
import { NoticeDetailPage } from './pages/NoticeDetailPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { GalleriesPage } from './pages/GalleriesPage';
import { GalleryDetailPage } from './pages/GalleryDetailPage';
import { PeoplePage } from './pages/PeoplePage';
import { PersonDetailPage } from './pages/PersonDetailPage';
import { ContactPage } from './pages/ContactPage';
import { ServicesPage } from './pages/ServicesPage';
import { SearchPage } from './pages/SearchPage';
import { SitemapPage } from './pages/SitemapPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DepartmentDetailPage } from './pages/DepartmentDetailPage';
import { CityCorporationsPage } from './pages/CityCorporationsPage';
import { CityCorporationDetailPage } from './pages/CityCorporationDetailPage';

// Authentication & Role Dashboards
import { LoginPage } from './pages/LoginPage';
import { CitizenDashboard } from './pages/dashboards/CitizenDashboard';
import { OfficerDashboard } from './pages/dashboards/OfficerDashboard';
import { DeptAdminDashboard } from './pages/dashboards/DeptAdminDashboard';
import { SuperAdminDashboard } from './pages/dashboards/SuperAdminDashboard';

export function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    window.dispatchEvent(new Event('hashchange'));
    if (!path.includes('#')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route Dispatcher with Protected Role Guards
  const renderCurrentPage = () => {
    const path = currentPath.toLowerCase();

    if (path === '/' || path === '') return <HomePage onNavigate={navigate} />;
    if (path === '/about' || path === '/about/') return <AboutPage onNavigate={navigate} />;
    
    // Directory routes
    if (path === '/directory' || path === '/directory/') return <DirectoryPage onNavigate={navigate} />;
    if (path.startsWith('/directory/')) {
      const slug = path.replace('/directory/', '');
      return <DirectoryDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Events routes
    if (path === '/events' || path === '/events/') return <EventsPage onNavigate={navigate} />;
    if (path.startsWith('/events/')) {
      const slug = path.replace('/events/', '');
      return <EventDetailPage slug={slug} onNavigate={navigate} />;
    }

    // News routes
    if (path === '/news' || path === '/news/') return <NewsPage onNavigate={navigate} />;
    if (path.startsWith('/news/')) {
      const slug = path.replace('/news/', '');
      return <NewsDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Notices routes
    if (path === '/notices' || path === '/notices/') return <NoticesPage onNavigate={navigate} />;
    if (path.startsWith('/notices/')) {
      const slug = path.replace('/notices/', '');
      return <NoticeDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Documents routes
    if (path === '/documents' || path === '/documents/') return <DocumentsPage onNavigate={navigate} />;
    if (path.startsWith('/documents/')) {
      const slug = path.replace('/documents/', '');
      return <DocumentDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Galleries routes
    if (path === '/galleries' || path === '/galleries/') return <GalleriesPage onNavigate={navigate} />;
    if (path.startsWith('/galleries/')) {
      const slug = path.replace('/galleries/', '');
      return <GalleryDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Governance & Leadership routes
    if (path === '/people' || path === '/people/') return <PeoplePage onNavigate={navigate} />;
    if (path === '/gba-administration' || path === '/gba-administration/') return <PeoplePage initialMode="gba" onNavigate={navigate} />;
    if (path === '/city-corporations' || path === '/city-corporations/') return <CityCorporationsPage onNavigate={navigate} />;
    if (path.startsWith('/city-corporations/')) {
      const slug = path.replace('/city-corporations/', '');
      return <CityCorporationDetailPage slug={slug} onNavigate={navigate} />;
    }
    if (path === '/departments' || path === '/departments/') return <DepartmentsPage onNavigate={navigate} />;
    if (path.startsWith('/departments/')) {
      const slug = path.replace('/departments/', '');
      return <DepartmentDetailPage slug={slug} onNavigate={navigate} />;
    }
    if (path.startsWith('/people/')) {
      const slug = path.replace('/people/', '');
      return <PersonDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Other public pages
    if (path === '/contact' || path === '/contact/') return <ContactPage onNavigate={navigate} />;
    if (path.startsWith('/services')) return <ServicesPage onNavigate={navigate} />;
    if (path === '/search' || path === '/search/') {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q') || '';
      return <SearchPage initialQuery={query} onNavigate={navigate} />;
    }
    if (path === '/sitemap' || path === '/sitemap/') return <SitemapPage onNavigate={navigate} />;

    // AUTHENTICATION & ROLE DASHBOARD PROTECTED ROUTES
    if (
      path.startsWith('/login') || 
      path.startsWith('/portal') || 
      path.startsWith('/signin') || 
      path.startsWith('/signup') || 
      path.startsWith('/register') ||
      path.startsWith('/auth')
    ) {
      const isRegister = path.startsWith('/signup') || path.startsWith('/register');
      return <LoginPage onNavigate={navigate} initialTab={isRegister ? 'register' : undefined} />;
    }

    if (path.startsWith('/citizen-dashboard')) {
      return (
        <ProtectedRoute allowedRoles={['citizen']} onNavigate={navigate}>
          <CitizenDashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (path.startsWith('/officer-dashboard')) {
      return (
        <ProtectedRoute allowedRoles={['officer']} onNavigate={navigate}>
          <OfficerDashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (path.startsWith('/dept-admin-dashboard')) {
      return (
        <ProtectedRoute allowedRoles={['dept_admin']} onNavigate={navigate}>
          <DeptAdminDashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (path.startsWith('/super-admin-dashboard') || path.startsWith('/admin')) {
      return (
        <ProtectedRoute allowedRoles={['super_admin']} onNavigate={navigate}>
          <SuperAdminDashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (path.startsWith('/dashboard')) {
      return (
        <ProtectedRoute allowedRoles={['citizen', 'officer', 'dept_admin', 'super_admin']} onNavigate={navigate}>
          <CitizenDashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    return <NotFoundPage onNavigate={navigate} />;
  };

  const isDashboardPage = 
    currentPath.toLowerCase().includes('dashboard') || 
    currentPath.toLowerCase().startsWith('/login') ||
    currentPath.toLowerCase().startsWith('/portal');

  return (
    <div className="app-root">
      <Header 
        currentPath={currentPath} 
        onNavigate={navigate} 
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)} 
      />

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onNavigate={navigate} 
      />

      {renderCurrentPage()}

      {!isDashboardPage && <Footer onNavigate={navigate} />}
      <LightboxModal />
      <ToastNotification />
      <FloatingQuickAccess onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

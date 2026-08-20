import React, { useState } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { 
  ShieldCheck, Users, PlusCircle, Trash2, Edit3, Newspaper, Bell, Calendar, 
  FileText, LogOut, CheckCircle, Lock, RefreshCw, Search, X, Building2, 
  Sparkles, CheckCircle2, AlertCircle, Phone, MapPin, Briefcase, Power,
  Image, Settings, HelpCircle, Layers, Sliders, Globe, ExternalLink, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMunicipalData } from '../../context/DataContext';

const BANGALORE_WARDS = [
  'Ward 112 (Malleshwaram)',
  'Ward 84 (Indiranagar)',
  'Ward 174 (HSR Layout)',
  'Ward 150 (Bellandur)',
  'Ward 198 (RR Nagar)',
  'Ward 45 (Yelahanka)',
  'All Wards (Central Headquarter)'
];

export const SuperAdminDashboard = ({ onNavigate }) => {
  const { user, usersList, createOfficerOrAdminAccount, updateUser, toggleUserStatus, deleteUser, logout } = useAuth();
  const { 
    data, 
    addItem, 
    updateItem, 
    deleteItem, 
    updateSiteInfo, 
    updateHeroSlides, 
    resetData, 
    showToast 
  } = useMunicipalData();

  // Active Admin Sub-Tab
  // Tabs: 'officers', 'departments', 'services', 'hero', 'news', 'events', 'settings', 'users'
  const [activeTab, setActiveTab] = useState('officers');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Dynamic collections from DataContext
  const departmentsList = data.departments || [];
  const servicesList = data.services || [];
  const heroSlidesList = data.heroSlides || [];
  const newsList = data.news || [];
  const eventsList = data.events || [];
  const siteInfo = data.info || {};

  // Computed Users metrics
  const citizens = usersList.filter(u => u.role === 'citizen');
  const officers = usersList.filter(u => u.role === 'officer');
  const activeOfficers = officers.filter(u => u.status !== 'inactive');
  const inactiveOfficers = officers.filter(u => u.status === 'inactive');
  const admins = usersList.filter(u => u.role === 'super_admin');

  // Modal / Editing States
  const [editingUser, setEditingUser] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingHeroSlide, setEditingHeroSlide] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  // Creating State / Form Modals
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({
    name: '',
    code: '',
    slug: '',
    head: '',
    description: '',
    email: '',
    phone: '',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    wingsText: 'General Operations, Field Inspection'
  });

  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    title: '',
    slug: '',
    department: 'Civil Department',
    category: 'Public Services',
    description: '',
    icon: 'FileCheck',
    fee: 'Free / ₹0',
    sla: '48 - 72 Hours',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
  });

  const [isAddingHeroSlide, setIsAddingHeroSlide] = useState(false);
  const [newHeroSlideForm, setNewHeroSlideForm] = useState({
    url: '',
    title: '',
    location: 'Greater Bengaluru'
  });

  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNewsForm, setNewNewsForm] = useState({
    title: '',
    slug: '',
    category: 'Civic Notice',
    date: new Date().toISOString().split('T')[0],
    author: 'BBMP Media Cell',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    excerpt: '',
    content: ''
  });

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    slug: '',
    category: 'Public Forum',
    month: 'AUG',
    day: '25',
    year: '2026',
    time: '10:00 AM – 4:00 PM',
    location: 'BBMP Town Hall',
    address: 'Hudson Circle, Bengaluru',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    excerpt: '',
    description: ''
  });

  // Settings State Form
  const [siteSettingsForm, setSiteSettingsForm] = useState({
    name: siteInfo.name || 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    tagline: siteInfo.tagline || 'Namma Bengaluru - Empowering Citizens through Smart Governance, Lake Conservation & World-Class Civic Infrastructure.',
    phone: siteInfo.phone || '(080) 2297 5555 / (080) 2266 0000',
    emergencyPhone: siteInfo.emergencyPhone || '1533 (BBMP 24/7 Helpline) / 112 (Namma Emergency)',
    email: siteInfo.email || 'contact@bbmp.gov.in / commissioner@bbmp.gov.in',
    address: siteInfo.address || 'Joint Commissioner of Revenue, NR Square, GBA, Bengaluru',
    hours: siteInfo.hours || 'Mon - Sat: 10:00 AM - 5:30 PM (2nd & 4th Saturdays Closed)',
    alertMessage: siteInfo.alertMessage || 'NOTICE: BBMP Property Tax Online Portal 5% Rebate Scheme active for FY 2026-27.'
  });

  // Form for Creating Officer / Admin Account
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    role: 'officer',
    department: 'Civil Department',
    assignedService: '1. Road & Streetlight Complaints',
    ward: 'Ward 112 (Malleshwaram)',
    mobile: '',
    status: 'active',
    password: ''
  });
  const [createError, setCreateError] = useState('');

  // -------------------------------------------------------------
  // HANDLERS FOR OFFICERS & USERS
  // -------------------------------------------------------------
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!newUserForm.fullName.trim() || !newUserForm.email.trim() || !newUserForm.password.trim()) {
      setCreateError('Please fill in all required fields.');
      return;
    }

    const res = await createOfficerOrAdminAccount({
      fullName: newUserForm.fullName.trim(),
      email: newUserForm.email.trim(),
      role: newUserForm.role,
      department: newUserForm.role === 'officer' ? newUserForm.department : 'General Administration',
      assignedService: newUserForm.role === 'officer' ? newUserForm.assignedService : 'All Governance',
      ward: newUserForm.ward,
      mobile: newUserForm.mobile || '94806 00000',
      status: newUserForm.status,
      password: newUserForm.password
    });

    if (res.success) {
      showToast(`Created new ${newUserForm.role === 'super_admin' ? 'Admin' : 'Officer'} account for ${newUserForm.fullName}!`, 'success');
      setNewUserForm({
        fullName: '',
        email: '',
        role: 'officer',
        department: departmentsList[0]?.name || 'Civil Department',
        assignedService: servicesList[0]?.title || 'All Department Services',
        ward: 'Ward 112 (Malleshwaram)',
        mobile: '',
        status: 'active',
        password: ''
      });
      setActiveTab('officers');
    } else {
      setCreateError(res.error);
    }
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatePayload = {
      fullName: editingUser.fullName,
      email: editingUser.email,
      department: editingUser.department,
      assignedService: editingUser.assignedService,
      ward: editingUser.ward,
      mobile: editingUser.mobile,
      status: editingUser.status
    };

    if (editingUser.newPassword && editingUser.newPassword.trim()) {
      updatePayload.password = editingUser.newPassword.trim();
    }

    updateUser(editingUser.id, updatePayload);
    showToast(`Updated details for ${editingUser.fullName}!`, 'success');
    setEditingUser(null);
  };

  const handleDeleteUser = (u) => {
    if (u.email === user?.email) {
      showToast('Cannot delete your own active Admin account.', 'warning');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete user "${u.fullName}" (${u.email})?`)) {
      deleteUser(u.id);
      showToast(`User ${u.fullName} deleted successfully.`, 'info');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR DEPARTMENTS CMS
  // -------------------------------------------------------------
  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptForm.name.trim()) return;

    const slug = newDeptForm.slug.trim() || newDeptForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const wings = newDeptForm.wingsText ? newDeptForm.wingsText.split(',').map(w => w.trim()).filter(Boolean) : [];

    addItem('departments', {
      name: newDeptForm.name.trim(),
      code: newDeptForm.code.trim() || 'DEPT-NEW',
      slug,
      head: newDeptForm.head.trim() || 'Department Administrator',
      description: newDeptForm.description.trim(),
      email: newDeptForm.email.trim(),
      phone: newDeptForm.phone.trim(),
      image: newDeptForm.image.trim(),
      wings
    });

    setIsAddingDept(false);
    setNewDeptForm({
      name: '',
      code: '',
      slug: '',
      head: '',
      description: '',
      email: '',
      phone: '',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      wingsText: ''
    });
  };

  const handleSaveEditDept = (e) => {
    e.preventDefault();
    if (!editingDept) return;
    updateItem('departments', editingDept);
    setEditingDept(null);
  };

  // -------------------------------------------------------------
  // HANDLERS FOR SERVICES CMS
  // -------------------------------------------------------------
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceForm.title.trim()) return;

    const slug = newServiceForm.slug.trim() || newServiceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    addItem('services', {
      title: newServiceForm.title.trim(),
      slug,
      department: newServiceForm.department,
      category: newServiceForm.category,
      description: newServiceForm.description.trim(),
      icon: newServiceForm.icon,
      fee: newServiceForm.fee,
      sla: newServiceForm.sla,
      image: newServiceForm.image,
      link: `/services#${slug}`
    });

    setIsAddingService(false);
    setNewServiceForm({
      title: '',
      slug: '',
      department: departmentsList[0]?.name || 'Civil Department',
      category: 'Public Services',
      description: '',
      icon: 'FileCheck',
      fee: 'Free / ₹0',
      sla: '48 - 72 Hours',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
    });
  };

  const handleSaveEditService = (e) => {
    e.preventDefault();
    if (!editingService) return;
    updateItem('services', editingService);
    setEditingService(null);
  };

  // -------------------------------------------------------------
  // HANDLERS FOR HERO BANNER SLIDES
  // -------------------------------------------------------------
  const handleAddHeroSlide = (e) => {
    e.preventDefault();
    if (!newHeroSlideForm.url.trim() || !newHeroSlideForm.title.trim()) return;

    const newSlide = {
      id: `slide-${Date.now()}`,
      url: newHeroSlideForm.url.trim(),
      title: newHeroSlideForm.title.trim(),
      location: newHeroSlideForm.location.trim() || 'Bengaluru'
    };

    updateHeroSlides([...heroSlidesList, newSlide]);
    setIsAddingHeroSlide(false);
    setNewHeroSlideForm({ url: '', title: '', location: 'Greater Bengaluru' });
  };

  const handleSaveEditHeroSlide = (e) => {
    e.preventDefault();
    if (!editingHeroSlide) return;

    const updated = heroSlidesList.map(s => s.id === editingHeroSlide.id ? editingHeroSlide : s);
    updateHeroSlides(updated);
    setEditingHeroSlide(null);
  };

  const handleDeleteHeroSlide = (slideId) => {
    if (heroSlidesList.length <= 1) {
      showToast('Cannot delete the last remaining hero slide.', 'warning');
      return;
    }
    const updated = heroSlidesList.filter(s => s.id !== slideId);
    updateHeroSlides(updated);
  };

  // -------------------------------------------------------------
  // HANDLERS FOR NEWS & EVENTS CMS
  // -------------------------------------------------------------
  const handleAddNews = (e) => {
    e.preventDefault();
    if (!newNewsForm.title.trim()) return;

    const slug = newNewsForm.slug.trim() || newNewsForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addItem('news', {
      title: newNewsForm.title.trim(),
      slug,
      category: newNewsForm.category,
      date: newNewsForm.date,
      author: newNewsForm.author,
      image: newNewsForm.image,
      excerpt: newNewsForm.excerpt,
      content: newNewsForm.content || newNewsForm.excerpt
    });
    setIsAddingNews(false);
    setNewNewsForm({
      title: '',
      slug: '',
      category: 'Civic Notice',
      date: new Date().toISOString().split('T')[0],
      author: 'BBMP Media Cell',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
      excerpt: '',
      content: ''
    });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventForm.title.trim()) return;

    const slug = newEventForm.slug.trim() || newEventForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addItem('events', {
      title: newEventForm.title.trim(),
      slug,
      category: newEventForm.category,
      month: newEventForm.month,
      day: newEventForm.day,
      year: newEventForm.year,
      time: newEventForm.time,
      location: newEventForm.location,
      address: newEventForm.address,
      image: newEventForm.image,
      excerpt: newEventForm.excerpt,
      description: newEventForm.description || newEventForm.excerpt
    });
    setIsAddingEvent(false);
    setNewEventForm({
      title: '',
      slug: '',
      category: 'Public Forum',
      month: 'AUG',
      day: '25',
      year: '2026',
      time: '10:00 AM – 4:00 PM',
      location: 'BBMP Town Hall',
      address: 'Hudson Circle, Bengaluru',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
      excerpt: '',
      description: ''
    });
  };

  const handleSaveEditNews = (e) => {
    e.preventDefault();
    if (!editingNews) return;
    updateItem('news', editingNews);
    setEditingNews(null);
  };

  const handleSaveEditEvent = (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    const m = (editingEvent.month || 'AUG').toUpperCase();
    const d = editingEvent.day || '25';
    const y = editingEvent.year || '2026';
    const formattedDate = `${m} ${d}, ${y}`;
    const desc = editingEvent.description || editingEvent.excerpt || editingEvent.summary || '';
    const summ = editingEvent.excerpt || editingEvent.summary || desc;

    const fullEvent = {
      ...editingEvent,
      month: m,
      day: d,
      year: y,
      date: formattedDate,
      summary: summ,
      description: desc,
      excerpt: summ
    };
    updateItem('events', fullEvent);
    setEditingEvent(null);
  };

  // -------------------------------------------------------------
  // HANDLER FOR SITE SETTINGS
  // -------------------------------------------------------------
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSiteInfo(siteSettingsForm);
  };

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    // Exclude logged in Admin from the managed users table
    if (u.role === 'super_admin' || u.email === user?.email) return false;

    if (activeTab === 'officers' && u.role !== 'officer') return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (deptFilter !== 'all' && u.department !== deptFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.fullName?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchDept = u.department?.toLowerCase().includes(q);
      const matchService = u.assignedService?.toLowerCase().includes(q);
      const matchWard = u.ward?.toLowerCase().includes(q);
      return matchName || matchEmail || matchDept || matchService || matchWard;
    }
    return true;
  });

  return (
    <div id="main-content">
      {/* Dashboard Top Banner */}
      <div style={{ background: '#f8fafc', padding: '2.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Admin Dashboard' }]} onNavigate={onNavigate} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', background: '#7e22ce', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: 800 }}>
                  👑 ROLE: ADMINISTRATOR (CHIEF EXECUTIVE)
                </span>
                <span style={{ fontSize: '0.78rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                  Master CMS & Live Portal Control
                </span>
              </div>
              <h1 style={{ fontSize: '2.25rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0 0.35rem 0', fontWeight: 800 }}>
                Admin Workstation
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.975rem', margin: 0 }}>
                Full Content Management System: Manage Officers, Services, Departments, Images, News, and Site Settings.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  resetData();
                  showToast('Database reset to fresh state.');
                }}
                className="btn btn-outline-light"
                style={{ borderColor: '#e2e8f0', color: '#64748b' }}
              >
                <RefreshCw size={15} /> Reset DB
              </button>
              <button 
                onClick={logout}
                className="btn btn-outline-light"
                style={{ borderColor: '#cbd5e1', color: '#64748b' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>

      <section style={{ padding: '2.5rem 0', background: 'white' }}>
        <div className="container">
          
          {/* Master Control Suite Tabs Navigation */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.85rem', flexWrap: 'wrap' }}>
            {[
              { id: 'officers', label: `👮 Officers Directory (${officers.length})`, color: '#008b95' },
              { id: 'departments', label: `🏛️ Departments CMS (${departmentsList.length})`, color: '#0284c7' },
              { id: 'services', label: `⚡ Services CMS (${servicesList.length})`, color: '#d97706' },
              { id: 'hero', label: `🖼️ Hero Banner & Images (${heroSlidesList.length})`, color: '#7e22ce' },
              { id: 'news', label: `📰 News & Notices (${newsList.length})`, color: '#e11d48' },
              { id: 'events', label: `📅 Public Events (${eventsList.length})`, color: '#16a34a' },
              { id: 'settings', label: `⚙️ Site Identity & Helplines`, color: '#475569' },
              { id: 'users', label: `👥 Managed Accounts (${citizens.length + officers.length})`, color: '#6b21a8' },
              { id: 'create-account', label: `➕ Create Officer/Admin`, color: '#15803d' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'officers') setRoleFilter('officer');
                    if (tab.id === 'users') setRoleFilter('all');
                  }}
                  style={{
                    padding: '0.65rem 1.15rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 800 : 600,
                    border: 'none',
                    background: isActive ? tab.color : '#f1f5f9',
                    color: isActive ? 'white' : '#475569',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: isActive ? `0 4px 12px ${tab.color}40` : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* TAB 1: OFFICERS DIRECTORY & MANAGEMENT                    */}
          {/* ========================================================= */}
          {activeTab === 'officers' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                
                {/* CARD 1: OFFICERS */}
                <div 
                  onClick={() => { setActiveTab('officers'); setRoleFilter('officer'); setSearchQuery(''); }}
                  style={{ 
                    background: activeTab === 'officers' ? '#f0fdfa' : '#ffffff', 
                    border: activeTab === 'officers' ? '2px solid #0f766e' : '1px solid #e2e8f0', 
                    padding: '1rem 1.25rem', 
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: activeTab === 'officers' ? '0 4px 14px rgba(15, 118, 110, 0.18)' : '0 2px 6px rgba(0,0,0,0.02)',
                    transform: activeTab === 'officers' ? 'translateY(-2px)' : 'none'
                  }}
                  title="Click to view & manage Authorized Officers"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 800 }}>Total Authorized Officers</span>
                    <span style={{ fontSize: '0.7rem', background: '#ccfbf1', color: '#0f766e', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800 }}>👮 Officers</span>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', color: '#0f766e', margin: '0.25rem 0', fontWeight: 800 }}>{officers.length} Officers</h3>
                  <span style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: 600 }}>{activeOfficers.length} Active • {inactiveOfficers.length} Inactive</span>
                </div>

                {/* CARD 2: DEPARTMENTS */}
                <div 
                  onClick={() => { setActiveTab('departments'); setSearchQuery(''); }}
                  style={{ 
                    background: activeTab === 'departments' ? '#f0f9ff' : '#ffffff', 
                    border: activeTab === 'departments' ? '2px solid #0284c7' : '1px solid #e2e8f0', 
                    padding: '1rem 1.25rem', 
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: activeTab === 'departments' ? '0 4px 14px rgba(2, 132, 199, 0.18)' : '0 2px 6px rgba(0,0,0,0.02)',
                    transform: activeTab === 'departments' ? 'translateY(-2px)' : 'none'
                  }}
                  title="Click to view & manage Municipal Departments"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 800 }}>Municipal Departments</span>
                    <span style={{ fontSize: '0.7rem', background: '#e0f2fe', color: '#0284c7', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800 }}>🏛️ Depts</span>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', color: '#1e293b', margin: '0.25rem 0', fontWeight: 800 }}>{departmentsList.length} Departments</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Civil & Medical Jurisdictions</span>
                </div>

                {/* CARD 3: CITIZENS */}
                <div 
                  onClick={() => { setActiveTab('users'); setRoleFilter('citizen'); setSearchQuery(''); }}
                  style={{ 
                    background: activeTab === 'users' && roleFilter === 'citizen' ? '#faf5ff' : '#ffffff', 
                    border: activeTab === 'users' && roleFilter === 'citizen' ? '2px solid #7e22ce' : '1px solid #e2e8f0', 
                    padding: '1rem 1.25rem', 
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: activeTab === 'users' && roleFilter === 'citizen' ? '0 4px 14px rgba(126, 34, 206, 0.18)' : '0 2px 6px rgba(0,0,0,0.02)',
                    transform: activeTab === 'users' && roleFilter === 'citizen' ? 'translateY(-2px)' : 'none'
                  }}
                  title="Click to view & manage Registered Citizen Accounts"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#7e22ce', fontWeight: 800 }}>Registered Citizens</span>
                    <span style={{ fontSize: '0.7rem', background: '#f3e8ff', color: '#7e22ce', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800 }}>👤 Citizens</span>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', color: '#0284c7', margin: '0.25rem 0', fontWeight: 800 }}>{citizens.length} Citizens</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Grievance & Service Users</span>
                </div>

              </div>

              {/* Table Container */}
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                      👮 Municipal Officers Directory ({filteredUsers.length} Active Records)
                    </h4>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                      Update assigned service responsibilities, toggle active/inactive status, or edit credentials live.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', minWidth: '220px' }}>
                      <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="text"
                        placeholder="Search officer name, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.2rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveTab('create-account')}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', background: '#008b95', borderColor: '#008b95', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <PlusCircle size={14} /> Add New Officer
                    </button>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead>
                      <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '0.85rem' }}>Officer Name</th>
                        <th style={{ padding: '0.85rem' }}>Official Email</th>
                        <th style={{ padding: '0.85rem' }}>Department</th>
                        <th style={{ padding: '0.85rem' }}>Assigned Service Point</th>
                        <th style={{ padding: '0.85rem' }}>Ward Jurisdiction</th>
                        <th style={{ padding: '0.85rem', textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '0.85rem', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                            No officers found.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const isInactive = u.status === 'inactive';
                          return (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: isInactive ? 0.75 : 1 }}>
                              <td style={{ padding: '0.85rem' }}>
                                <div style={{ fontWeight: 700, color: '#1e293b' }}>{u.fullName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  {u.mobile ? `📞 ${u.mobile}` : '📞 Contact Office'}
                                </div>
                              </td>
                              <td style={{ padding: '0.85rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                {u.email}
                              </td>
                              <td style={{ padding: '0.85rem' }}>
                                <span style={{ 
                                  background: u.department?.includes('Civil') ? '#e0f2fe' : '#fce7f3',
                                  color: u.department?.includes('Civil') ? '#0369a1' : '#be185d',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700
                                }}>
                                  🏛️ {u.department || 'Civil Department'}
                                </span>
                              </td>
                              <td style={{ padding: '0.85rem' }}>
                                <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                  ⚡ {u.assignedService || 'All Department Services'}
                                </span>
                              </td>
                              <td style={{ padding: '0.85rem', color: '#475569', fontSize: '0.85rem' }}>
                                📍 {u.ward || 'Ward 112 (Malleshwaram)'}
                              </td>
                              <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                                <button
                                  onClick={() => toggleUserStatus(u.id)}
                                  style={{
                                    background: isInactive ? '#fee2e2' : '#dcfce7',
                                    color: isInactive ? '#991b1b' : '#166534',
                                    border: isInactive ? '1px solid #fca5a5' : '1px solid #86efac',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                  }}
                                >
                                  <Power size={12} />
                                  {isInactive ? '🔴 Inactive' : '🟢 Active'}
                                </button>
                              </td>
                              <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                  <button
                                    onClick={() => setEditingUser({ ...u, newPassword: '' })}
                                    style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '0.35rem 0.55rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                  >
                                    <Edit3 size={13} /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u)}
                                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.35rem 0.55rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                  >
                                    <Trash2 size={13} /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: DEPARTMENTS MANAGEMENT (CMS)                       */}
          {/* ========================================================= */}
          {activeTab === 'departments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.35rem', fontWeight: 800 }}>
                    🏛️ Municipal Departments Manager ({departmentsList.length} Active Departments)
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                    Create new departments, update descriptions, assign chief officers, or update banner photos.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingDept(true)}
                  className="btn btn-primary"
                  style={{ background: '#0284c7', borderColor: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                >
                  <PlusCircle size={16} /> Add New Department
                </button>
              </div>

              {/* Departments Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {departmentsList.map(dept => (
                  <div key={dept.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '140px', position: 'relative', background: '#e2e8f0' }}>
                      <img 
                        src={dept.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'} 
                        alt={dept.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'; }}
                      />
                      <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {dept.code}
                      </span>
                    </div>

                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--color-primary)', fontSize: '1.15rem', fontWeight: 800 }}>
                        {dept.name}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, marginBottom: '0.5rem' }}>
                        👤 Head: {dept.head}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0', flex: 1, lineHeight: 1.4 }}>
                        {dept.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          📞 {dept.phone || '080-22975500'}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setEditingDept({ ...dept })}
                            style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => {
                              if (departmentsList.length <= 2) {
                                showToast('Cannot delete core required municipal departments.', 'warning');
                                return;
                              }
                              if (window.confirm(`Delete department "${dept.name}"?`)) {
                                deleteItem('departments', dept.id);
                              }
                            }}
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SERVICES CATALOG MANAGEMENT (CMS)                   */}
          {/* ========================================================= */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.35rem', fontWeight: 800 }}>
                    ⚡ Municipal Services Catalog ({servicesList.length} Active Services)
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                    Add new civic services, assign them to departments, set processing SLAs and application fees.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingService(true)}
                  className="btn btn-primary"
                  style={{ background: '#d97706', borderColor: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                >
                  <PlusCircle size={16} /> Add New Service
                </button>
              </div>

              {/* Services Table */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '0.85rem' }}>Service Title</th>
                      <th style={{ padding: '0.85rem' }}>Assigned Department</th>
                      <th style={{ padding: '0.85rem' }}>Category</th>
                      <th style={{ padding: '0.85rem' }}>Processing SLA</th>
                      <th style={{ padding: '0.85rem' }}>Application Fee</th>
                      <th style={{ padding: '0.85rem', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesList.map(srv => (
                      <tr key={srv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem' }}>
                          <div style={{ fontWeight: 800, color: '#1e293b' }}>{srv.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>{srv.description}</div>
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                            🏛️ {srv.department || 'Civil Department'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem', color: '#475569', fontSize: '0.85rem' }}>
                          {srv.category}
                        </td>
                        <td style={{ padding: '0.85rem', color: '#0f766e', fontWeight: 700, fontSize: '0.85rem' }}>
                          ⏱️ {srv.sla || '48 - 72 Hours'}
                        </td>
                        <td style={{ padding: '0.85rem', color: '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                          💰 {srv.fee || 'Free / ₹0'}
                        </td>
                        <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => setEditingService({ ...srv })}
                              style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete service "${srv.title}"?`)) {
                                  deleteItem('services', srv.id);
                                }
                              }}
                              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: HERO BANNER & VISUAL STUDIO (CMS)                  */}
          {/* ========================================================= */}
          {activeTab === 'hero' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.35rem', fontWeight: 800 }}>
                    🖼️ Hero Banner Slides & Background Studio ({heroSlidesList.length} Active Slides)
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                    Customize background slides, add high-definition photos of landmark buildings, and update slider titles.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingHeroSlide(true)}
                  className="btn btn-primary"
                  style={{ background: '#7e22ce', borderColor: '#7e22ce', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                >
                  <PlusCircle size={16} /> Add New Hero Slide
                </button>
              </div>

              {/* Hero Slides Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {heroSlidesList.map((slide, index) => (
                  <div key={slide.id || index} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ height: '160px', position: 'relative', background: '#0f172a' }}>
                      <img 
                        src={slide.url} 
                        alt={slide.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'; }}
                      />
                      <span style={{ position: 'absolute', top: '0.6rem', left: '0.6rem', background: '#7e22ce', color: 'white', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                        Slide #{index + 1}
                      </span>
                    </div>

                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-primary)', fontSize: '1rem', fontWeight: 800 }}>
                        {slide.title}
                      </h4>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                        📍 {slide.location}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem' }}>
                        <button
                          onClick={() => setEditingHeroSlide({ ...slide })}
                          style={{ background: '#f3e8ff', color: '#7e22ce', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          ✏️ Edit Slide
                        </button>
                        <button
                          onClick={() => handleDeleteHeroSlide(slide.id)}
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: NEWS & ANNOUNCEMENTS CMS                           */}
          {/* ========================================================= */}
          {activeTab === 'news' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.35rem', fontWeight: 800 }}>
                    📰 News & Press Releases CMS ({newsList.length} Articles)
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                    Publish official municipal notices, scheme updates, press releases, and news photos live.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingNews(true)}
                  className="btn btn-primary"
                  style={{ background: '#e11d48', borderColor: '#e11d48', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                >
                  <PlusCircle size={16} /> Publish News Article
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {newsList.map(item => (
                  <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '140px', background: '#cbd5e1' }}>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'; }}
                      />
                    </div>
                    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#e11d48', fontWeight: 700, marginBottom: '0.35rem' }}>
                        <span>{item.category}</span>
                        <span style={{ color: '#64748b' }}>📅 {item.date}</span>
                      </div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary)', fontSize: '0.95rem', fontWeight: 800, lineHeight: 1.3 }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.85rem 0', flex: 1, lineHeight: 1.4 }}>
                        {item.excerpt}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem' }}>
                        <button
                          onClick={() => setEditingNews({ ...item })}
                          style={{ background: '#ffe4e6', color: '#e11d48', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete news article "${item.title}"?`)) {
                              deleteItem('news', item.id);
                            }
                          }}
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: PUBLIC EVENTS CMS                                  */}
          {/* ========================================================= */}
          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.35rem', fontWeight: 800 }}>
                    📅 Public Events & Town Halls CMS ({eventsList.length} Events)
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                    Post municipal events, town halls, cultural festivals, and flower shows with dates and photos.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingEvent(true)}
                  className="btn btn-primary"
                  style={{ background: '#16a34a', borderColor: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                >
                  <PlusCircle size={16} /> Add Public Event
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {eventsList.map(evt => (
                  <div key={evt.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '140px', background: '#cbd5e1', position: 'relative' }}>
                      <img 
                        src={evt.image} 
                        alt={evt.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'; }}
                      />
                      <span style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', background: '#16a34a', color: 'white', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {evt.month} {evt.day}, {evt.year}
                      </span>
                    </div>
                    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--color-primary)', fontSize: '0.95rem', fontWeight: 800 }}>
                        {evt.title}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700, marginBottom: '0.35rem' }}>
                        📍 {evt.location} • ⏰ {evt.time}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.85rem 0', flex: 1, lineHeight: 1.4 }}>
                        {evt.excerpt}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem' }}>
                        <button
                          onClick={() => {
                            const parts = (evt.date || '').split(' ');
                            const m = evt.month || (parts[0] ? parts[0].toUpperCase() : 'AUG');
                            const d = evt.day || (parts[1] ? parts[1].replace(',', '') : '25');
                            const y = evt.year || parts[2] || '2026';
                            setEditingEvent({
                              ...evt,
                              month: m,
                              day: d,
                              year: y,
                              category: evt.category || 'Government',
                              excerpt: evt.excerpt || evt.summary || evt.description || '',
                              description: evt.description || evt.summary || evt.excerpt || '',
                              summary: evt.summary || evt.excerpt || evt.description || '',
                              location: evt.location || '',
                              time: evt.time || '',
                              image: evt.image || ''
                            });
                          }}
                          style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete event "${evt.title}"?`)) {
                              deleteItem('events', evt.id);
                            }
                          }}
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: SITE SETTINGS & HELPLINES CONFIG                   */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '800px', background: '#f8fafc', padding: '2.5rem', borderRadius: '12px', border: '1px solid #cbd5e1', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <Settings size={26} style={{ color: '#475569' }} />
                <h3 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                  Portal Identity, 24/7 Helplines & Notice Marquee
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.75rem' }}>
                Update portal titles, primary contact numbers, emergency disaster helplines, and top alert notice banners live.
              </p>

              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Portal Official Name</label>
                  <input 
                    type="text" required
                    value={siteSettingsForm.name}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Portal Tagline & Vision</label>
                  <textarea 
                    rows={2} required
                    value={siteSettingsForm.tagline}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, tagline: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>24/7 Emergency Helpline *</label>
                    <input 
                      type="text" required
                      value={siteSettingsForm.emergencyPhone}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, emergencyPhone: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, color: '#dc2626' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Control Room Phone *</label>
                    <input 
                      type="text" required
                      value={siteSettingsForm.phone}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Official Support Email *</label>
                    <input 
                      type="text" required
                      value={siteSettingsForm.email}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, email: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Head Office Working Hours</label>
                    <input 
                      type="text" required
                      value={siteSettingsForm.hours}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, hours: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Top Alert Marquee Notice Message</label>
                  <input 
                    type="text" required
                    value={siteSettingsForm.alertMessage}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, alertMessage: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #f59e0b', fontSize: '0.95rem', background: '#fffbeb' }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem', background: '#475569', borderColor: '#475569', fontSize: '1rem', fontWeight: 800 }}
                  >
                    💾 Save Portal Identity & Helpline Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: ALL USER ACCOUNTS                                   */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h4 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  👥 Master System Accounts Registry ({filteredUsers.length} Citizens & Officers)
                </h4>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white', fontWeight: 600 }}
                  >
                    <option value="all">All Managed Users ({citizens.length + officers.length})</option>
                    <option value="citizen">Citizens ({citizens.length})</option>
                    <option value="officer">Officers ({officers.length})</option>
                  </select>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '0.85rem' }}>Full Name</th>
                      <th style={{ padding: '0.85rem' }}>Email</th>
                      <th style={{ padding: '0.85rem' }}>Role</th>
                      <th style={{ padding: '0.85rem' }}>Department / Area</th>
                      <th style={{ padding: '0.85rem', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem', fontWeight: 700 }}>{u.fullName}</td>
                        <td style={{ padding: '0.85rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{u.email}</td>
                        <td style={{ padding: '0.85rem' }}>
                          <span style={{ 
                            background: u.role === 'super_admin' ? '#f3e8ff' : u.role === 'officer' ? '#dcfce7' : '#e0f2fe',
                            color: u.role === 'super_admin' ? '#7e22ce' : u.role === 'officer' ? '#15803d' : '#0369a1',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 800
                          }}>
                            {u.role === 'super_admin' ? '👑 Admin' : u.role === 'officer' ? '👮 Officer' : '👤 Citizen'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem', fontSize: '0.85rem', color: '#64748b' }}>{u.department || u.ward || u.address || 'N/A'}</td>
                        <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={u.email === user?.email}
                            style={{ background: u.email === user?.email ? '#f1f5f9' : '#fee2e2', color: u.email === user?.email ? '#94a3b8' : '#dc2626', border: 'none', padding: '0.35rem 0.55rem', borderRadius: '6px', cursor: u.email === user?.email ? 'not-allowed' : 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: CREATE OFFICER / ADMIN ACCOUNT FORM                */}
          {/* ========================================================= */}
          {activeTab === 'create-account' && (
            <div style={{ maxWidth: '750px', background: '#f8fafc', padding: '2.25rem', borderRadius: '12px', border: '1px solid #cbd5e1', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <PlusCircle size={24} style={{ color: '#15803d' }} />
                <h3 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>
                  Create & Authorize Officer / Admin Credentials
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.75rem' }}>
                Issue field credentials, assign dedicated civil/medical services, and set ward jurisdiction.
              </p>

              {createError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                  ⚠️ {createError}
                </div>
              )}

              <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Assign Target Role *</label>
                  <select 
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, fontSize: '0.95rem' }}
                  >
                    <option value="officer">👮 Municipal Officer (Field Inspection & Grievance Resolution)</option>
                    <option value="super_admin">👑 Admin (Full System Governance)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Full Name *</label>
                    <input 
                      type="text" required 
                      placeholder="e.g. Er. Suresh Rao" 
                      value={newUserForm.fullName} 
                      onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Official Email ID *</label>
                    <input 
                      type="email" required 
                      placeholder="e.g. suresh.civil@bbmp.gov.in" 
                      value={newUserForm.email} 
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} 
                    />
                  </div>
                </div>

                {newUserForm.role === 'officer' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', background: '#f0fdfa', padding: '1.25rem', borderRadius: '10px', border: '1px solid #99f6e4' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f766e', marginBottom: '0.35rem' }}>
                        🏛️ 1. Select Department *
                      </label>
                      <select 
                        value={newUserForm.department}
                        onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #0d9488', background: 'white', fontWeight: 700, fontSize: '0.95rem' }}
                      >
                        {departmentsList.map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f766e', marginBottom: '0.35rem' }}>
                        ⚡ 2. Select Assigned Service Point *
                      </label>
                      <select 
                        value={newUserForm.assignedService}
                        onChange={(e) => setNewUserForm({ ...newUserForm, assignedService: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #0d9488', background: 'white', fontWeight: 700, fontSize: '0.95rem' }}
                      >
                        <option value="All Department Services">All Department Services</option>
                        {servicesList.map(srv => (
                          <option key={srv.id} value={srv.title}>{srv.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Ward Jurisdiction *</label>
                    <select
                      value={newUserForm.ward}
                      onChange={(e) => setNewUserForm({ ...newUserForm, ward: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '0.9rem' }}
                    >
                      {BANGALORE_WARDS.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Official Mobile No</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 94806 88123" 
                      value={newUserForm.mobile} 
                      onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Initial Status *</label>
                    <select
                      value={newUserForm.status}
                      onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, fontSize: '0.9rem' }}
                    >
                      <option value="active">🟢 Active</option>
                      <option value="inactive">🔴 Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Set Login Password *</label>
                  <input 
                    type="password" required 
                    placeholder="Enter secure initial password" 
                    value={newUserForm.password} 
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '0.85rem', background: '#15803d', borderColor: '#15803d', fontSize: '1rem', fontWeight: 800 }}
                  >
                    🚀 Authorize & Issue Officer Credentials
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('officers')}
                    style={{ padding: '0.85rem 1.5rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODALS: EDIT OFFICER / USER                               */}
          {/* ========================================================= */}
          {editingUser && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                    ✏️ Edit Officer Details: {editingUser.fullName}
                  </h3>
                  <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSaveEditUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Full Name</label>
                      <input type="text" value={editingUser.fullName || ''} onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Email ID</label>
                      <input type="email" value={editingUser.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Department</label>
                      <select value={editingUser.department || 'Civil Department'} onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        {departmentsList.map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Assigned Service</label>
                      <select value={editingUser.assignedService || 'All Department Services'} onChange={(e) => setEditingUser({ ...editingUser, assignedService: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <option value="All Department Services">All Department Services</option>
                        {servicesList.map(srv => (
                          <option key={srv.id} value={srv.title}>{srv.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Ward Jurisdiction</label>
                      <input type="text" value={editingUser.ward || ''} onChange={(e) => setEditingUser({ ...editingUser, ward: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Mobile Number</label>
                      <input type="tel" value={editingUser.mobile || ''} onChange={(e) => setEditingUser({ ...editingUser, mobile: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Status</label>
                      <select value={editingUser.status || 'active'} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <option value="active">🟢 Active</option>
                        <option value="inactive">🔴 Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Reset Password (Optional)</label>
                    <input type="password" placeholder="Leave blank to keep current" value={editingUser.newPassword || ''} onChange={(e) => setEditingUser({ ...editingUser, newPassword: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>💾 Save Changes</button>
                    <button type="button" onClick={() => setEditingUser(null)} style={{ padding: '0.75rem 1.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: ADD / EDIT DEPARTMENT                              */}
          {/* ========================================================= */}
          {(isAddingDept || editingDept) && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                    {isAddingDept ? '🏛️ Add New Municipal Department' : `✏️ Edit Department: ${editingDept.name}`}
                  </h3>
                  <button onClick={() => { setIsAddingDept(false); setEditingDept(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={isAddingDept ? handleAddDept : handleSaveEditDept} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Department Name {isAddingDept && '*'}</label>
                      <input 
                        type="text" required={isAddingDept} placeholder="e.g. Parks & Horticulture Department"
                        value={isAddingDept ? newDeptForm.name : (editingDept?.name || '')}
                        onChange={(e) => isAddingDept ? setNewDeptForm({ ...newDeptForm, name: e.target.value }) : setEditingDept({ ...editingDept, name: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Dept Code {isAddingDept && '*'}</label>
                      <input 
                        type="text" required={isAddingDept} placeholder="e.g. PARKS-DEPT"
                        value={isAddingDept ? newDeptForm.code : (editingDept?.code || '')}
                        onChange={(e) => isAddingDept ? setNewDeptForm({ ...newDeptForm, code: e.target.value }) : setEditingDept({ ...editingDept, code: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Chief Officer / Head</label>
                      <input 
                        type="text" placeholder="e.g. Dr. Ramesh Kumar (Director)"
                        value={isAddingDept ? newDeptForm.head : (editingDept?.head || '')}
                        onChange={(e) => isAddingDept ? setNewDeptForm({ ...newDeptForm, head: e.target.value }) : setEditingDept({ ...editingDept, head: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Official Helpline</label>
                      <input 
                        type="text" placeholder="e.g. 080-22975590"
                        value={isAddingDept ? newDeptForm.phone : (editingDept?.phone || '')}
                        onChange={(e) => isAddingDept ? setNewDeptForm({ ...newDeptForm, phone: e.target.value }) : setEditingDept({ ...editingDept, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Banner Image URL</label>
                    <input 
                      type="text" placeholder="https://images.unsplash.com/photo-... or /banner.png"
                      value={isAddingDept ? newDeptForm.image : (editingDept?.image || '')}
                      onChange={(e) => isAddingDept ? setNewDeptForm({ ...newDeptForm, image: e.target.value }) : setEditingDept({ ...editingDept, image: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Mandate & Description</label>
                    <textarea 
                      rows={3} required={isAddingDept}
                      value={isAddingDept ? newDeptForm.description : (editingDept?.description || '')}
                      onChange={(e) => isAddingDept ? setNewDeptForm({ ...newDeptForm, description: e.target.value }) : setEditingDept({ ...editingDept, description: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', background: '#0284c7', borderColor: '#0284c7', fontWeight: 800 }}>
                      💾 {isAddingDept ? 'Create Department' : 'Save Department Changes'}
                    </button>
                    <button type="button" onClick={() => { setIsAddingDept(false); setEditingDept(null); }} style={{ padding: '0.75rem 1.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: ADD / EDIT SERVICE                                 */}
          {/* ========================================================= */}
          {(isAddingService || editingService) && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                    {isAddingService ? '⚡ Add New Municipal Service' : `✏️ Edit Service: ${editingService.title}`}
                  </h3>
                  <button onClick={() => { setIsAddingService(false); setEditingService(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={isAddingService ? handleAddService : handleSaveEditService} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Service Title {isAddingService && '*'}</label>
                    <input 
                      type="text" required={isAddingService} placeholder="e.g. 5. Tree Trimming & Park Maintenance"
                      value={isAddingService ? newServiceForm.title : (editingService?.title || '')}
                      onChange={(e) => isAddingService ? setNewServiceForm({ ...newServiceForm, title: e.target.value }) : setEditingService({ ...editingService, title: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Assigned Department {isAddingService && '*'}</label>
                      <select 
                        value={isAddingService ? newServiceForm.department : (editingService?.department || departmentsList[0]?.name)}
                        onChange={(e) => isAddingService ? setNewServiceForm({ ...newServiceForm, department: e.target.value }) : setEditingService({ ...editingService, department: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700 }}
                      >
                        {departmentsList.map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Category Tag</label>
                      <input 
                        type="text" placeholder="e.g. Environmental Services"
                        value={isAddingService ? newServiceForm.category : (editingService?.category || '')}
                        onChange={(e) => isAddingService ? setNewServiceForm({ ...newServiceForm, category: e.target.value }) : setEditingService({ ...editingService, category: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Processing SLA Turnaround</label>
                      <input 
                        type="text" placeholder="e.g. 48 - 72 Hours"
                        value={isAddingService ? newServiceForm.sla : (editingService?.sla || '')}
                        onChange={(e) => isAddingService ? setNewServiceForm({ ...newServiceForm, sla: e.target.value }) : setEditingService({ ...editingService, sla: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Application Fee</label>
                      <input 
                        type="text" placeholder="e.g. Free / ₹50"
                        value={isAddingService ? newServiceForm.fee : (editingService?.fee || '')}
                        onChange={(e) => isAddingService ? setNewServiceForm({ ...newServiceForm, fee: e.target.value }) : setEditingService({ ...editingService, fee: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Service Description</label>
                    <textarea 
                      rows={2} required={isAddingService}
                      value={isAddingService ? newServiceForm.description : (editingService?.description || '')}
                      onChange={(e) => isAddingService ? setNewServiceForm({ ...newServiceForm, description: e.target.value }) : setEditingService({ ...editingService, description: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', background: '#d97706', borderColor: '#d97706', fontWeight: 800 }}>
                      💾 {isAddingService ? 'Create Service' : 'Save Service Changes'}
                    </button>
                    <button type="button" onClick={() => { setIsAddingService(false); setEditingService(null); }} style={{ padding: '0.75rem 1.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: ADD / EDIT HERO SLIDE                              */}
          {/* ========================================================= */}
          {(isAddingHeroSlide || editingHeroSlide) && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', maxWidth: '550px', width: '100%', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                    {isAddingHeroSlide ? '🖼️ Add Hero Slide' : `✏️ Edit Hero Slide`}
                  </h3>
                  <button onClick={() => { setIsAddingHeroSlide(false); setEditingHeroSlide(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={isAddingHeroSlide ? handleAddHeroSlide : handleSaveEditHeroSlide} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Image URL {isAddingHeroSlide && '*'}</label>
                    <input 
                      type="text" required={isAddingHeroSlide} placeholder="https://images.unsplash.com/... or /bbmp-building.png"
                      value={isAddingHeroSlide ? newHeroSlideForm.url : (editingHeroSlide?.url || '')}
                      onChange={(e) => isAddingHeroSlide ? setNewHeroSlideForm({ ...newHeroSlideForm, url: e.target.value }) : setEditingHeroSlide({ ...editingHeroSlide, url: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Landmark Title {isAddingHeroSlide && '*'}</label>
                    <input 
                      type="text" required={isAddingHeroSlide} placeholder="e.g. BBMP Head Office Secretariat"
                      value={isAddingHeroSlide ? newHeroSlideForm.title : (editingHeroSlide?.title || '')}
                      onChange={(e) => isAddingHeroSlide ? setNewHeroSlideForm({ ...newHeroSlideForm, title: e.target.value }) : setEditingHeroSlide({ ...editingHeroSlide, title: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Location Label</label>
                    <input 
                      type="text" placeholder="e.g. Hudson Circle, Bengaluru"
                      value={isAddingHeroSlide ? newHeroSlideForm.location : (editingHeroSlide?.location || '')}
                      onChange={(e) => isAddingHeroSlide ? setNewHeroSlideForm({ ...newHeroSlideForm, location: e.target.value }) : setEditingHeroSlide({ ...editingHeroSlide, location: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', background: '#7e22ce', borderColor: '#7e22ce', fontWeight: 800 }}>
                      💾 {isAddingHeroSlide ? 'Add Hero Slide' : 'Save Slide Changes'}
                    </button>
                    <button type="button" onClick={() => { setIsAddingHeroSlide(false); setEditingHeroSlide(null); }} style={{ padding: '0.75rem 1.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: ADD NEWS ARTICLE                                   */}
          {/* ========================================================= */}
          {isAddingNews && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                    📰 Publish News Article or Notice
                  </h3>
                  <button onClick={() => setIsAddingNews(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleAddNews} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Article Title *</label>
                    <input type="text" required placeholder="e.g. BBMP Initiates Lake Rejuvenation Project" value={newNewsForm.title} onChange={(e) => setNewNewsForm({ ...newNewsForm, title: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Category</label>
                      <input type="text" placeholder="e.g. Digital Governance" value={newNewsForm.category} onChange={(e) => setNewNewsForm({ ...newNewsForm, category: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Publish Date</label>
                      <input type="date" value={newNewsForm.date} onChange={(e) => setNewNewsForm({ ...newNewsForm, date: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Image URL</label>
                    <input type="text" placeholder="https://images.unsplash.com/... or /image.png" value={newNewsForm.image} onChange={(e) => setNewNewsForm({ ...newNewsForm, image: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Excerpt Summary</label>
                    <textarea rows={2} required placeholder="Short summary" value={newNewsForm.excerpt} onChange={(e) => setNewNewsForm({ ...newNewsForm, excerpt: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', background: '#e11d48', borderColor: '#e11d48', fontWeight: 800 }}>🚀 Publish Article</button>
                    <button type="button" onClick={() => setIsAddingNews(false)} style={{ padding: '0.75rem 1.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: ADD EVENT                                          */}
          {/* ========================================================= */}
          {isAddingEvent && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                    📅 Add New Public Event or Town Hall
                  </h3>
                  <button onClick={() => setIsAddingEvent(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Event Title *</label>
                    <input type="text" required placeholder="e.g. Bengaluru Master Mobility Town Hall" value={newEventForm.title} onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Month</label>
                      <input type="text" placeholder="AUG" value={newEventForm.month} onChange={(e) => setNewEventForm({ ...newEventForm, month: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Day</label>
                      <input type="text" placeholder="25" value={newEventForm.day} onChange={(e) => setNewEventForm({ ...newEventForm, day: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Year</label>
                      <input type="text" placeholder="2026" value={newEventForm.year} onChange={(e) => setNewEventForm({ ...newEventForm, year: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Venue Location</label>
                      <input type="text" placeholder="e.g. Lalbagh Glass House" value={newEventForm.location} onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Timing</label>
                      <input type="text" placeholder="e.g. 10:00 AM – 4:00 PM" value={newEventForm.time} onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Photo Image URL</label>
                    <input type="text" placeholder="https://images.unsplash.com/... or /event.png" value={newEventForm.image} onChange={(e) => setNewEventForm({ ...newEventForm, image: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Event Excerpt</label>
                    <textarea rows={2} required placeholder="Brief description" value={newEventForm.excerpt} onChange={(e) => setNewEventForm({ ...newEventForm, excerpt: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', background: '#16a34a', borderColor: '#16a34a', fontWeight: 800 }}>📅 Add Event</button>
                    <button type="button" onClick={() => setIsAddingEvent(false)} style={{ padding: '0.75rem 1.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: EDIT NEWS ARTICLE                                  */}
          {/* ========================================================= */}
          {editingNews && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                    ✏️ Edit News Article / Notice
                  </h3>
                  <button onClick={() => setEditingNews(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSaveEditNews} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Article Title</label>
                    <input type="text" value={editingNews?.title || ''} onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Category</label>
                      <input type="text" value={editingNews?.category || ''} onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Publish Date</label>
                      <input type="date" value={editingNews?.date || ''} onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Image URL</label>
                    <input type="text" placeholder="https://images.unsplash.com/... or /news.png" value={editingNews?.image || ''} onChange={(e) => setEditingNews({ ...editingNews, image: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Excerpt Summary</label>
                    <textarea rows={2} value={editingNews?.excerpt || ''} onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Full Content</label>
                    <textarea rows={3} value={editingNews?.content || editingNews?.excerpt || ''} onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', background: '#e11d48', borderColor: '#e11d48', fontWeight: 800 }}>💾 Save News Changes</button>
                    <button type="button" onClick={() => setEditingNews(null)} style={{ padding: '0.75rem 1.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODAL: EDIT EVENT                                         */}
          {/* ========================================================= */}
          {editingEvent && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                    ✏️ Edit Public Event / Town Hall: {editingEvent.title}
                  </h3>
                  <button onClick={() => setEditingEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSaveEditEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Event Title</label>
                    <input type="text" value={editingEvent?.title || ''} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Category</label>
                      <select 
                        value={editingEvent?.category || 'Government'} 
                        onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}
                      >
                        <option value="Government">Government</option>
                        <option value="Environment">Environment</option>
                        <option value="Culture & Arts">Culture & Arts</option>
                        <option value="Public Works">Public Works</option>
                        <option value="Public Health">Public Health</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Timing</label>
                      <input type="text" value={editingEvent?.time || ''} onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Month (e.g. AUG)</label>
                      <input type="text" value={editingEvent?.month || ''} onChange={(e) => setEditingEvent({ ...editingEvent, month: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Day (e.g. 25)</label>
                      <input type="text" value={editingEvent?.day || ''} onChange={(e) => setEditingEvent({ ...editingEvent, day: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Year (e.g. 2026)</label>
                      <input type="text" value={editingEvent?.year || ''} onChange={(e) => setEditingEvent({ ...editingEvent, year: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Venue Location</label>
                      <input type="text" value={editingEvent?.location || ''} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Venue Address</label>
                      <input type="text" value={editingEvent?.address || ''} onChange={(e) => setEditingEvent({ ...editingEvent, address: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Photo Image URL</label>
                    <input type="text" placeholder="https://images.unsplash.com/... or /event.png" value={editingEvent?.image || ''} onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Hosted & Organized By</label>
                      <input type="text" placeholder="e.g. Chief Commissioner Secretariat" value={editingEvent?.organizer || ''} onChange={(e) => setEditingEvent({ ...editingEvent, organizer: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Host Helpdesk / Contact</label>
                      <input type="text" placeholder="e.g. Helpdesk: 1533 / 080-22660000" value={editingEvent?.hostContact || ''} onChange={(e) => setEditingEvent({ ...editingEvent, hostContact: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Why This Event is Happening (Civic Purpose & Objectives)</label>
                    <textarea rows={2} placeholder="Explain why the municipal authority is conducting this event..." value={editingEvent?.whyHappening || ''} onChange={(e) => setEditingEvent({ ...editingEvent, whyHappening: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Event Summary / Excerpt</label>
                    <textarea rows={2} value={editingEvent?.excerpt || editingEvent?.summary || ''} onChange={(e) => setEditingEvent({ ...editingEvent, excerpt: e.target.value, summary: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Full Event Description</label>
                    <textarea rows={3} value={editingEvent?.description || editingEvent?.excerpt || ''} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', background: '#16a34a', borderColor: '#16a34a', fontWeight: 800 }}>💾 Save Event Changes</button>
                    <button type="button" onClick={() => setEditingEvent(null)} style={{ padding: '0.75rem 1.25rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 700 }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

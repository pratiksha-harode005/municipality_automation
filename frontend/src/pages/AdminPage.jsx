import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  ShieldCheck, Plus, Trash2, Edit3, RefreshCw, Mail, FileText, 
  Calendar, Newspaper, Bell, Building, Users, Image as ImageIcon, 
  Search, LogOut, Key, UserCheck, Lock, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const AdminPage = ({ onNavigate }) => {
  const { data, addItem, updateItem, deleteItem, resetData } = useMunicipalData();
  const { user, isAuthenticated, isAdmin, isStaff, login, logout, loading, authError } = useAuth();

  // Login Form Local State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // CMS Tabs & Filter State
  const [activeTab, setActiveTab] = useState('news');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal / Form state for Add/Edit
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formImage, setFormImage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLocalError('Please enter both username/email and password.');
      return;
    }

    const res = await login(usernameInput.trim(), passwordInput.trim());
    if (!res.success) {
      setLocalError(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const autofillCredentials = (roleType) => {
    setLocalError('');
    if (roleType === 'admin') {
      setUsernameInput('admin');
      setPasswordInput('admin123');
    } else {
      setUsernameInput('staff');
      setPasswordInput('staff123');
    }
  };

  const openAddForm = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('');
    setFormContent('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormImage('https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80');
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setFormTitle(item.title || item.name || '');
    setFormCategory(item.category || item.type || '');
    setFormContent(item.content || item.description || item.excerpt || item.summary || '');
    setFormDate(item.date || new Date().toISOString().split('T')[0]);
    setFormImage(item.image || item.coverImage || item.portrait || '');
    setIsFormOpen(true);
  };

  const handleFormSave = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (editingItem) {
      const updated = {
        ...editingItem,
        title: formTitle,
        name: activeTab === 'people' || activeTab === 'directory' ? formTitle : editingItem.name,
        category: formCategory,
        content: formContent,
        description: formContent,
        excerpt: formContent.substring(0, 120),
        summary: formContent.substring(0, 120),
        date: formDate,
        image: formImage,
        slug
      };
      updateItem(activeTab, updated);
    } else {
      const newItem = {
        title: formTitle,
        name: formTitle,
        category: formCategory || 'General',
        content: formContent,
        description: formContent,
        excerpt: formContent.substring(0, 120),
        summary: formContent.substring(0, 120),
        date: formDate,
        image: formImage,
        author: user?.full_name || 'Municipal Staff',
        slug
      };
      addItem(activeTab, newItem);
    }
    setIsFormOpen(false);
  };

  // 1. UNAUTHENTICATED STATE: Render Secure Login Portal
  if (!isAuthenticated) {
    return (
      <div id="main-content">
        <div className="page-hero" style={{ background: 'var(--color-primary)', padding: '4rem 0 3rem' }}>
          <div className="container text-center">
            <Breadcrumb items={[{ label: 'Admin Authentication' }]} onNavigate={onNavigate} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(252, 211, 77, 0.15)', color: '#fcd34d', padding: '0.4rem 1rem', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', marginBottom: '1rem', border: '1px solid rgba(252, 211, 77, 0.3)' }}>
              <Lock size={15} />
              Secure Staff & Admin Authentication Portal
            </div>
            <h1 className="page-hero-title" style={{ fontSize: '2.5rem', color: '#ffffff' }}>Municipal Administrative Access</h1>
            <p style={{ color: '#cbd5e1', maxWidth: '540px', margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
              Please enter your authorized municipal staff or system administrator credentials to access the Content Management System.
            </p>
          </div>
        </div>

        <section style={{ padding: '4rem 0 5rem', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: '480px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 12px 36px rgba(11, 47, 69, 0.12)', padding: '2.25rem', position: 'relative', overflow: 'hidden' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #0b2f45 0%, #008b95 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0b2f45', fontFamily: 'var(--font-serif)' }}>CMS Staff Login</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Role-Based Protected Gateway</span>
                </div>
              </div>

              {(localError || authError) && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{localError || authError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Username or Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. admin or staff@greenfield.gov"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem 0.9rem 0.7rem 2.4rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                    <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 2.4rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary btn-shine" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem', fontWeight: 700 }}
                >
                  <UserCheck size={18} />
                  <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
                </button>
              </form>

              {/* Quick Fill Testing Credentials Panel */}
              <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', textAlignment: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Quick Testing Credentials:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => autofillCredentials('admin')}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, color: '#0b2f45', cursor: 'pointer' }}
                  >
                    🔑 Admin (admin / admin123)
                  </button>
                  <button
                    type="button"
                    onClick={() => autofillCredentials('staff')}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, color: '#0b2f45', cursor: 'pointer' }}
                  >
                    👤 Staff (staff / staff123)
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    );
  }

  // 2. AUTHENTICATED STATE: Render CMS Portal
  const currentList = data[activeTab] || [];
  const filteredList = currentList.filter(item => {
    const text = (item.title || item.name || item.subject || '').toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div id="main-content">
      <div className="page-hero" style={{ background: 'var(--color-primary)' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Admin CMS Portal' }]} onNavigate={onNavigate} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fcd34d', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                <ShieldCheck size={18} />
                Official Greenfield Content Management System
              </div>
              <h1 className="page-hero-title" style={{ margin: '0.2rem 0 0' }}>Municipal Administration CMS</h1>
            </div>

            {/* Authenticated User Status Badge & Logout Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  {user?.full_name || 'Authenticated User'}
                </div>
                <div style={{ fontSize: '0.75rem', color: isAdmin ? '#fcd34d' : '#38bdf8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                  Role: {user?.role || 'Staff'} {isAdmin ? '🔑 (Full Access)' : '👤 (Editor Access)'}
                </div>
              </div>

              <button
                onClick={logout}
                className="btn btn-outline-light"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff', gap: '0.4rem' }}
                title="Logout of session"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">
          <div className="admin-container">
            {/* Header Control Bar */}
            <div className="admin-header">
              <div>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontFamily: 'sans-serif' }}>CMS Control Panel</h2>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  Manage live municipal records & citizen inquiries (Authenticated as {user?.role})
                </span>
              </div>

              {/* Admin-only Database Reset Control */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={resetData} className="btn btn-outline-light" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                    <RefreshCw size={14} />
                    <span>Reset Default DB</span>
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="admin-tabs">
              {[
                { id: 'news', label: 'News Articles', icon: Newspaper },
                { id: 'events', label: 'Events Calendar', icon: Calendar },
                { id: 'notices', label: 'Public Notices', icon: Bell },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'directory', label: 'Directory', icon: Building },
                { id: 'people', label: 'Officials', icon: Users },
                { id: 'galleries', label: 'Galleries', icon: ImageIcon },
                { id: 'contactMessages', label: 'Messages', icon: Mail }
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsFormOpen(false); }}
                    className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label} ({data[tab.id]?.length || 0})</span>
                  </button>
                );
              })}
            </div>

            {/* Body */}
            <div className="admin-body">
              {/* Controls bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                  <input 
                    type="text" 
                    placeholder={`Filter ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.2rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                </div>

                {activeTab !== 'contactMessages' && (
                  <button onClick={openAddForm} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    <Plus size={16} />
                    <span>Add New {activeTab.slice(0, -1)}</span>
                  </button>
                )}
              </div>

              {/* Form Modal when Add/Edit open */}
              {isFormOpen && (
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '6px', border: '2px solid var(--color-secondary)', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    {editingItem ? 'Edit Record' : 'Create New Record'} in "{activeTab}"
                  </h3>
                  <form onSubmit={handleFormSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>Title / Name</label>
                      <input 
                        type="text" 
                        required 
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>Category / Department</label>
                        <input 
                          type="text" 
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>Date</label>
                        <input 
                          type="date" 
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>Image URL / Portrait</label>
                      <input 
                        type="text" 
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="https://..."
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>Content / Description</label>
                      <textarea 
                        rows={4} 
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                        Save Record
                      </button>
                      <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-outline-light" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', borderColor: 'var(--color-text-muted)', color: 'var(--color-text-muted)' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Data Table */}
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title / Name</th>
                      <th>Category / Details</th>
                      <th>Date / Timestamp</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong style={{ color: 'var(--color-primary)' }}>{item.title || item.name || item.subject}</strong>
                          {item.email && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>From: {item.email}</div>}
                        </td>
                        <td>
                          <span style={{ background: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {item.category || item.department || item.type || 'General'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          {item.date || 'N/A'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            {activeTab !== 'contactMessages' && (
                              <button 
                                onClick={() => openEditForm(item)}
                                style={{ padding: '4px 8px', background: '#e0f2fe', color: '#0284c7', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                title="Edit Record"
                              >
                                <Edit3 size={14} />
                              </button>
                            )}

                            {/* Role-based deletion control */}
                            {isAdmin ? (
                              <button 
                                onClick={() => deleteItem(activeTab, item.id)}
                                style={{ padding: '4px 8px', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                <Trash2 size={14} />
                              </button>
                            ) : (
                              <button 
                                disabled
                                style={{ padding: '4px 8px', background: '#f1f5f9', color: '#94a3b8', borderRadius: '4px', border: 'none', cursor: 'not-allowed' }}
                                title="Delete restricted to Admin role"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredList.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlignment: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                          No records found in {activeTab}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

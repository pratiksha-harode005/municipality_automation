import React, { useState, useEffect } from 'react';
import { ArrowUp, Bot, X, Search, PhoneCall, FileText, MapPin, Sparkles, CreditCard, AlertTriangle, ShieldCheck } from 'lucide-react';

export const FloatingQuickAccess = ({ onNavigate }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAction = (path) => {
    setIsModalOpen(false);
    onNavigate(path);
  };

  const quickActions = [
    { title: 'Pay Taxes & Water Bill', path: '/services#taxes', icon: <CreditCard size={18} />, tag: 'Fast Online Pay' },
    { title: 'Report City Issue (311)', path: '/services#report', icon: <AlertTriangle size={18} />, tag: 'Potholes, Lights' },
    { title: 'Apply for Building Permit', path: '/services#permits', icon: <FileText size={18} />, tag: 'Zoning & Construction' },
    { title: 'Find Office & Hours', path: '/directory', icon: <MapPin size={18} />, tag: 'City Hall, Library' },
    { title: 'Contact City Officials', path: '/contact', icon: <PhoneCall size={18} />, tag: 'Mayor & Council' },
    { title: 'Emergency Hotline 911', path: '/contact#emergency', icon: <ShieldCheck size={18} />, tag: '24/7 Police & Fire' },
  ];

  const filteredActions = quickActions.filter(action => 
    action.title.toLowerCase().includes(assistantQuery.toLowerCase()) ||
    action.tag.toLowerCase().includes(assistantQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Action Container */}
      <div className="floating-action-container">
        {/* Quick Assistant FAB */}
        <button 
          className="fab-btn fab-assistant"
          onClick={() => setIsModalOpen(true)}
          title="Open Municipal Digital Assistant"
        >
          <Bot size={20} />
          <span className="fab-pulse-beacon"></span>
        </button>

        {/* Scroll To Top FAB */}
        {showScrollTop && (
          <button 
            className="fab-btn fab-scrolltop"
            onClick={scrollToTop}
            title="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        )}
      </div>

      {/* Digital Assistant Modal Drawer */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="assistant-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="assistant-header">
              <div className="assistant-title-group">
                <div className="assistant-avatar">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="assistant-heading">Municipal Smart Navigator</h3>
                  <p className="assistant-subheading">Instant access to Greenfield civic services & records</p>
                </div>
              </div>
              <button className="assistant-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="assistant-search-box">
              <Search size={16} className="assistant-search-icon" />
              <input 
                type="text" 
                placeholder="Type a topic (e.g. tax, permit, hours, trash)..."
                value={assistantQuery}
                onChange={(e) => setAssistantQuery(e.target.value)}
                autoFocus
                className="assistant-search-input"
              />
            </div>

            <div className="assistant-actions-grid">
              {filteredActions.map((item, idx) => (
                <button 
                  key={idx} 
                  className="assistant-action-item"
                  onClick={() => handleQuickAction(item.path)}
                >
                  <div className="assistant-action-icon">{item.icon}</div>
                  <div className="assistant-action-text">
                    <span className="assistant-action-title">{item.title}</span>
                    <span className="assistant-action-tag">{item.tag}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="assistant-footer">
              <Sparkles size={14} className="text-secondary" />
              <span>Need further help? Call Greenfield Hotline: <strong>+1 (555) 019-2831</strong></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

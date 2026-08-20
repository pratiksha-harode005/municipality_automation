import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { InteractiveMap } from '../components/InteractiveMap';
import { MapPin, Phone, Mail, Clock, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const ContactPage = ({ onNavigate }) => {
  const { data, submitContactMessage } = useMunicipalData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      submitContactMessage(formData);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }
  };

  return (
    <div id="main-content">
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Contact Municipal Office' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Contact Greenfield Administration</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px' }}>
            Reach out to municipal staff, report public issues, submit inquiries, or schedule appointments with town council offices.
          </p>
        </div>
      </div>

      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3.5rem' }}>
          {/* Left Contact Info */}
          <div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              Municipal Headquarters
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
              Greenfield City Hall is open Monday through Friday for citizen walk-in service, public document requests, property tax payments, and permit licensing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.75rem', borderRadius: '8px' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>Office Location</h4>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{data.info.address}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.75rem', borderRadius: '8px' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>Phone & Fax</h4>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Main: {data.info.phone}</p>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Emergency Dispatch: {data.info.emergencyPhone}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.75rem', borderRadius: '8px' }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>Official Email</h4>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{data.info.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.75rem', borderRadius: '8px' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>Operating Hours</h4>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{data.info.hours}</p>
                </div>
              </div>
            </div>

            <div style={{ background: '#fff5f5', borderLeft: '4px solid #c53030', padding: '1.25rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c53030', fontWeight: 700, marginBottom: '0.3rem' }}>
                <ShieldAlert size={18} />
                <span>Life-Safety Emergency</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#742a2a' }}>
                For immediate life-threatening emergencies, fire, or active crime reporting, please dial <strong>911</strong> immediately.
              </p>
            </div>
          </div>

          {/* Right Contact Form */}
          <div style={{ background: 'var(--color-bg-body)', padding: '2.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Citizen Official Inquiry Form
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', marginBottom: '1.75rem' }}>
              Complete the form below. Messages are routed directly to the appropriate municipal department officer.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Full Name *
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    required 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Subject Category
                </label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white' }}
                >
                  <option value="General Inquiry">General Municipal Inquiry</option>
                  <option value="Taxes & Utilities">Taxes & Utility Billing</option>
                  <option value="Building Permits">Building Permits & Licenses</option>
                  <option value="Public Works">Public Works & Road Repair</option>
                  <option value="Mayor Office">Mayor & Council Inquiry</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Message Content *
                </label>
                <textarea 
                  rows={5} 
                  required 
                  placeholder="Describe your question or citizen request in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white' }}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', justifyContent: 'center' }}>
                <Send size={18} />
                <span>Submit Inquiry to Greenfield Municipal</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container">
          <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
            City Hall & Plaza Location Map
          </h3>
          <InteractiveMap locations={[{ name: "Greenfield City Hall Plaza", address: data.info.address }]} />
        </div>
      </section>
    </div>
  );
};

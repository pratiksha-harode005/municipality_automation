import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useMunicipalData } from '../context/DataContext';

export const ToastNotification = () => {
  const { activeToast } = useMunicipalData();

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'warning': return <AlertTriangle size={20} style={{ color: '#d97706' }} />;
      case 'error': return <AlertCircle size={20} style={{ color: '#c53030' }} />;
      case 'info': return <Info size={20} style={{ color: '#007791' }} />;
      default: return <CheckCircle2 size={20} style={{ color: '#2f855a' }} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: '#091f2e',
      color: 'white',
      padding: '0.85rem 1.25rem',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: 4000,
      borderLeft: `4px solid ${
        activeToast.type === 'warning' ? '#d97706' : 
        activeToast.type === 'error' ? '#c53030' : 
        activeToast.type === 'info' ? '#007791' : '#2f855a'
      }`,
      animation: 'slideIn 0.3s ease-out'
    }}>
      {getIcon()}
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{activeToast.message}</span>
    </div>
  );
};

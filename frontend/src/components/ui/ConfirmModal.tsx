import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './index';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Delete",
  variant = 'danger'
}) => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(12, 14, 20, 0.9)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 200,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: '#1E1F26', 
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.03)'
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          backgroundColor: variant === 'danger' ? 'rgba(255, 180, 171, 0.1)' : 'rgba(78, 222, 147, 0.1)', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <AlertTriangle size={24} color={variant === 'danger' ? '#FFB4AB' : '#4EDE93'} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{title}</h2>
          <p style={{ color: '#BBCABF', fontSize: '0.9rem', lineHeight: '1.5' }}>{message}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Button variant="secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</Button>
          <button 
            onClick={onConfirm}
            style={{ 
              flex: 1,
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: '600',
              backgroundColor: variant === 'danger' ? '#FFB4AB' : '#4EDE93',
              color: '#111319',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

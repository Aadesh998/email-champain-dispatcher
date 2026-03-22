import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface NotificationContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      <div style={{ 
        position: 'fixed', 
        bottom: '2rem', 
        right: '2rem', 
        zIndex: 1000, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 size={18} color="#4EDE93" />;
      case 'error': return <AlertCircle size={18} color="#FFB4AB" />;
      default: return <Info size={18} color="#BBCABF" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'rgba(78, 222, 147, 0.2)';
      case 'error': return 'rgba(255, 180, 171, 0.2)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  return (
    <div style={{ 
      pointerEvents: 'auto',
      backgroundColor: '#1E1F26', 
      border: `1px solid ${getBorderColor()}`,
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
      minWidth: '300px',
      maxWidth: '450px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {getIcon()}
      <span style={{ fontSize: '0.9rem', color: '#E2E2EB', flex: 1 }}>{toast.message}</span>
      <button onClick={onRemove} style={{ background: 'none', color: '#666', cursor: 'pointer' }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

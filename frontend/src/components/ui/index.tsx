import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const style: React.CSSProperties = variant === 'primary' 
    ? { 
        background: 'linear-gradient(135deg, #10B981 0%, #4EDE93 100%)', 
        color: '#fff', 
        padding: '0.75rem 1.5rem', 
        borderRadius: '9999px', 
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
      }
    : variant === 'secondary'
    ? { 
        backgroundColor: '#33343B', 
        color: '#E2E2EB', 
        padding: '0.75rem 1.5rem', 
        borderRadius: '9999px', 
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }
    : { 
        backgroundColor: 'transparent', 
        color: '#4EDE93', 
        padding: '0.75rem 1.5rem', 
        borderRadius: '9999px', 
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      };

  return (
    <button style={style} className={className} {...props}>
      {children}
    </button>
  );
};

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label style={{ 
        color: '#BBCABF', 
        fontSize: '0.75rem', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        fontWeight: '700'
      }}>{label}</label>
      {children}
    </div>
  );
};

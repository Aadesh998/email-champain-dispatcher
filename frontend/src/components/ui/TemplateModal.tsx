import React, { useState, useEffect } from 'react';
import { X, Eye, Code, Save, Send, Trash2 } from 'lucide-react';
import { Button, FormGroup } from './index';
import { api } from '../../config';
import { Template } from '../../types';
import { useNotification } from './NotificationProvider';

interface TemplateModalProps {
  template?: Template | null; // If provided, we are in Edit mode
  onClose: () => void;
  onSuccess: () => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ template, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const { showToast } = useNotification();

  useEffect(() => {
    if (template) {
      setName(template.name);
      setSubject(template.subject);
      setBody(template.body);
    }
  }, [template]);

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!name || !subject || !body) {
      showToast("All fields are required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (template) {
        // Update existing
        await api.updateTemplate(template.id, { name, subject, body, status });
        showToast("Template updated successfully!", "success");
      } else {
        // Create new
        await api.createTemplate({ name, subject, body, status });
        showToast("Template created successfully!", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(template ? "Failed to update template" : "Failed to create template", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(12, 14, 20, 0.95)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{ 
        width: '95vw', 
        height: '90vh', 
        backgroundColor: '#111319', 
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 0 1px rgba(78, 222, 147, 0.1), 0 40px 80px -20px rgba(0,0,0,0.8)',
        overflow: 'hidden'
      }}>
        
        {/* Top Navigation Bar */}
        <div style={{ 
          padding: '1.25rem 2rem', 
          backgroundColor: '#191B22', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#4EDE93' }}>
              {template ? 'Edit Template' : 'Template Architect'}
            </h2>
            <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#0C0E14', padding: '0.25rem', borderRadius: '8px' }}>
              <TabButton 
                active={activeTab === 'edit'} 
                onClick={() => setActiveTab('edit')}
                icon={<Code size={16} />}
                label="Editor"
              />
              <TabButton 
                active={activeTab === 'preview'} 
                onClick={() => setActiveTab('preview')}
                icon={<Eye size={16} />}
                label="Split View"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button variant="tertiary" onClick={onClose} disabled={isSubmitting}>Discard</Button>
            <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={isSubmitting}>
              <Save size={18} /> {template ? 'Save Changes (Draft)' : 'Save Draft'}
            </Button>
            <Button variant="primary" onClick={() => handleSubmit('published')} disabled={isSubmitting}>
              <Send size={18} /> {template ? 'Update & Publish' : 'Publish Template'}
            </Button>
          </div>
        </div>

        {/* Workspace */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* Left Panel: Inputs & Editor */}
          <div style={{ 
            flex: activeTab === 'edit' ? 1 : 0.5, 
            padding: '2rem', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            borderRight: '1px solid rgba(255,255,255,0.03)',
            transition: 'all 0.3s ease'
          }}>
            <FormGroup label="General Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input 
                  placeholder="Template Name (e.g. Welcome Email)" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', fontSize: '0.9rem' }}
                />
                <input 
                  placeholder="Email Subject" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  style={{ width: '100%', fontSize: '0.9rem' }}
                />
              </div>
            </FormGroup>

            <FormGroup label="Content Architect (HTML Support)">
              <textarea 
                placeholder="Start crafting your message... Use %s for strings or %v for any value." 
                value={body}
                onChange={e => setBody(e.target.value)}
                style={{ 
                  width: '100%', 
                  flex: 1,
                  minHeight: '400px', 
                  backgroundColor: '#0C0E14', 
                  color: '#4EDE93',
                  fontFamily: '"Fira Code", monospace',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  border: '1px solid rgba(78, 222, 147, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.5rem',
                  resize: 'none'
                }}
              />
            </FormGroup>
          </div>

          {/* Right Panel: Live Preview */}
          {(activeTab === 'preview' || activeTab === 'edit') && (
            <div style={{ 
              flex: activeTab === 'preview' ? 1 : (activeTab === 'edit' ? 0 : 0.5), 
              padding: '2rem', 
              backgroundColor: '#0C0E14',
              display: activeTab === 'edit' ? 'none' : 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <label style={{ 
                color: '#BBCABF', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                fontWeight: '700'
              }}>Live Rendering</label>
              
              <div style={{ 
                flex: 1, 
                backgroundColor: 'white', 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #eee', color: '#666', fontSize: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </div>
                <div 
                  style={{ 
                    padding: '2rem', 
                    height: '100%', 
                    overflowY: 'auto', 
                    color: '#333',
                    whiteSpace: 'pre-wrap', // Preserve newlines
                    wordBreak: 'break-word'
                  }}
                  dangerouslySetInnerHTML={{ __html: body || '<div style="color: #999; text-align: center; margin-top: 4rem;">Preview will appear here...</div>' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        padding: '0.5rem 1rem', 
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: active ? '#4EDE93' : '#BBCABF',
        backgroundColor: active ? 'rgba(78, 222, 147, 0.1)' : 'transparent',
        transition: 'all 0.2s ease'
      }}
    >
      {icon}
      {label}
    </button>
  );
}

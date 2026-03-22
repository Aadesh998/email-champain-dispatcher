import React from 'react';
import { FormGroup } from '../ui';
import { CampaignFormData, Template } from '../../types';
import { FileText, CheckCircle2, Upload } from 'lucide-react';

export const Step1: React.FC<{ data: CampaignFormData, onChange: (d: Partial<CampaignFormData>) => void }> = ({ data, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Campaign Details</h2>
      <p style={{ color: '#BBCABF' }}>Define the core identity of your message.</p>
    </div>
    <FormGroup label="Campaign Name">
      <input 
        placeholder="e.g. Q1 Product Launch" 
        value={data.name}
        onChange={e => onChange({ name: e.target.value })}
        style={{ width: '100%' }}
      />
    </FormGroup>
    <FormGroup label="Subject Line">
      <input 
        placeholder="The wait is almost over..." 
        value={data.subject}
        onChange={e => onChange({ subject: e.target.value })}
        style={{ width: '100%' }}
      />
    </FormGroup>
    <FormGroup label="Sender Name">
      <input 
        placeholder="MailForge Team" 
        value={data.sender}
        onChange={e => onChange({ sender: e.target.value })}
        style={{ width: '100%' }}
      />
    </FormGroup>
  </div>
);

export const Step2: React.FC<{ data: CampaignFormData, templates: Template[], onChange: (d: Partial<CampaignFormData>) => void }> = ({ data, templates, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Select Template</h2>
      <p style={{ color: '#BBCABF' }}>Choose a visual architecture for your content.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
      {templates.map(t => (
        <div 
          key={t.id}
          onClick={() => onChange({ templateId: t.id })}
          style={{ 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-default)',
            backgroundColor: data.templateId === t.id ? 'rgba(78, 222, 147, 0.1)' : '#0C0E14',
            border: '1px solid',
            borderColor: data.templateId === t.id ? '#4EDE93' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <FileText size={24} color={data.templateId === t.id ? '#4EDE93' : '#BBCABF'} />
          <h4 style={{ marginTop: '1rem', fontWeight: '600' }}>{t.name}</h4>
        </div>
      ))}
    </div>
  </div>
);

export const Step3: React.FC<{ data: CampaignFormData, onChange: (d: Partial<CampaignFormData>) => void }> = ({ data, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange({ csvFile: e.target.files[0] });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Audience & Delivery</h2>
        <p style={{ color: '#BBCABF' }}>Configure your recipients and launch protocol.</p>
      </div>
      <FormGroup label="Audience Type">
        <div style={{ 
            padding: '1rem', 
            backgroundColor: '#0C0E14', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            border: '1px solid rgba(78, 222, 147, 0.4)'
          }}>
          <CheckCircle2 size={20} color="#4EDE93" />
          <span>CSV Upload (Recommended)</span>
        </div>
      </FormGroup>
      <div style={{ 
        border: '2px dashed #3C4A42', 
        borderRadius: 'var(--radius-default)', 
        padding: '3rem', 
        textAlign: 'center',
        backgroundColor: '#0C0E14',
        position: 'relative'
      }}>
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileChange}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%'
          }} 
        />
        <Upload size={40} color={data.csvFile ? "#4EDE93" : "#BBCABF"} style={{ marginBottom: '1rem', margin: '0 auto' }} />
        <h3 style={{ fontWeight: '600', color: data.csvFile ? "#4EDE93" : "inherit" }}>
          {data.csvFile ? data.csvFile.name : "Click or drag CSV to upload"}
        </h3>
        <p style={{ color: '#BBCABF', fontSize: '0.875rem', marginTop: '0.5rem' }}>Max file size 25MB. System expects 'email' column.</p>
      </div>
    </div>
  );
};

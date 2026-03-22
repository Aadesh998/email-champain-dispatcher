import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Send } from 'lucide-react';
import { Button, FormGroup } from './index';
import { api } from '../../config';
import { Campaign } from '../../types';
import { useNotification } from './NotificationProvider';

interface SendCampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}

export const SendCampaignModal: React.FC<SendCampaignModalProps> = ({ campaign, onClose, onSuccess }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!csvFile) {
      showToast("Please upload a CSV file.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('file', csvFile);
      await api.sendCampaign(campaign.id, fd);
      showToast("Delivery initiated successfully!", "success");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to initiate delivery.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(12, 14, 20, 0.9)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        backgroundColor: '#1E1F26', 
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: '#BBCABF' }}>
          <X size={24} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Initiate Delivery</h2>
          <p style={{ color: '#BBCABF' }}>Campaign: <strong style={{ color: '#4EDE93' }}>{campaign.campaign_name}</strong></p>
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
          <Upload size={40} color={csvFile ? "#4EDE93" : "#BBCABF"} style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h3 style={{ fontWeight: '600', color: csvFile ? "#4EDE93" : "inherit" }}>
            {csvFile ? csvFile.name : "Select CSV to Launch"}
          </h3>
          <p style={{ color: '#BBCABF', fontSize: '0.875rem', marginTop: '0.5rem' }}>Max file size 25MB. Refer to Help tab for format.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Button variant="tertiary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSend} disabled={isSubmitting || !csvFile}>
            <Send size={18} /> {isSubmitting ? 'Launching...' : 'Start Delivery'}
          </Button>
        </div>
      </div>
    </div>
  );
};

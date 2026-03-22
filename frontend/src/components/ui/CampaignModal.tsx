import React, { useState, useEffect } from 'react';
import { X, Save, Send } from 'lucide-react';
import { Button, FormGroup } from './index';
import { api } from '../../config';
import { Campaign, Template } from '../../types';
import { useNotification } from './NotificationProvider';

interface CampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({ campaign, onClose, onSuccess }) => {
  const [name, setName] = useState(campaign.campaign_name);
  const [description, setDescription] = useState(campaign.description);
  const [templateId, setTemplateId] = useState<number | null>(campaign.template_id);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotification();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.getTemplates();
        setTemplates(res.templates || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTemplates();
  }, []);

  const handleSubmit = async (status?: string) => {
    if (!name || !templateId) {
      showToast("Name and Template are required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.updateCampaign(campaign.id, {
        campaign_name: name,
        description: description,
        template_id: templateId,
        audience_data_source: 'csv',
        status: status || campaign.status
      });
      showToast("Campaign updated successfully!", "success");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to update campaign", "error");
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
        maxWidth: '600px', 
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Edit Campaign</h2>
          <p style={{ color: '#BBCABF' }}>Refine the details of your communication strategy.</p>
        </div>

        <FormGroup label="Campaign Name">
          <input 
            placeholder="e.g. Q1 Product Launch" 
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%' }}
          />
        </FormGroup>

        <FormGroup label="Description / Subject Line">
          <input 
            placeholder="The wait is almost over..." 
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: '100%' }}
          />
        </FormGroup>

        <FormGroup label="Select Template">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', padding: '0.5rem' }}>
            {templates.map(t => (
              <div 
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '12px',
                  backgroundColor: templateId === t.id ? 'rgba(78, 222, 147, 0.1)' : '#0C0E14',
                  border: '1px solid',
                  borderColor: templateId === t.id ? '#4EDE93' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: templateId === t.id ? '#4EDE93' : '#E2E2EB'
                }}
              >
                {t.name}
              </div>
            ))}
          </div>
        </FormGroup>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Button variant="tertiary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={() => handleSubmit()} disabled={isSubmitting}>
            <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

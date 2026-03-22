import React, { useState, useEffect } from 'react';
import { ChevronRight, Save, Send } from 'lucide-react';
import { CampaignFormData, CampaignStep, Template } from '../types';
import { Button } from '../components/ui';
import { Header } from '../components/layout';
import { Step1, Step2 } from '../components/campaign-wizard';
import { api } from '../config';
import { useNotification } from '../components/ui/NotificationProvider';

interface NewCampaignPageProps {
  onCancel: () => void;
}

export const NewCampaignPage: React.FC<NewCampaignPageProps> = ({ onCancel }) => {
  const [step, setStep] = useState<CampaignStep>(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotification();
  
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    subject: '',
    sender: '',
    templateId: null,
    csvFile: null // Not used in this 2-step flow
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.getTemplates();
        setTemplates(res.templates || []);
      } catch (err) {
        console.error("Failed to load templates for wizard:", err);
      }
    };
    fetchTemplates();
  }, []);

  const handleNext = () => setStep((s) => Math.min(s + 1, 2) as CampaignStep);
  const handleBack = () => setStep((s) => Math.max(s - 1, 1) as CampaignStep);

  const updateData = (data: Partial<CampaignFormData>) => setFormData(prev => ({ ...prev, ...data }));

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.name || !formData.templateId) {
      showToast("Name and Template are required.", "error");
      return;
    }
    try {
      setIsSubmitting(true);
      await api.createCampaign({
        campaign_name: formData.name,
        description: formData.subject,
        template_id: formData.templateId,
        audience_data_source: 'csv',
        status: status
      });
      showToast(`Campaign ${status === 'published' ? 'published' : 'saved'} successfully!`, "success");
      onCancel();
    } catch (err) {
      console.error(err);
      showToast(`Failed to ${status === 'published' ? 'publish' : 'save'} campaign`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header 
        title="New Campaign" 
        subtitle={`Step ${step} of 2`} 
      />
      <div style={{ padding: '0 2rem 4rem' }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          backgroundColor: '#1E1F26', 
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)'
        }}>
          {/* Progress Bar */}
          <div style={{ height: '4px', backgroundColor: '#0C0E14', display: 'flex' }}>
            <div style={{ 
              width: `${(step / 2) * 100}%`, 
              backgroundColor: '#4EDE93', 
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} />
          </div>

          <div style={{ padding: '2rem' }}>
            {step === 1 && <Step1 data={formData} onChange={updateData} />}
            {step === 2 && <Step2 data={formData} templates={templates} onChange={updateData} />}

            {/* Footer Actions */}
            <div style={{ 
              marginTop: '4rem', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Button variant="tertiary" onClick={step === 1 ? onCancel : handleBack} disabled={isSubmitting}>
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {step === 2 ? (
                  <>
                    <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={isSubmitting}>
                      <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmit('published')} disabled={isSubmitting}>
                      <Send size={18} /> {isSubmitting ? 'Publishing...' : 'Publish Campaign'}
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={handleNext}>
                    Next <ChevronRight size={18} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

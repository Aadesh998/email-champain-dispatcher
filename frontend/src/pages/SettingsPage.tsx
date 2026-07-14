import React, { useEffect, useState } from 'react';
import { Save, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button, FormGroup } from '../components/ui';
import { Header } from '../components/layout';
import { api } from '../config';
import { useNotification } from '../components/ui/NotificationProvider';

export const SettingsPage: React.FC = () => {
  const [configured, setConfigured] = useState(false);
  const [fromEmail, setFromEmail] = useState('');
  const [password, setPassword] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('587');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useNotification();

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await api.getSmtpSettings();
        setConfigured(settings.configured);
        if (settings.configured) {
          setFromEmail(settings.from_email);
          setHost(settings.host);
          setPort(String(settings.port));
        }
      } catch (err) {
        console.error('Failed to load SMTP settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!fromEmail || !host || !port) {
      showToast('Sender email, host and port are required.', 'error');
      return;
    }
    if (!configured && !password) {
      showToast('Password is required for the first setup.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const saved = await api.updateSmtpSettings({
        from_email: fromEmail,
        password,
        host,
        port: parseInt(port, 10),
      });
      setConfigured(saved.configured);
      setPassword('');
      showToast('Email settings saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save email settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header
        title="Settings"
        subtitle="Configure the email account your campaigns are sent from"
      />
      <div style={{ padding: '0 2rem 4rem' }}>
        <div
          style={{
            maxWidth: '640px',
            backgroundColor: '#1E1F26',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={24} color="#4EDE93" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>SMTP Credentials</h2>
          </div>

          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#0C0E14',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: `1px solid ${configured ? 'rgba(78, 222, 147, 0.4)' : 'rgba(255, 180, 80, 0.4)'}`,
              fontSize: '0.9rem',
            }}
          >
            {configured ? (
              <>
                <CheckCircle2 size={18} color="#4EDE93" />
                <span>Email sending is configured.</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} color="#FFB450" />
                <span>Not configured yet — campaigns cannot be sent until you save credentials.</span>
              </>
            )}
          </div>

          {!isLoading && (
            <>
              <FormGroup label="Sender Email">
                <input
                  type="email"
                  placeholder="you@yourdomain.com"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  style={{ width: '100%' }}
                />
              </FormGroup>

              <FormGroup label={configured ? 'Password (leave blank to keep current)' : 'Password / App Password'}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%' }}
                />
              </FormGroup>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <FormGroup label="SMTP Host">
                    <input
                      placeholder="smtp.gmail.com"
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </FormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  <FormGroup label="Port">
                    <input
                      type="number"
                      placeholder="587"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </FormGroup>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

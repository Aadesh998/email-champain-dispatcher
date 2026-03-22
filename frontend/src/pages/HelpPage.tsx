import React from 'react';
import { HelpCircle, FileSpreadsheet, Mail, Database, Info, Layers, Code2 } from 'lucide-react';
import { Header } from '../components/layout';

export const HelpPage: React.FC = () => {
  return (
    <>
      <Header 
        title="Knowledge Center" 
        subtitle="Learn how to architect your communication flow with precision." 
      />
      <div style={{ padding: '0 2rem 4rem', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* CSV Structure Info */}
        <section style={{ 
          backgroundColor: '#1E1F26', 
          borderRadius: 'var(--radius-default)', 
          padding: '2rem',
          border: '1px solid rgba(78, 222, 147, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <FileSpreadsheet size={32} color="#4EDE93" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>CSV Audience Structure</h2>
          </div>
          
          <p style={{ color: '#BBCABF', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            To ensure successful delivery, your CSV file must follow a specific architecture. The system parses each row and maps data to your template using positional formatting.
          </p>

          <div style={{ 
            backgroundColor: '#0C0E14', 
            padding: '1.5rem', 
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#4EDE93', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} /> Mandatory: The 'email' Column
            </h3>
            <p style={{ color: '#BBCABF', fontSize: '0.9rem' }}>
              The **first column** of your CSV should always be named <code>email</code>. This is the primary key used for delivery and is NOT used as a template variable.
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#191B22', 
            padding: '1rem', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: '#E2E2EB',
            overflowX: 'auto'
          }}>
            email,name,company,city<br/>
            john@example.com,John Doe,Acme Corp,New York<br/>
            jane@example.com,Jane Smith,Global Tech,London
          </div>
        </section>

        {/* Dynamic Variables Info */}
        <section style={{ 
          backgroundColor: '#1E1F26', 
          borderRadius: 'var(--radius-default)', 
          padding: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Code2 size={32} color="#4EDE93" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Positional Formatting (%s, %d)</h2>
          </div>
          <p style={{ color: '#BBCABF', lineHeight: '1.6', marginBottom: '1rem' }}>
            Instead of named variables, this system uses Go-style positional format verbs. Each verb in your template corresponds to a column in your CSV (excluding the first 'email' column).
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#0C0E14', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ color: '#4EDE93', fontWeight: '600', marginBottom: '0.5rem' }}>Common Verbs:</p>
              <ul style={{ color: '#BBCABF', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li><code>%s</code> &rarr; String (Use for names, text, etc.)</li>
                <li><code>%v</code> &rarr; Value (General purpose fallback)</li>
                <li><code>%d</code> &rarr; Decimal Integer (Use for numbers)</li>
              </ul>
            </div>

            <div style={{ borderLeft: '3px solid #4EDE93', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <p style={{ color: '#E2E2EB', fontWeight: '600' }}>How it works:</p>
              <p style={{ color: '#BBCABF', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                If your CSV columns are: <code>email, name, city</code><br/>
                A template like <code>"Hello %s, welcome to %s!"</code> will map:<br/>
                1st <code>%s</code> &rarr; <code>name</code> (Column 2)<br/>
                2nd <code>%s</code> &rarr; <code>city</code> (Column 3)
              </p>
            </div>
          </div>
        </section>

        {/* System Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
           <div style={{ backgroundColor: '#1E1F26', padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Layers size={20} color="#4EDE93" />
                <h4 style={{ fontWeight: '700' }}>Rate Limiting</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#BBCABF', lineHeight: '1.5' }}>
                The system uses an intelligent queuing mechanism to prevent IP blacklisting. Large campaigns may be throttled to ensure 100% deliverability.
              </p>
           </div>
           <div style={{ backgroundColor: '#1E1F26', padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Mail size={20} color="#4EDE93" />
                <h4 style={{ fontWeight: '700' }}>HTML Templates</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#BBCABF', lineHeight: '1.5' }}>
                Full HTML support is enabled. For best results, use inline styles and standard table layouts to ensure compatibility across all email clients.
              </p>
           </div>
        </div>
      </div>
    </>
  );
};

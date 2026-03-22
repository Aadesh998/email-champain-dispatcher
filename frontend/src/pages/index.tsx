import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Plus, 
  Send, 
  Archive, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  BarChart3,
  Calendar,
  Edit3,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Play
} from 'lucide-react';
import { Template, Campaign } from '../types';
import { Button } from '../components/ui';
import { Header } from '../components/layout';
import { api } from '../config';
import { TemplateModal } from '../components/ui/TemplateModal';
import { SendCampaignModal } from '../components/ui/SendCampaignModal';
import { CampaignModal } from '../components/ui/CampaignModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useNotification } from '../components/ui/NotificationProvider';

export const TemplatesPage: React.FC<{ isDraft?: boolean }> = ({ isDraft }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { showToast } = useNotification();

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = isDraft 
        ? await api.getDraftTemplates()
        : await api.getTemplates();
      setTemplates(res.templates || []);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteTemplate(deleteConfirmId);
      showToast("Template deleted successfully", "success");
      fetchTemplates();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete template", "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleEdit = (t: Template) => {
    setEditingTemplate(t);
    setShowModal(true);
  };

  useEffect(() => {
    fetchTemplates();
  }, [isDraft]);

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
      <Header 
        title={isDraft ? "Draft Templates" : "Templates"} 
        subtitle={isDraft ? "Review and finalize your email blueprints." : "Manage your email blueprints with editorial precision."} 
        actions={
          !isDraft && (
            <Button variant="primary" onClick={() => { setEditingTemplate(null); setShowModal(true); }}>
              <Plus size={20} /> New Template
            </Button>
          )
        }
      />
      
      <div style={{ padding: '0 2rem 1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#BBCABF' }} />
          <input 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '3rem', backgroundColor: '#1E1F26', border: '1px solid rgba(255,255,255,0.05)' }}
          />
        </div>
      </div>

      <div style={{ padding: '0 2rem 4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#BBCABF' }}>Loading...</div>
        ) : filteredTemplates.length > 0 ? (
          filteredTemplates.map((t) => (
            <TemplateCard key={t.id} template={t} onEdit={handleEdit} onDelete={(id) => setDeleteConfirmId(id)} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#BBCABF' }}>
             <Archive size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
             <p>No templates matching your criteria.</p>
          </div>
        )}
      </div>

      {showModal && (
        <TemplateModal 
          template={editingTemplate}
          onClose={() => { setShowModal(false); setEditingTemplate(null); }} 
          onSuccess={() => fetchTemplates()} 
        />
      )}

      {deleteConfirmId && (
        <ConfirmModal 
          title="Delete Template"
          message="Are you sure you want to permanently remove this template? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </>
  );
};

function TemplateCard({ template, onEdit, onDelete }: { template: Template, onEdit: (t: Template) => void, onDelete: (id: number) => void }) {
  return (
    <div style={{ 
      backgroundColor: '#1E1F26', 
      borderRadius: 'var(--radius-default)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.03)',
      transition: 'all 0.2s ease',
      position: 'relative'
    }}>
      <div style={{ padding: '1.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#0C0E14', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="#4EDE93" />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => onEdit(template)}
              style={{ background: 'rgba(78, 222, 147, 0.1)', color: '#4EDE93', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => onDelete(template.id)}
              style={{ background: 'rgba(255, 180, 171, 0.1)', color: '#FFB4AB', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>{template.name}</h3>
        <p style={{ color: '#BBCABF', fontSize: '0.85rem', marginBottom: '1rem' }}>Subject: {template.subject}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#BBCABF' }}>
          <span style={{ 
            padding: '0.2rem 0.5rem', 
            borderRadius: '4px', 
            backgroundColor: template.status === 'published' ? 'rgba(78, 222, 147, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            color: template.status === 'published' ? '#4EDE93' : '#BBCABF',
            textTransform: 'uppercase',
            fontWeight: '700'
          }}>
            {template.status}
          </span>
          <span>•</span>
          <span>{new Date(template.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div 
        style={{ 
          backgroundColor: '#191B22', 
          padding: '1rem 1.5rem', 
          fontSize: '0.8rem', 
          color: '#4EDE93', 
          borderTop: '1px solid rgba(255,255,255,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={() => onEdit(template)}
      >
        <span>View Full Architect View</span>
        <ExternalLink size={14} />
      </div>
    </div>
  );
}

export const CampaignsPage: React.FC<{ onCreateClick?: () => void, isDraft?: boolean }> = ({ onCreateClick, isDraft }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sendingCampaign, setSendingCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { showToast } = useNotification();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = isDraft 
        ? await api.getDraftCampaigns()
        : await api.getCampaigns();
      setCampaigns(res.campaigns || []);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteCampaign(deleteConfirmId);
      showToast("Campaign deleted successfully", "success");
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete campaign", "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    
    // Add polling if any campaign is in progress
    let interval: any;
    const hasInProgress = campaigns.some(c => c.status === 'in_progress');
    
    if (hasInProgress) {
      interval = setInterval(() => {
        // Fetch without showing the main loader to prevent flicker
        const poll = async () => {
          try {
            const res = isDraft 
              ? await api.getDraftCampaigns()
              : await api.getCampaigns();
            setCampaigns(res.campaigns || []);
          } catch (err) {
            console.error("Polling error:", err);
          }
        };
        poll();
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDraft, campaigns.some(c => c.status === 'in_progress')]);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Header 
        title={isDraft ? "Draft Campaigns" : "Campaigns"} 
        subtitle={isDraft ? "Pick up where you left off with your campaigns." : "Monitor and deploy your communication strategies."} 
        actions={
          !isDraft && (
            <Button variant="primary" onClick={onCreateClick}>
              <Plus size={20} /> Create Campaign
            </Button>
          )
        }
      />

      <div style={{ padding: '0 2rem 1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#BBCABF' }} />
          <input 
            placeholder="Search campaigns..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '3rem', backgroundColor: '#1E1F26', border: '1px solid rgba(255,255,255,0.05)' }}
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#BBCABF' }} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ paddingLeft: '3rem', backgroundColor: '#1E1F26', border: '1px solid rgba(255,255,255,0.05)', color: '#E2E2EB', height: '100%', borderRadius: 'var(--radius-sm)' }}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div style={{ padding: '0 2rem 4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#BBCABF' }}>Loading...</div>
        ) : filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((c) => (
             <CampaignCard 
                key={c.id} 
                campaign={c} 
                onSend={() => setSendingCampaign(c)} 
                onEdit={() => setEditingCampaign(c)}
                onDelete={() => setDeleteConfirmId(c.id)}
             />
          ))
        ) : (
          <div style={{ backgroundColor: '#1E1F26', padding: '4rem', borderRadius: 'var(--radius-default)', textAlign: 'center' }}>
            <Archive size={48} style={{ opacity: 0.2, marginBottom: '1rem', color: '#BBCABF' }} />
            <p style={{ color: '#BBCABF' }}>No campaigns found.</p>
          </div>
        )}
      </div>

      {sendingCampaign && (
        <SendCampaignModal 
          campaign={sendingCampaign} 
          onClose={() => setSendingCampaign(null)} 
          onSuccess={() => fetchCampaigns()} 
        />
      )}

      {editingCampaign && (
        <CampaignModal 
          campaign={editingCampaign} 
          onClose={() => setEditingCampaign(null)} 
          onSuccess={() => fetchCampaigns()} 
        />
      )}

      {deleteConfirmId && (
        <ConfirmModal 
          title="Delete Campaign"
          message="Are you sure you want to permanently remove this campaign? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </>
  );
};

function CampaignCard({ campaign, onSend, onEdit, onDelete }: { campaign: Campaign, onSend: () => void, onEdit: () => void, onDelete: () => void }) {
  const isCompleted = campaign.status === 'completed';
  const isSending = campaign.status === 'in_progress';
  const isPublished = campaign.status === 'published';
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div style={{ 
      backgroundColor: '#1E1F26', 
      borderRadius: 'var(--radius-default)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.03)',
      transition: 'all 0.2s ease',
      cursor: 'default'
    }}>
      <div style={{ height: '3px', backgroundColor: '#0C0E14', width: '100%' }}>
        <div style={{ 
          height: '100%', 
          width: `${campaign.progress_percentage}%`, 
          backgroundColor: '#4EDE93',
          boxShadow: '0 0 10px rgba(78, 222, 147, 0.4)'
        }} />
      </div>

      <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.01em' }}>{campaign.campaign_name}</h3>
            <span style={{ 
              fontSize: '0.7rem', 
              textTransform: 'uppercase', 
              fontWeight: '800', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '99px',
              backgroundColor: 
                campaign.status === 'completed' ? 'rgba(78, 222, 147, 0.1)' : 
                campaign.status === 'published' ? 'rgba(78, 222, 147, 0.2)' :
                campaign.status === 'in_progress' ? 'rgba(78, 222, 147, 0.1)' :
                'rgba(255, 180, 171, 0.1)',
              color: 
                campaign.status === 'completed' ? '#4EDE93' : 
                campaign.status === 'published' ? '#4EDE93' :
                campaign.status === 'in_progress' ? '#4EDE93' :
                '#FFB4AB',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              {isSending && <div className="pulse-dot" style={{ width: '6px', height: '6px' }} />}
              {campaign.status}
            </span>
          </div>
          <p style={{ color: '#BBCABF', fontSize: '0.9rem', maxWidth: '600px', lineHeight: '1.5' }}>{campaign.description}</p>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
           <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={onEdit}
                style={{ background: 'rgba(78, 222, 147, 0.1)', color: '#4EDE93', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Edit3 size={16} />
              </button>
              <button 
                onClick={onDelete}
                style={{ background: 'rgba(255, 180, 171, 0.1)', color: '#FFB4AB', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {isPublished && (
                <Button variant="primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={onSend}>
                    <Play size={16} fill="currentColor" /> Send Now
                </Button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#BBCABF', fontSize: '0.8rem' }}>
                <Calendar size={14} />
                {formatDate(campaign.created_at)}
              </div>
           </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        backgroundColor: '#191B22', 
        padding: '1.25rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.02)'
      }}>
        <Metric label="TOTAL AUDIENCE" value={campaign.total_emails} icon={<Users size={16} />} color="#E2E2EB" />
        <Metric label="SENT SUCCESSFULLY" value={campaign.sent_emails} icon={<CheckCircle2 size={16} />} color="#4EDE93" />
        <Metric label="DELIVERY FAILURES" value={campaign.failed_emails} icon={<AlertCircle size={16} />} color="#FFB4AB" />
        <Metric label="EST. TIME" value={campaign.estimated_time} icon={<Clock size={16} />} color="#BBCABF" />
      </div>
    </div>
  );
}

function Metric({ label, value, icon, color }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ color: '#BBCABF', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.08em' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: color }}>
        {icon}
        <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{value}</span>
      </div>
    </div>
  );
}

import { TemplatePaginationResponse, CampaignPaginationResponse, Template, Campaign } from './types';

const API_BASE = '/api';

export const api = {
  // Templates
  getTemplates: async (lastId = 0, limit = 10): Promise<TemplatePaginationResponse> => {
    const res = await fetch(`${API_BASE}/template/?last_id=${lastId}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },
  getDraftTemplates: async (lastId = 0, limit = 10): Promise<TemplatePaginationResponse> => {
    const res = await fetch(`${API_BASE}/template/draft?last_id=${lastId}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch draft templates');
    return res.json();
  },
  getTemplate: async (id: number): Promise<Template> => {
    const res = await fetch(`${API_BASE}/template/${id}`);
    if (!res.ok) throw new Error('Failed to fetch template');
    return res.json();
  },
  createTemplate: async (data: { name: string; subject: string; body: string; status: string }) => {
    const res = await fetch(`${API_BASE}/template/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create template');
    return res.json();
  },
  updateTemplate: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE}/template/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update template');
    return res.json();
  },
  deleteTemplate: async (id: number) => {
    const res = await fetch(`${API_BASE}/template/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete template');
    return res.json();
  },

  // Campaigns
  getCampaigns: async (lastId = 0, limit = 10): Promise<CampaignPaginationResponse> => {
    const res = await fetch(`${API_BASE}/campaign/?last_id=${lastId}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    return res.json();
  },
  getDraftCampaigns: async (lastId = 0, limit = 10): Promise<CampaignPaginationResponse> => {
    const res = await fetch(`${API_BASE}/campaign/draft?last_id=${lastId}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch draft campaigns');
    return res.json();
  },
  getCampaign: async (id: number): Promise<Campaign> => {
    const res = await fetch(`${API_BASE}/campaign/${id}`);
    if (!res.ok) throw new Error('Failed to fetch campaign');
    return res.json();
  },
  createCampaign: async (data: { campaign_name: string; description?: string; template_id: number; audience_data_source: string; status?: string }) => {
    const res = await fetch(`${API_BASE}/campaign/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create campaign');
    return res.json();
  },
  sendCampaign: async (id: number, formData: FormData) => {
    const res = await fetch(`${API_BASE}/campaign/${id}/send`, {
      method: 'POST',
      body: formData, // FormData automatically sets multipart/form-data boundary
    });
    if (!res.ok) throw new Error('Failed to send campaign');
    return res.json();
  },
  updateCampaign: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE}/campaign/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update campaign');
    return res.json();
  },
  deleteCampaign: async (id: number) => {
    const res = await fetch(`${API_BASE}/campaign/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete campaign');
    return res.json();
  },
};

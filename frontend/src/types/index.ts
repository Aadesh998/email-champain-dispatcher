export type View = 'templates' | 'campaigns' | 'draft-templates' | 'draft-campaigns' | 'help' | 'settings';
export type CampaignStep = 1 | 2;

export interface Template {
  id: number;
  name: string;
  subject: string;
  status: string;
  body: string;
  created_at: string;
}

export interface Campaign {
  id: number;
  campaign_name: string;
  description: string;
  status: string;
  total_emails: number;
  sent_emails: number;
  failed_emails: number;
  estimated_time: string;
  progress_percentage: number;
  failure_percentage: number;
  template_id: number;
  audience_data_source: string;
  created_at: string;
}

export interface CampaignFormData {
  name: string;
  subject: string;
  sender: string;
  templateId: number | null;
  csvFile: File | null;
}

export interface PaginatedResponse<T> {
  data: T[]; // Assuming standard wrapper or we use the specific properties
  // The actual structure from DTO is `campaigns: []` and `templates: []`, let's define specific ones.
}

export interface SmtpSettings {
  configured: boolean;
  from_email: string;
  host: string;
  port: number;
}

export interface TemplatePaginationResponse {
  templates: Template[];
  next_id?: number;
}

export interface CampaignPaginationResponse {
  campaigns: Campaign[];
  next_id?: number;
}

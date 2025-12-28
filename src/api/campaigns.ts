import api from './api';

export interface AudienceFilter {
  source: 'contacts' | 'leads';
  filters: {
    status?: string[];
    tags?: string[];
    createdAtFrom?: string;
    createdAtTo?: string;
    hasEmail?: boolean;
    priority?: string[];
    leadSource?: string[];
  };
}

export interface Campaign {
  id: number;
  name: string;
  subject: string;
  previewText?: string;
  senderName: string;
  senderEmail: string;
  htmlContent: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  provider: 'brevo' | 'ses' | 'resend';
  scheduledAt?: string;
  audienceFilters: AudienceFilter;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  subject: string;
  previewText?: string;
  senderName: string;
  senderEmail: string;
  htmlContent: string;
  scheduledAt?: string;
  audienceFilters: AudienceFilter;
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {
  status?: string;
}

export interface CampaignStats {
  campaign: Campaign;
  stats: {
    totalRecipients: number;
    sent: number;
    failed: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  };
  recentEvents: any[];
}

export const campaignsApi = {
  getAll: async () => {
    const response = await api.get<Campaign[]>('/campaigns');
    return response.data;
  },

  getOne: async (id: number) => {
    const response = await api.get<Campaign>(`/campaigns/${id}`);
    return response.data;
  },

  create: async (data: CreateCampaignDto) => {
    const response = await api.post<Campaign>('/campaigns', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCampaignDto) => {
    const response = await api.patch<Campaign>(`/campaigns/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/campaigns/${id}`);
  },

  duplicate: async (id: number) => {
    const response = await api.post<Campaign>(`/campaigns/${id}/duplicate`);
    return response.data;
  },

  send: async (id: number, immediate = true) => {
    const response = await api.post<{ success: boolean; message: string }>(`/campaigns/${id}/send`, {
      immediate,
    });
    return response.data;
  },

  getStats: async (id: number) => {
    const response = await api.get<CampaignStats>(`/campaigns/${id}/stats`);
    return response.data;
  },

  estimateAudience: async (filters: AudienceFilter) => {
    const response = await api.post<{ estimatedCount: number }>('/campaigns/estimate-audience', {
      audienceFilters: filters,
    });
    return response.data;
  },

  getUnsubscribed: async (page = 1, limit = 50) => {
    const response = await api.get<{ items: any[]; total: number }>('/campaigns/settings/unsubscribed', {
      params: { page, limit },
    });
    return response.data;
  },

  addUnsubscribed: async (email: string, reason?: string) => {
    const response = await api.post('/campaigns/settings/unsubscribed', { email, reason });
    return response.data;
  },

  removeUnsubscribed: async (email: string) => {
    await api.delete(`/campaigns/settings/unsubscribed/${email}`);
  },
};

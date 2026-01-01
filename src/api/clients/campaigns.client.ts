import api from '../api';
import type { AudienceFilter, Campaign, CreateCampaignDto, UpdateCampaignDto } from '../../types/campaign.types';

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

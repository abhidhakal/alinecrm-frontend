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

export type CreateCampaignDto = {
  name: string;
  subject: string;
  previewText?: string;
  senderName: string;
  senderEmail: string;
  htmlContent: string;
  scheduledAt?: string;
  audienceFilters: AudienceFilter;
};

export type UpdateCampaignDto = Partial<CreateCampaignDto> & {
  status?: string;
};

export interface EmailTemplate {
  id: number;
  name: string;
  subject?: string;
  suggestedTitle?: string;
  htmlContent: string;
  description?: string;
  institutionId: number | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateTemplateDto = {
  name: string;
  subject?: string;
  suggestedTitle?: string;
  htmlContent: string;
  description?: string;
};

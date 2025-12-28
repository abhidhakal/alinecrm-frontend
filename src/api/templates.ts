import api from './api';

export interface EmailTemplate {
  id: number;
  name: string;
  subject?: string;
  suggestedTitle?: string;
  htmlContent: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  name: string;
  subject?: string;
  suggestedTitle?: string;
  htmlContent: string;
  description?: string;
}

export const templatesApi = {
  getAll: () => api.get<EmailTemplate[]>('/templates').then(res => res.data),
  getOne: (id: number) => api.get<EmailTemplate>(`/templates/${id}`).then(res => res.data),
  create: (data: CreateTemplateDto) => api.post<EmailTemplate>('/templates', data).then(res => res.data),
  update: (id: number, data: Partial<CreateTemplateDto>) => api.patch<EmailTemplate>(`/templates/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/templates/${id}`).then(res => res.data),
};

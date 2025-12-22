import api from './api';

export interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  source?: string;
  potentialValue?: number;
  probability?: number;
  notes?: string;
  contactId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
  status?: string;
  source?: string;
  potentialValue?: number;
  probability?: number;
  notes?: string;
  contactId?: number;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}

export const leadsApi = {
  getAll: async () => {
    const response = await api.get<Lead[]>('/leads');
    return response.data;
  },

  create: async (data: CreateLeadDto) => {
    const response = await api.post<Lead>('/leads', data);
    return response.data;
  },

  update: async (id: number, data: UpdateLeadDto) => {
    const response = await api.patch<Lead>(`/leads/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/leads/${id}`);
  },
};

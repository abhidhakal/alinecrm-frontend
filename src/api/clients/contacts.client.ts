import api from '../api';
import type { Contact, CreateContactDto } from '../../types/contact.types';

export const contactsApi = {
  getAll: async (): Promise<Contact[]> => {
    const response = await api.get('/contacts');
    return response.data;
  },

  getOne: async (id: number): Promise<Contact> => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  create: async (data: CreateContactDto): Promise<Contact> => {
    const response = await api.post('/contacts', data);
    return response.data;
  },

  bulkCreate: async (data: CreateContactDto[]): Promise<Contact[]> => {
    const response = await api.post('/contacts/bulk', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateContactDto>): Promise<Contact> => {
    const response = await api.patch(`/contacts/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },

  bulkDelete: async (ids: number[]): Promise<void> => {
    await api.post('/contacts/delete-bulk', { ids });
  }
};

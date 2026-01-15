import api from './api';

export interface InstitutionSettings {
  id: number;
  name: string;
  weekendDays: number[];
}

export const institutionsApi = {
  getSettings: async (): Promise<InstitutionSettings> => {
    const response = await api.get('/institutions/settings');
    return response.data;
  },

  updateWeekendDays: async (weekendDays: number[]): Promise<{ message: string; weekendDays: number[] }> => {
    const response = await api.patch('/institutions/weekend-days', { weekendDays });
    return response.data;
  },
};

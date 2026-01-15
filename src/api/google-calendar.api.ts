import api from './api';

export const googleCalendarApi = {
  getConnectUrl: async () => {
    const response = await api.get<{ url: string }>('/google-calendar/connect');
    return response.data;
  },

  disconnect: async () => {
    const response = await api.post('/google-calendar/disconnect');
    return response.data;
  },

  syncTasks: async () => {
    const response = await api.post<{ synced: number; failed: number }>('/google-calendar/sync');
    return response.data;
  }
};

import api from './api';

export interface MindfulnessThought {
  id: number;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

export const mindfulnessApi = {
  getTodayThought: async () => {
    const response = await api.get('/mindfulness/today');
    return response.data as MindfulnessThought | null;
  },

  saveThought: async (data: { content: string; isPinned: boolean }) => {
    const response = await api.post('/mindfulness/thought', data);
    return response.data as MindfulnessThought;
  },

  getPinnedThought: async () => {
    const response = await api.get('/mindfulness/pinned');
    return response.data as MindfulnessThought | null;
  },
};

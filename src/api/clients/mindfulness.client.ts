import api from '../api';

export interface MindfulnessResource {
  id: number;
  title: string;
  url: string;
  type: 'Ambient Sound' | 'Music' | 'Meditation';
  icon?: string;
  isActive: boolean;
}

export const mindfulnessApi = {
  getAllResources: async () => {
    const response = await api.get<MindfulnessResource[]>('/mindfulness/resources');
    return response.data;
  },
};

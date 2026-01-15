import api from './api';

export interface SocialChannel {
  id: number;
  platform: string;
  handle: string;
}

export interface SocialPost {
  id: number;
  content: string;
  platforms: string[];
  createdAt: string;
}

export const socialApi = {
  getChannels: async () => {
    const response = await api.get('/social/channels');
    return response.data as SocialChannel[];
  },

  addChannel: async (data: { platform: string; handle: string }) => {
    const response = await api.post('/social/channels', data);
    return response.data as SocialChannel;
  },

  deleteChannel: async (id: number) => {
    const response = await api.delete(`/social/channels/${id}`);
    return response.data;
  },

  getRecentPosts: async () => {
    const response = await api.get('/social/posts');
    return response.data as SocialPost[];
  },

  logPost: async (data: { content: string; platforms: string[] }) => {
    const response = await api.post('/social/log-post', data);
    return response.data as SocialPost;
  },
};

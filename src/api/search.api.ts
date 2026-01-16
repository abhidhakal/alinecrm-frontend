import API from '../lib/axios';

export interface SearchResult {
  id: number;
  type: 'lead' | 'contact' | 'task' | 'campaign';
  title: string;
  subtitle: string;
  link: string;
  status?: string;
}

export const searchApi = {
  search: async (query: string): Promise<SearchResult[]> => {
    const response = await API.get<SearchResult[]>('/search', {
      params: { q: query }
    });
    return response.data;
  }
};

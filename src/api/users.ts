import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
};

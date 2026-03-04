import api from '@/lib/api';
import { User, TokenResponse } from '@/types';

export const authService = {
  register: async (email: string, password: string, full_name: string): Promise<TokenResponse> => {
    const response = await api.post('/api/auth/register', {
      email,
      password,
      full_name,
    });
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  login: async (email: string, password: string): Promise<TokenResponse> => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

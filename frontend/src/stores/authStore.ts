import { create } from 'zustand';

interface User {
  id: number;
  phone: string;
  name: string;
  certCategory?: string;
  isAdmin?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || 'mock-token',
  user: JSON.parse(localStorage.getItem('user') || '{"id":1,"phone":"13800138000","name":"沈苍"}'),

  login: async (phone: string, _password: string) => {
    const token = 'mock-token-' + Date.now();
    const user = { id: 1, phone, name: phone === '13800138000' ? '沈苍' : '用户' };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  register: async (data: any) => {
    const token = 'mock-token-' + Date.now();
    const user = { id: 1, phone: data.phone, name: data.name || '用户' };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

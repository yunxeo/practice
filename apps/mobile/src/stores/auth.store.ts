import { create } from 'zustand';
import { UserProfile } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (params: { email: string; password: string; nickname: string; universityId?: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const auth = await authService.login({ email, password });
      set({ user: auth.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (params) => {
    set({ isLoading: true });
    try {
      const auth = await authService.register(params);
      set({ user: auth.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

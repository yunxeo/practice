import * as SecureStore from 'expo-secure-store';
import { api } from './api';
import { AuthResponse, UserProfile } from '../types';

function unwrap<T>(res: { data: { data: T } }): T {
  return res.data.data;
}

export const authService = {
  async register(params: { email: string; password: string; nickname: string; universityId?: string }) {
    const res = await api.post<{ data: AuthResponse }>('/auth/register', params);
    const auth = unwrap(res);
    await storeTokens(auth.accessToken, auth.refreshToken);
    return auth;
  },

  async login(params: { email: string; password: string }) {
    const res = await api.post<{ data: AuthResponse }>('/auth/login', params);
    const auth = unwrap(res);
    await storeTokens(auth.accessToken, auth.refreshToken);
    return auth;
  },

  async getMe(): Promise<UserProfile> {
    const res = await api.get<{ data: UserProfile }>('/auth/me');
    return unwrap(res);
  },

  async logout() {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  },
};

async function storeTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync('access_token', accessToken);
  await SecureStore.setItemAsync('refresh_token', refreshToken);
}

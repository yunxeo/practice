import { api } from './api';
import { AuthResponse, UserProfile } from '../types';
import { secureStorage } from '../utils/secureStorage';

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

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const res = await api.post<{ data: AuthResponse }>('/auth/google', { idToken });
    const auth = unwrap(res);
    await storeTokens(auth.accessToken, auth.refreshToken);
    return auth;
  },

  async logout() {
    await secureStorage.deleteItem('access_token');
    await secureStorage.deleteItem('refresh_token');
  },
};

async function storeTokens(accessToken: string, refreshToken: string) {
  await secureStorage.setItem('access_token', accessToken);
  await secureStorage.setItem('refresh_token', refreshToken);
}

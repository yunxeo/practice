import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { secureStorage } from '../utils/secureStorage';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/v1';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await secureStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await secureStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('no refresh token');

        const { data } = await axios.post<{ data: { accessToken: string } }>(
          `${API_BASE}/auth/refresh`,
          { refreshToken },
        );

        const newToken = data.data.accessToken;
        await secureStorage.setItem('access_token', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        await secureStorage.deleteItem('access_token');
        await secureStorage.deleteItem('refresh_token');
      }
    }

    return Promise.reject(error);
  },
);

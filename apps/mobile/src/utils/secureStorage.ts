import { Platform } from 'react-native';

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const { getItemAsync } = await import('expo-secure-store');
    return getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    const { setItemAsync } = await import('expo-secure-store');
    return setItemAsync(key, value);
  },

  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    const { deleteItemAsync } = await import('expo-secure-store');
    return deleteItemAsync(key);
  },
};

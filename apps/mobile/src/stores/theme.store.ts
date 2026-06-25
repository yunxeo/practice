import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  init: () => Promise<void>;
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark';
  }
  return mode === 'dark';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  isDark: Appearance.getColorScheme() === 'dark',

  setMode: async (mode) => {
    await SecureStore.setItemAsync('theme_mode', mode);
    set({ mode, isDark: resolveIsDark(mode) });
  },

  init: async () => {
    const saved = (await SecureStore.getItemAsync('theme_mode')) as ThemeMode | null;
    const mode = saved ?? 'system';
    set({ mode, isDark: resolveIsDark(mode) });
  },
}));

Appearance.addChangeListener(({ colorScheme }) => {
  const { mode, setMode } = useThemeStore.getState();
  if (mode === 'system') {
    useThemeStore.setState({ isDark: colorScheme === 'dark' });
  }
});

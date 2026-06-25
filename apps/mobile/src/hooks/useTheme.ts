import { useThemeStore } from '../stores/theme.store';
import { LightColors, DarkColors, ColorTokens, Spacing, Radius } from '../utils/colors';

export function useTheme() {
  const isDark = useThemeStore((s) => s.isDark);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const colors: ColorTokens = isDark ? DarkColors : LightColors;

  return { colors, isDark, mode, setMode, Spacing, Radius };
}

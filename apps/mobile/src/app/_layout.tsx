import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../stores/auth.store';
import { useThemeStore } from '../stores/theme.store';
import { useTheme } from '../hooks/useTheme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

function AppLayout() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const initTheme = useThemeStore((s) => s.init);
  const { isDark, colors } = useTheme();

  useEffect(() => {
    fetchMe();
    initTheme();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="professor/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="professor/[id]/review" options={{ presentation: 'modal' }} />
        <Stack.Screen name="university/[id]" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout />
    </QueryClientProvider>
  );
}

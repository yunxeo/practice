import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../stores/auth.store';
import { useThemeStore } from '../stores/theme.store';
import { useTheme } from '../hooks/useTheme';

// Must run at module level — before Expo Router changes the URL via history.replaceState.
// The OAuth popup loads at http://localhost:8081/#id_token=TOKEN, and the router
// would navigate away before welcome.tsx is imported, erasing the token from the URL.
WebBrowser.maybeCompleteAuthSession();

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

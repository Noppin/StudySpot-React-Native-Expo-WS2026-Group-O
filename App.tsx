import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider, focusManager } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppErrorBoundary } from './src/components/AppErrorBoundary';
import { AppNavigator } from './src/navigation/AppNavigator';
import { queryClient } from './src/services/queryClient';

/** Lets TanStack Query refetch stale data when the app returns to the foreground. */
function useAppFocusRefetch() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });
    return () => subscription.remove();
  }, []);
}

export default function App() {
  useAppFocusRefetch();

  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

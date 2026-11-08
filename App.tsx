import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AppErrorBoundary } from './src/components/AppErrorBoundary';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StudySpotProvider } from './src/store/StudySpotContext';

export default function App() {
  return (
    <AppErrorBoundary>
      <StudySpotProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </StudySpotProvider>
    </AppErrorBoundary>
  );
}

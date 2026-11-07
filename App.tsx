import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from './src/navigation/AppNavigator';
import { StudySpotProvider } from './src/store/StudySpotContext';

export default function App() {
  return (
    <StudySpotProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </StudySpotProvider>
  );
}

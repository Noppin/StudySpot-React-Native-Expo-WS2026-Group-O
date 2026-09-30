import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import { LocationDetailsScreen } from '../screens/LocationDetailsScreen';
import type { StudyLocation } from '../types/StudyLocation';

export type RootStackParamList = {
  Home: undefined;
  Details: { location: StudyLocation };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeRoute({ navigation }: any) {
  return (
    <HomeScreen
      onSelectLocation={(location) =>
        navigation.navigate('Details', { location })
      }
    />
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeRoute} />
        <Stack.Screen name="Details" component={LocationDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

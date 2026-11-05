import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '../screens/HomeScreen';
import { LocationDetailsScreen } from '../screens/LocationDetailsScreen';
import { MapScreen } from '../screens/MapScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import type { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home'>
        {(props) => (
          <HomeScreen
            {...props}
            onSelectLocation={(location) => props.navigation.navigate('Details', { location })}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name='Map' component={MapScreen} />
      <Tab.Screen name='Favorites' component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

function HomeRoute({ navigation }: any) {
  return (
    <HomeScreen onSelectLocation={(location) => navigation.navigate('Details', { location })} />
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={MainTabs} />
      <Stack.Screen name='Details' component={LocationDetailsScreen} />
    </Stack.Navigator>
  );
}

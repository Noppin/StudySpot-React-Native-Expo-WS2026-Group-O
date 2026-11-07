import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LocationDetailsScreen } from '../screens/LocationDetailsScreen';
import { NearbyScreen } from '../screens/NearbyScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import type { StudyLocation } from '../types/StudyLocation';
import type { MainTabParamList, RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function ExploreRoute() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <HomeScreen
      onSelectLocation={(location: StudyLocation) =>
        navigation.navigate('Details', { location })
      }
    />
  );
}

function NearbyRoute() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <NearbyScreen
      onSelectLocation={(location: StudyLocation) =>
        navigation.navigate('Details', { location })
      }
    />
  );
}

function SavedRoute() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <FavoritesScreen
      onSelectLocation={(location: StudyLocation) =>
        navigation.navigate('Details', { location })
      }
    />
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      initialRouteName="Explore"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#245C46',
        tabBarInactiveTintColor: '#7B887F',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="Explore" component={ExploreRoute} />
      <Tabs.Screen name="Nearby" component={NearbyRoute} />
      <Tabs.Screen name="Saved" component={SavedRoute} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={LocationDetailsScreen}
        options={{ title: 'Place details', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '../constants/theme';
import { SettingsScreen } from '../screens/SettingsScreen';
import {
  FavoritesStackNavigator,
  HomeStackNavigator,
  MapStackNavigator,
} from './HomeStackNavigator';
import type { MainTabParamList } from './navigationTypes';

type IconName = ComponentProps<typeof Ionicons>['name'];

const Tabs = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, [IconName, IconName]> = {
  HomeTab: ['list-outline', 'list'],
  MapTab: ['map-outline', 'map'],
  FavoritesTab: ['heart-outline', 'heart'],
  Settings: ['options-outline', 'options'],
};

/** Bottom tabs: Home, Map, Favorites, Settings. */
export function AppNavigator() {
  return (
    <Tabs.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.subtle,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.bar,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={icons[route.name][focused ? 1 : 0]} color={color} size={size - 2} />
        ),
      })}
    >
      <Tabs.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tabs.Screen name="MapTab" component={MapStackNavigator} options={{ title: 'Map' }} />
      <Tabs.Screen
        name="FavoritesTab"
        component={FavoritesStackNavigator}
        options={{ title: 'Favorites' }}
      />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
  },
  label: { fontSize: 11, fontWeight: '500' },
});

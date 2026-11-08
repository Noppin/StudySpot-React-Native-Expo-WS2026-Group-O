import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { theme } from '../constants/theme';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LocationDetailsScreen } from '../screens/LocationDetailsScreen';
import { MapScreen } from '../screens/MapScreen';
import type {
  FavoritesStackParamList,
  HomeStackParamList,
  MapStackParamList,
} from './navigationTypes';

const detailsOptions: NativeStackNavigationOptions = {
  title: '',
  headerShadowVisible: false,
  headerTintColor: theme.colors.text,
  headerStyle: { backgroundColor: theme.colors.background },
  headerBackButtonDisplayMode: 'minimal',
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();

/** Home -> Location Details */
export function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeList" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="LocationDetails" component={LocationDetailsScreen} options={detailsOptions} />
    </HomeStack.Navigator>
  );
}

/** Map -> Location Details */
export function MapStackNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="MapView" component={MapScreen} options={{ headerShown: false }} />
      <MapStack.Screen name="LocationDetails" component={LocationDetailsScreen} options={detailsOptions} />
    </MapStack.Navigator>
  );
}

/** Favorites -> Location Details */
export function FavoritesStackNavigator() {
  return (
    <FavoritesStack.Navigator>
      <FavoritesStack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <FavoritesStack.Screen
        name="LocationDetails"
        component={LocationDetailsScreen}
        options={detailsOptions}
      />
    </FavoritesStack.Navigator>
  );
}

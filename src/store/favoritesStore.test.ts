import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../constants/storageKeys';
import type { StudyLocation } from '../types/Location';
import { useFavoritesStore } from './favoritesStore';

const library: StudyLocation = {
  id: 'node-1',
  name: 'Campus Library',
  category: 'Library',
  amenity: 'library',
  osmType: 'node',
  osmId: 1,
  latitude: 48.2,
  longitude: 16.3,
  distanceMeters: 120,
};

beforeEach(() => {
  useFavoritesStore.setState({ favorites: [] });
});

it('toggles a favorite on and off', () => {
  const { toggleFavorite } = useFavoritesStore.getState();

  toggleFavorite(library);
  expect(useFavoritesStore.getState().favorites.map((item) => item.id)).toEqual(['node-1']);

  toggleFavorite(library);
  expect(useFavoritesStore.getState().favorites).toEqual([]);
});

it('does not add duplicates and does not store the distance', () => {
  const { addFavorite } = useFavoritesStore.getState();
  addFavorite(library);
  addFavorite(library);

  const { favorites } = useFavoritesStore.getState();
  expect(favorites).toHaveLength(1);
  expect(favorites[0].distanceMeters).toBeUndefined();
});

it('persists favorites to AsyncStorage so they survive restarts', async () => {
  useFavoritesStore.getState().addFavorite(library);

  const raw = await AsyncStorage.getItem(STORAGE_KEYS.favorites);
  expect(JSON.parse(raw ?? '{}').state.favorites[0].id).toBe('node-1');
});

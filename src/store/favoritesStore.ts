import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '../constants/storageKeys';
import type { StudyLocation } from '../types/Location';

interface FavoritesState {
  favorites: StudyLocation[];
  addFavorite: (location: StudyLocation) => void;
  removeFavorite: (locationId: string) => void;
  toggleFavorite: (location: StudyLocation) => void;
}

/** Distance depends on where the user currently is, so it is never persisted. */
function withoutDistance({ distanceMeters: _distance, ...location }: StudyLocation): StudyLocation {
  return location;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (location) => {
        if (get().favorites.some((item) => item.id === location.id)) return;
        set({ favorites: [...get().favorites, withoutDistance(location)] });
      },
      removeFavorite: (locationId) =>
        set({ favorites: get().favorites.filter((item) => item.id !== locationId) }),
      toggleFavorite: (location) => {
        const { addFavorite, removeFavorite, favorites } = get();
        if (favorites.some((item) => item.id === location.id)) {
          removeFavorite(location.id);
        } else {
          addFavorite(location);
        }
      },
    }),
    {
      name: STORAGE_KEYS.favorites,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);

/** Subscribes only to the favourite state of a single location. */
export function useIsFavorite(locationId: string): boolean {
  return useFavoritesStore((state) => state.favorites.some((item) => item.id === locationId));
}

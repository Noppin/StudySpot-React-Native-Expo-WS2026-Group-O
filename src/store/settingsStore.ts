import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_SETTINGS } from '../constants/studySpot';
import { STORAGE_KEYS } from '../constants/storageKeys';
import type { CategoryFilterValue, LocationMode, Settings } from '../types/Settings';

interface SettingsState extends Settings {
  setSearchRadius: (meters: number) => void;
  setPreferredCategory: (category: CategoryFilterValue) => void;
  setLocationMode: (mode: LocationMode) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setSearchRadius: (searchRadiusMeters) => set({ searchRadiusMeters }),
      setPreferredCategory: (preferredCategory) => set({ preferredCategory }),
      setLocationMode: (locationMode) => set({ locationMode }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ searchRadiusMeters, preferredCategory, locationMode }) => ({
        searchRadiusMeters,
        preferredCategory,
        locationMode,
      }),
    },
  ),
);

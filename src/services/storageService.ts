import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../constants/storageKeys';
import type { StudyLocation } from '../types/Location';

async function readArray<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeArray<T>(key: string, value: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const loadCachedLocations = (): Promise<StudyLocation[]> =>
  readArray<StudyLocation>(STORAGE_KEYS.locationCache);

export const saveCachedLocations = (locations: StudyLocation[]): Promise<void> =>
  writeArray(STORAGE_KEYS.locationCache, locations);

export const clearCachedLocations = (): Promise<void> =>
  AsyncStorage.removeItem(STORAGE_KEYS.locationCache);

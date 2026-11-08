import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../constants/storageKeys';
import type { Coordinates, StudyLocation } from '../types/Location';

/** Last successful API result plus the parameters it was loaded with. */
export interface LocationCache {
  locations: StudyLocation[];
  timestamp: number;
  origin: Coordinates;
  radiusMeters: number;
}

function isLocationCache(value: unknown): value is LocationCache {
  const cache = value as LocationCache | null;
  return (
    !!cache &&
    Array.isArray(cache.locations) &&
    typeof cache.timestamp === 'number' &&
    typeof cache.radiusMeters === 'number' &&
    typeof cache.origin?.latitude === 'number' &&
    typeof cache.origin?.longitude === 'number'
  );
}

export async function loadLocationCache(): Promise<LocationCache | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.locationCache);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isLocationCache(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveLocationCache(cache: LocationCache): Promise<void> {
  const locations = cache.locations.map(({ distanceMeters: _distance, ...location }) => location);
  await AsyncStorage.setItem(STORAGE_KEYS.locationCache, JSON.stringify({ ...cache, locations }));
}

export async function clearLocationCache(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.locationCache);
}

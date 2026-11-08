import type { Coordinates } from '../types/Location';
import type { Settings } from '../types/Settings';

/** Predefined default location (FH Technikum Wien) used when GPS is unavailable. */
export const DEFAULT_LOCATION: Coordinates = {
  latitude: 48.239,
  longitude: 16.3776,
};

export const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
export const API_TIMEOUT_MS = 25_000;

export const SEARCH_RADIUS_OPTIONS = [1000, 2000, 5000, 10000] as const;

export const DEFAULT_SETTINGS: Settings = {
  searchRadiusMeters: 2000,
  preferredCategory: 'All',
  locationMode: 'device',
};

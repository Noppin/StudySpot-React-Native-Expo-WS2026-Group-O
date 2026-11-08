import type { Coordinates } from '../types/Location';
import type { Settings } from '../types/Settings';

/** Predefined default location (FH Technikum Wien) used when GPS is unavailable. */
export const DEFAULT_LOCATION: Coordinates = {
  latitude: 48.239,
  longitude: 16.3776,
};

/** Geoapify Places API (OpenStreetMap data). https://apidocs.geoapify.com/docs/places/ */
export const GEOAPIFY_PLACES_URL = 'https://api.geoapify.com/v2/places';
/**
 * Read from `.env` at build time (see `.env.example`). EXPO_PUBLIC_ values are
 * bundled into the app, so restrict the key in the Geoapify dashboard.
 */
export const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY ?? '';
export const API_TIMEOUT_MS = 15_000;

export const SEARCH_RADIUS_OPTIONS = [1000, 2000, 5000, 10000] as const;

export const DEFAULT_SETTINGS: Settings = {
  searchRadiusMeters: 2000,
  preferredCategory: 'All',
  locationMode: 'device',
};

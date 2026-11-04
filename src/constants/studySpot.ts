import type { Coordinates } from '../types/StudyLocation';

export const FHTW_CAMPUS_LOCATION: Coordinates = {
  latitude: 48.239,
  longitude: 16.3776,
};

export const STUDY_LOCATION_RADIUS_METERS = 6000;
export const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

export const STORAGE_KEYS = {
  locations: '@studyspot/locations/v1',
  favorites: '@studyspot/favorites/v1',
} as const;

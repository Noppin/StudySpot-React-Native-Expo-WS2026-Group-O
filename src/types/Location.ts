/** Categories mapped from the OpenStreetMap amenity tag. */
export type StudyLocationCategory = 'Library' | 'Cafe' | 'University';

export const STUDY_LOCATION_CATEGORIES: readonly StudyLocationCategory[] = [
  'Library',
  'Cafe',
  'University',
];

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface StudyLocation extends Coordinates {
  /** Stable id, e.g. "node-123". */
  id: string;
  name: string;
  category: StudyLocationCategory;
  /** Raw OSM amenity value (library, cafe, university, college). */
  amenity: string;
  osmType: 'node' | 'way' | 'relation';
  osmId: number;
  address?: string;
  website?: string;
  openingHours?: string;
  /** Calculated on the device relative to the current origin; never persisted. */
  distanceMeters?: number;
}

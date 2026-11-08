import type { StudyLocationCategory } from './Location';

/** "All" disables the category filter. */
export type CategoryFilterValue = 'All' | StudyLocationCategory;

/**
 * device  – ask for GPS permission and search around the user.
 * default – never ask; always search around the predefined default location.
 */
export type LocationMode = 'device' | 'default';

export interface Settings {
  searchRadiusMeters: number;
  preferredCategory: CategoryFilterValue;
  locationMode: LocationMode;
}

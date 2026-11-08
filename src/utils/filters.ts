import { STUDY_LOCATION_CATEGORIES, type StudyLocation } from '../types/Location';
import type { CategoryFilterValue } from '../types/Settings';

export interface LocationFilter {
  query: string;
  category: CategoryFilterValue;
}

export const CATEGORY_FILTER_OPTIONS: readonly CategoryFilterValue[] = [
  'All',
  ...STUDY_LOCATION_CATEGORIES,
];

export const EMPTY_FILTER: LocationFilter = { query: '', category: 'All' };

/** Case- and accent-insensitive comparison, so "cafe" also finds "Café". */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function filterLocations(
  locations: StudyLocation[],
  { query, category }: LocationFilter,
): StudyLocation[] {
  const term = normalizeSearchText(query);

  return locations.filter(
    (location) =>
      (category === 'All' || location.category === category) &&
      (!term || normalizeSearchText(location.name).includes(term)),
  );
}

export function isFilterActive({ query, category }: LocationFilter): boolean {
  return query.trim() !== '' || category !== 'All';
}

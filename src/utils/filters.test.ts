import type { StudyLocation, StudyLocationCategory } from '../types/Location';
import { EMPTY_FILTER, filterLocations, isFilterActive } from './filters';

function place(name: string, category: StudyLocationCategory): StudyLocation {
  return {
    id: name,
    name,
    category,
    amenity: category.toLowerCase(),
    osmType: 'node',
    osmId: 1,
    latitude: 48.2,
    longitude: 16.3,
  };
}

const places = [
  place('Hauptbücherei Wien', 'Library'),
  place('Café Central', 'Cafe'),
  place('TU Wien', 'University'),
];

describe('filterLocations', () => {
  it('returns everything for the empty filter', () => {
    expect(filterLocations(places, EMPTY_FILTER)).toHaveLength(3);
  });

  it('searches by name, ignoring case and accents', () => {
    const result = filterLocations(places, { query: 'cafe', category: 'All' });
    expect(result.map((item) => item.name)).toEqual(['Café Central']);
  });

  it('filters by category', () => {
    const result = filterLocations(places, { query: '', category: 'Library' });
    expect(result.map((item) => item.name)).toEqual(['Hauptbücherei Wien']);
  });

  it('combines search and category', () => {
    expect(filterLocations(places, { query: 'wien', category: 'University' })).toHaveLength(1);
    expect(filterLocations(places, { query: 'central', category: 'Library' })).toHaveLength(0);
  });
});

describe('isFilterActive', () => {
  it('is false only for an empty query and "All"', () => {
    expect(isFilterActive(EMPTY_FILTER)).toBe(false);
    expect(isFilterActive({ query: '  ', category: 'All' })).toBe(false);
    expect(isFilterActive({ query: 'tu', category: 'All' })).toBe(true);
    expect(isFilterActive({ query: '', category: 'Cafe' })).toBe(true);
  });
});

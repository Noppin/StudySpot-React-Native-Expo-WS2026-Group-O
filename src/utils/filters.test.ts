import assert from 'node:assert/strict';
import test from 'node:test';

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

const names = (result: StudyLocation[]) => result.map((item) => item.name);

test('returns everything for the empty filter', () => {
  assert.equal(filterLocations(places, EMPTY_FILTER).length, 3);
});

test('searches by name, ignoring case and accents', () => {
  assert.deepEqual(names(filterLocations(places, { query: 'cafe', category: 'All' })), ['Café Central']);
});

test('filters by category and combines it with the search', () => {
  assert.deepEqual(names(filterLocations(places, { query: '', category: 'Library' })), [
    'Hauptbücherei Wien',
  ]);
  assert.equal(filterLocations(places, { query: 'wien', category: 'University' }).length, 1);
  assert.equal(filterLocations(places, { query: 'central', category: 'Library' }).length, 0);
});

test('reports whether a filter is active', () => {
  assert.equal(isFilterActive(EMPTY_FILTER), false);
  assert.equal(isFilterActive({ query: '  ', category: 'All' }), false);
  assert.equal(isFilterActive({ query: 'tu', category: 'All' }), true);
  assert.equal(isFilterActive({ query: '', category: 'Cafe' }), true);
});

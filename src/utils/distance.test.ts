import assert from 'node:assert/strict';
import test from 'node:test';

import { distanceInMeters, formatDistance, sortLocationsByDistance } from './distance';
import type { StudyLocation } from '../types/Location';

test('distanceInMeters returns zero for identical coordinates', () => {
  const point = { latitude: 48.2, longitude: 16.3 };
  assert.equal(distanceInMeters(point, point), 0);
});

test('distanceInMeters calculates a known one-degree equatorial distance', () => {
  const distance = distanceInMeters(
    { latitude: 0, longitude: 0 },
    { latitude: 0, longitude: 1 },
  );

  assert.ok(distance > 111_000 && distance < 112_000);
});

test('sortLocationsByDistance returns nearest places first without mutating input', () => {
  const places: StudyLocation[] = [
    { id: 'far', name: 'Far', category: 'Library', latitude: 1, longitude: 1 },
    { id: 'near', name: 'Near', category: 'Cafe', latitude: 0.001, longitude: 0.001 },
  ];

  const sorted = sortLocationsByDistance(places, { latitude: 0, longitude: 0 });

  assert.deepEqual(sorted.map((place) => place.id), ['near', 'far']);
  assert.equal(places[0].distanceMeters, undefined);
});

test('formatDistance uses metres and kilometres appropriately', () => {
  assert.equal(formatDistance(420), '420 m');
  assert.equal(formatDistance(1250), '1.3 km');
  assert.equal(formatDistance(undefined), undefined);
});

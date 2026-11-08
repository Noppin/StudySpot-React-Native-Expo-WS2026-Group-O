import type { StudyLocation } from '../types/Location';
import { distanceInMeters, formatDistance, sortLocationsByDistance } from './distance';

function place(id: string, latitude: number, longitude: number): StudyLocation {
  return { id, name: id, category: 'Library', amenity: 'library', osmType: 'node', osmId: 1, latitude, longitude };
}

describe('distanceInMeters', () => {
  it('returns zero for identical coordinates', () => {
    const point = { latitude: 48.2, longitude: 16.3 };
    expect(distanceInMeters(point, point)).toBe(0);
  });

  it('calculates a known one-degree equatorial distance', () => {
    const distance = distanceInMeters({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 });
    expect(distance).toBeGreaterThan(111_000);
    expect(distance).toBeLessThan(112_000);
  });
});

describe('sortLocationsByDistance', () => {
  it('returns nearest places first without mutating the input', () => {
    const places = [place('far', 1, 1), place('near', 0.001, 0.001)];
    const sorted = sortLocationsByDistance(places, { latitude: 0, longitude: 0 });

    expect(sorted.map((item) => item.id)).toEqual(['near', 'far']);
    expect(places[0].distanceMeters).toBeUndefined();
  });
});

describe('formatDistance', () => {
  it.each([
    [undefined, undefined],
    [Number.NaN, undefined],
    [420.4, '420 m'],
    [1530, '1.5 km'],
  ])('formats %p as %p', (input, expected) => {
    expect(formatDistance(input)).toBe(expected);
  });
});

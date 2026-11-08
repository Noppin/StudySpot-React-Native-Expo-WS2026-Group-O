import assert from 'node:assert/strict';
import test from 'node:test';

import {
  mapOverpassElement,
  parseOverpassResponse,
} from './overpassService';

test('maps a named library node to a StudyLocation', () => {
  const place = mapOverpassElement({
    type: 'node',
    id: 123,
    lat: 48.2,
    lon: 16.3,
    tags: {
      name: 'Campus Library',
      amenity: 'library',
      'addr:street': 'Example Street',
      'addr:housenumber': '4',
      'addr:city': 'Vienna',
    },
  });

  assert.ok(place);
  assert.equal(place.name, 'Campus Library');
  assert.equal(place.category, 'Library');
  assert.equal(place.address, 'Example Street 4, Vienna');
  assert.equal(place.source, 'openstreetmap');
});

test('uses the centre coordinates for a way and recognises coworking spaces', () => {
  const place = mapOverpassElement({
    type: 'way',
    id: 456,
    center: { lat: 48.21, lon: 16.31 },
    tags: { name: 'Work Hub', office: 'coworking' },
  });

  assert.ok(place);
  assert.equal(place.category, 'Coworking');
  assert.equal(place.latitude, 48.21);
});

test('ignores unnamed or unsupported OSM elements and deduplicates ids', () => {
  const result = parseOverpassResponse({
    elements: [
      { type: 'node', id: 1, lat: 48, lon: 16, tags: { name: 'Library', amenity: 'library' } },
      { type: 'node', id: 1, lat: 48, lon: 16, tags: { name: 'Library', amenity: 'library' } },
      { type: 'node', id: 2, lat: 48, lon: 16, tags: { amenity: 'library' } },
      { type: 'node', id: 3, lat: 48, lon: 16, tags: { name: 'Park', leisure: 'park' } },
    ],
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'node-1');
});

test('rejects a response with an invalid shape', () => {
  assert.throws(() => parseOverpassResponse({ elements: 'invalid' }), /unexpected format/i);
});

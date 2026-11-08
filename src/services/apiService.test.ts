import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ApiError,
  createPlacesUrl,
  fetchStudyLocations,
  mapGeoapifyFeature,
  parseGeoapifyResponse,
  type GeoapifyFeature,
} from './apiService';

const origin = { latitude: 48.2, longitude: 16.3 };
const apiKey = 'test-key';

function response(body: unknown, status = 200): Response {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
}

function library(id = 123): GeoapifyFeature {
  return {
    properties: {
      name: 'Campus Library',
      lat: 48.2,
      lon: 16.3,
      categories: ['education', 'education.library'],
      street: 'Example Street',
      housenumber: '4',
      city: 'Vienna',
      datasource: { raw: { osm_id: id, osm_type: 'n', amenity: 'library' } },
    },
  };
}

test('maps a Geoapify library to a StudyLocation with its OpenStreetMap id', () => {
  const place = mapGeoapifyFeature(library());

  assert.ok(place);
  assert.equal(place.id, 'node-123');
  assert.equal(place.category, 'Library');
  assert.equal(place.address, 'Example Street 4, Vienna');
});

test('deduplicates ids and rejects an invalid response shape', () => {
  assert.deepEqual(
    parseGeoapifyResponse({ features: [library(), library()] }).map((place) => place.id),
    ['node-123'],
  );
  assert.throws(
    () => parseGeoapifyResponse({ features: 'invalid' }),
    (error: unknown) => error instanceof ApiError && error.kind === 'invalid',
  );
});

test('builds a places URL for the study categories within the radius', () => {
  const url = createPlacesUrl(origin, 2000, apiKey);
  assert.match(url, /filter=circle:16\.3,48\.2,2000/);
  assert.match(url, /education\.library/);
});

test('classifies missing keys, network, auth, server and empty failures', async () => {
  const cases: [string, typeof fetch, string][] = [
    ['', (() => Promise.resolve(response({}))) as typeof fetch, 'apiKey'],
    [apiKey, (() => Promise.reject(new TypeError('Network request failed'))) as typeof fetch, 'network'],
    [apiKey, (() => Promise.resolve(response({}, 401))) as typeof fetch, 'apiKey'],
    [apiKey, (() => Promise.resolve(response({}, 503))) as typeof fetch, 'server'],
    [apiKey, (() => Promise.resolve(response({ features: [] }))) as typeof fetch, 'empty'],
  ];

  for (const [key, fetchImpl, kind] of cases) {
    await assert.rejects(
      fetchStudyLocations({ origin, radiusMeters: 1000, fetchImpl, apiKey: key }),
      (error: unknown) => error instanceof ApiError && error.kind === kind,
    );
  }
});

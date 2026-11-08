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

function response(body: unknown, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
}

function feature(overrides: Partial<NonNullable<GeoapifyFeature['properties']>> = {}): GeoapifyFeature {
  return {
    properties: {
      name: 'Campus Library',
      lat: 48.2,
      lon: 16.3,
      categories: ['education', 'education.library'],
      street: 'Example Street',
      housenumber: '4',
      postcode: '1200',
      city: 'Vienna',
      opening_hours: 'Mo-Fr 08:00-20:00',
      datasource: {
        sourcename: 'openstreetmap',
        raw: { osm_id: 123, osm_type: 'n', amenity: 'library', website: 'https://library.example' },
      },
      ...overrides,
    },
  };
}

describe('mapGeoapifyFeature', () => {
  it('maps a library with OSM id, address and details', () => {
    expect(mapGeoapifyFeature(feature())).toEqual({
      id: 'node-123',
      osmType: 'node',
      osmId: 123,
      name: 'Campus Library',
      category: 'Library',
      amenity: 'library',
      latitude: 48.2,
      longitude: 16.3,
      address: 'Example Street 4, 1200 Vienna',
      website: 'https://library.example',
      openingHours: 'Mo-Fr 08:00-20:00',
    });
  });

  it('maps colleges to University and derives the amenity from specific categories', () => {
    const college = mapGeoapifyFeature(
      feature({
        categories: ['education.college'],
        datasource: { raw: { osm_id: 456, osm_type: 'w' } },
      }),
    );
    expect(college).toMatchObject({ id: 'way-456', category: 'University', amenity: 'college' });

    const coffeeShop = mapGeoapifyFeature(
      feature({
        categories: ['catering.cafe.coffee_shop'],
        datasource: { raw: { osm_id: 7, osm_type: 'n' } },
      }),
    );
    expect(coffeeShop).toMatchObject({ category: 'Cafe', amenity: 'cafe' });
  });

  it('ignores unnamed places and places without an OpenStreetMap id', () => {
    expect(mapGeoapifyFeature(feature({ name: undefined, datasource: { raw: { osm_id: 1, osm_type: 'n' } } }))).toBeNull();
    expect(mapGeoapifyFeature(feature({ datasource: { raw: {} } }))).toBeNull();
  });
});

describe('parseGeoapifyResponse', () => {
  it('deduplicates ids and drops unusable features', () => {
    const result = parseGeoapifyResponse({
      features: [feature(), feature(), feature({ name: undefined, datasource: { raw: {} } })],
    });
    expect(result.map((item) => item.id)).toEqual(['node-123']);
  });

  it('rejects a response with an invalid shape', () => {
    expect(() => parseGeoapifyResponse({ features: 'invalid' })).toThrow(
      expect.objectContaining({ kind: 'invalid' }),
    );
  });
});

describe('createPlacesUrl', () => {
  it('requests the study categories within the radius around the origin', () => {
    const url = createPlacesUrl(origin, 2000, apiKey);
    expect(url).toContain('categories=education.library,catering.cafe,education.university,education.college');
    expect(url).toContain('filter=circle:16.3,48.2,2000');
    expect(url).toContain('apiKey=test-key');
  });
});

describe('fetchStudyLocations', () => {
  it.each([
    ['network', () => Promise.reject(new TypeError('Network request failed'))],
    ['server', () => Promise.resolve(response({}, 503))],
    ['apiKey', () => Promise.resolve(response({}, 401))],
    ['invalid', () => Promise.resolve(response({ unexpected: true }))],
    ['empty', () => Promise.resolve(response({ features: [] }))],
  ])('reports %s errors as ApiError', async (kind, fetchImpl) => {
    const error = await fetchStudyLocations({
      origin,
      radiusMeters: 1000,
      apiKey,
      fetchImpl: fetchImpl as typeof fetch,
    }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ kind });
    expect((error as ApiError).message).not.toMatch(/HTTP|503|401/);
  });

  it('reports a missing API key without sending a request', async () => {
    const fetchImpl = jest.fn();

    await expect(
      fetchStudyLocations({ origin, radiusMeters: 1000, apiKey: '', fetchImpl }),
    ).rejects.toMatchObject({ kind: 'apiKey' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('returns mapped locations on success', async () => {
    const fetchImpl = jest.fn(async () => response({ type: 'FeatureCollection', features: [feature()] }));

    const result = await fetchStudyLocations({
      origin,
      radiusMeters: 1000,
      apiKey,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('Library');
  });
});

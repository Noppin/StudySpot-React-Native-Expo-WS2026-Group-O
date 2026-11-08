import { API_TIMEOUT_MS, GEOAPIFY_API_KEY, GEOAPIFY_PLACES_URL } from '../constants/studySpot';
import type { Coordinates, StudyLocation, StudyLocationCategory } from '../types/Location';

export type ApiErrorKind = 'network' | 'timeout' | 'server' | 'invalid' | 'empty' | 'apiKey';

const API_ERROR_MESSAGES: Record<ApiErrorKind, string> = {
  network: 'No internet connection. New places can be loaded once you are back online.',
  timeout: 'The map server took too long to respond. Please try again.',
  server: 'The map server is busy right now. Please try again in a moment.',
  invalid: 'The map server sent an unexpected response.',
  empty: 'No study places found here. Try a larger search radius in Settings.',
  apiKey: 'The places service is not configured: the Geoapify API key is missing or invalid.',
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;

  constructor(kind: ApiErrorKind, cause?: unknown) {
    super(API_ERROR_MESSAGES[kind]);
    this.name = 'ApiError';
    this.kind = kind;
    this.cause = cause;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** User-facing message for any error thrown while loading locations. */
export function getErrorMessage(error: unknown): string {
  return isApiError(error) ? error.message : 'Something went wrong while loading study places.';
}

/** Geoapify place categories requested, mapped to the OpenStreetMap amenity value. */
const GEOAPIFY_CATEGORIES: Record<string, string> = {
  'education.library': 'library',
  'catering.cafe': 'cafe',
  'education.university': 'university',
  'education.college': 'college',
};

const AMENITY_CATEGORIES: Record<string, StudyLocationCategory> = {
  library: 'Library',
  cafe: 'Cafe',
  university: 'University',
  college: 'University',
};

const OSM_TYPES: Record<string, StudyLocation['osmType']> = {
  n: 'node',
  w: 'way',
  r: 'relation',
  node: 'node',
  way: 'way',
  relation: 'relation',
};

/** Geoapify returns at most 500 places per request. */
const GEOAPIFY_LIMIT = 200;

/** The subset of a Geoapify Places feature that the app uses. */
export interface GeoapifyFeature {
  properties?: {
    name?: string;
    lat?: number;
    lon?: number;
    categories?: string[];
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    website?: string;
    opening_hours?: string;
    datasource?: {
      sourcename?: string;
      raw?: Record<string, unknown>;
    };
  };
}

function rawString(raw: Record<string, unknown>, key: string): string | undefined {
  const value = raw[key];
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function amenityOf(categories: string[], raw: Record<string, unknown>): string | undefined {
  const rawAmenity = rawString(raw, 'amenity');
  if (rawAmenity && AMENITY_CATEGORIES[rawAmenity]) return rawAmenity;

  // Categories can be more specific, e.g. "catering.cafe.coffee_shop".
  for (const category of categories) {
    for (const [prefix, amenity] of Object.entries(GEOAPIFY_CATEGORIES)) {
      if (category === prefix || category.startsWith(`${prefix}.`)) return amenity;
    }
  }
  return undefined;
}

/**
 * Maps a Geoapify feature to a StudyLocation. Geoapify serves OpenStreetMap
 * data, so ids stay "node-123" and match favourites saved earlier.
 */
export function mapGeoapifyFeature(feature: GeoapifyFeature): StudyLocation | null {
  const properties = feature.properties ?? {};
  const raw = properties.datasource?.raw ?? {};
  const osmType = OSM_TYPES[rawString(raw, 'osm_type') ?? ''];
  const osmId = Number(raw.osm_id);
  const amenity = amenityOf(properties.categories ?? [], raw);
  const category = amenity ? AMENITY_CATEGORIES[amenity] : undefined;
  const name = (properties.name ?? rawString(raw, 'name'))?.trim();
  const { lat: latitude, lon: longitude } = properties;

  if (
    !osmType ||
    !Number.isSafeInteger(osmId) ||
    !amenity ||
    !category ||
    !name ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return null;
  }

  const street = [properties.street, properties.housenumber].filter(Boolean).join(' ');
  const locality = [properties.postcode, properties.city].filter(Boolean).join(' ');

  return {
    id: `${osmType}-${osmId}`,
    osmType,
    osmId,
    name,
    category,
    amenity,
    latitude,
    longitude,
    address: [street, locality].filter(Boolean).join(', ') || undefined,
    website: properties.website ?? rawString(raw, 'website') ?? rawString(raw, 'contact:website'),
    openingHours: properties.opening_hours ?? rawString(raw, 'opening_hours'),
  };
}

export function parseGeoapifyResponse(payload: unknown): StudyLocation[] {
  const features = (payload as { features?: unknown } | null)?.features;
  if (!Array.isArray(features)) {
    throw new ApiError('invalid');
  }

  const mapped = (features as GeoapifyFeature[])
    .map(mapGeoapifyFeature)
    .filter((location): location is StudyLocation => location !== null);

  return Array.from(new Map(mapped.map((location) => [location.id, location])).values());
}

export function createPlacesUrl(origin: Coordinates, radiusMeters: number, apiKey: string): string {
  const { latitude, longitude } = origin;
  return [
    `${GEOAPIFY_PLACES_URL}?categories=${Object.keys(GEOAPIFY_CATEGORIES).join(',')}`,
    `filter=circle:${longitude},${latitude},${Math.round(radiusMeters)}`,
    `bias=proximity:${longitude},${latitude}`,
    `limit=${GEOAPIFY_LIMIT}`,
    `apiKey=${encodeURIComponent(apiKey)}`,
  ].join('&');
}

interface FetchStudyLocationsOptions {
  origin: Coordinates;
  radiusMeters: number;
  /** Abort signal supplied by TanStack Query when a request is cancelled. */
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  apiKey?: string;
}

/**
 * Loads study locations from the Geoapify Places API.
 * Always rejects with an ApiError so the UI can show an understandable message.
 */
export async function fetchStudyLocations({
  origin,
  radiusMeters,
  signal,
  fetchImpl = fetch,
  apiKey = GEOAPIFY_API_KEY,
}: FetchStudyLocationsOptions): Promise<StudyLocation[]> {
  if (!apiKey) {
    throw new ApiError('apiKey', new Error('EXPO_PUBLIC_GEOAPIFY_API_KEY is not set'));
  }

  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, API_TIMEOUT_MS);
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel);

  try {
    let response: Response;
    try {
      response = await fetchImpl(createPlacesUrl(origin, radiusMeters, apiKey), {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
    } catch (error) {
      if (signal?.aborted) throw error;
      throw new ApiError(timedOut ? 'timeout' : 'network', error);
    }

    if (response.status === 401 || response.status === 403) {
      throw new ApiError('apiKey', new Error(`HTTP ${response.status}`));
    }
    if (!response.ok) {
      throw new ApiError('server', new Error(`HTTP ${response.status}`));
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      if (signal?.aborted) throw error;
      throw new ApiError(timedOut ? 'timeout' : 'invalid', error);
    }

    const locations = parseGeoapifyResponse(payload);
    if (locations.length === 0) {
      throw new ApiError('empty');
    }
    return locations;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}

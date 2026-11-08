import { DEFAULT_LOCATION, DEFAULT_SETTINGS, OVERPASS_API_URL } from '../constants/studySpot';
import type { Coordinates, StudyLocation, StudyLocationCategory } from '../types/Location';

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

function categoryFromTags(tags: Record<string, string>): StudyLocationCategory | null {
  if (tags.amenity === 'library') return 'Library';
  if (tags.amenity === 'cafe') return 'Cafe';
  if (tags.amenity === 'university' || tags.amenity === 'college') return 'University';
  if (tags.office === 'coworking') return 'Coworking';
  return null;
}

function buildAddress(tags: Record<string, string>): string | undefined {
  const street = tags['addr:street'];
  const houseNumber = tags['addr:housenumber'];
  const locality = [tags['addr:postcode'], tags['addr:city']].filter(Boolean).join(' ');
  const firstLine = [street, houseNumber].filter(Boolean).join(' ');

  return [firstLine, locality].filter(Boolean).join(', ') || tags['addr:full'];
}

export function mapOverpassElement(element: OverpassElement): StudyLocation | null {
  const tags = element.tags ?? {};
  const category = categoryFromTags(tags);
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  const name = tags.name?.trim() || tags.brand?.trim();

  if (!category || !name || latitude === undefined || longitude === undefined) {
    return null;
  }

  return {
    id: `${element.type}-${element.id}`,
    osmType: element.type,
    osmId: element.id,
    name,
    category,
    latitude,
    longitude,
    address: buildAddress(tags),
    website: tags.website ?? tags['contact:website'],
    openingHours: tags.opening_hours,
    source: 'openstreetmap',
  };
}

export function parseOverpassResponse(payload: unknown): StudyLocation[] {
  if (!payload || typeof payload !== 'object' || !Array.isArray((payload as OverpassResponse).elements)) {
    throw new Error('The OpenStreetMap response has an unexpected format.');
  }

  const elements = (payload as OverpassResponse).elements ?? [];
  const mapped = elements
    .map(mapOverpassElement)
    .filter((location): location is StudyLocation => location !== null);

  return Array.from(new Map(mapped.map((location) => [location.id, location])).values());
}

export function createOverpassQuery(
  origin: Coordinates = DEFAULT_LOCATION,
  radius: number = DEFAULT_SETTINGS.searchRadiusMeters,
): string {
  const { latitude, longitude } = origin;
  const amenityFilter = '["amenity"~"^(library|cafe|university|college)$"]';
  const coworkingFilter = '["office"="coworking"]';

  return [
    '[out:json][timeout:25];',
    '(',
    `node(around:${radius},${latitude},${longitude})${amenityFilter};`,
    `way(around:${radius},${latitude},${longitude})${amenityFilter};`,
    `relation(around:${radius},${latitude},${longitude})${amenityFilter};`,
    `node(around:${radius},${latitude},${longitude})${coworkingFilter};`,
    `way(around:${radius},${latitude},${longitude})${coworkingFilter};`,
    `relation(around:${radius},${latitude},${longitude})${coworkingFilter};`,
    ');',
    'out center tags;',
  ].join('\n');
}

export async function fetchStudyLocations(origin: Coordinates = DEFAULT_LOCATION): Promise<StudyLocation[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: `data=${encodeURIComponent(createOverpassQuery(origin))}`,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('Could not load study places. Please try again.');
    }

    return parseOverpassResponse(await response.json());
  } finally {
    clearTimeout(timeout);
  }
}

import type { Coordinates, StudyLocation } from '../types/Location';

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Returns the great-circle distance between two WGS84 coordinates. */
export function distanceInMeters(from: Coordinates, to: Coordinates): number {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine));
}

export function sortLocationsByDistance(
  locations: StudyLocation[],
  origin: Coordinates,
): StudyLocation[] {
  return locations
    .map((location) => ({
      ...location,
      distanceMeters: distanceInMeters(origin, location),
    }))
    .sort((first, second) => (first.distanceMeters ?? 0) - (second.distanceMeters ?? 0));
}

export function formatDistance(distanceMeters?: number): string | undefined {
  if (distanceMeters === undefined || !Number.isFinite(distanceMeters)) {
    return undefined;
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

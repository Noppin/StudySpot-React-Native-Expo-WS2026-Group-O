import * as Location from 'expo-location';

import type { Coordinates } from '../types/Location';

export type LocationErrorKind = 'denied' | 'unavailable';

export class LocationError extends Error {
  readonly kind: LocationErrorKind;

  constructor(kind: LocationErrorKind, cause?: unknown) {
    super(
      kind === 'denied'
        ? 'Location permission denied. Showing places around the default location.'
        : 'Your location is unavailable. Showing places around the default location.',
    );
    this.name = 'LocationError';
    this.kind = kind;
    this.cause = cause;
  }
}

const CURRENT_POSITION_TIMEOUT_MS = 12_000;
/** A last known fix up to this age is still good enough to sort nearby places. */
const LAST_KNOWN_MAX_AGE_MS = 30 * 60_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`No location fix within ${ms} ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function toCoordinates(position: Location.LocationObject): Coordinates {
  return { latitude: position.coords.latitude, longitude: position.coords.longitude };
}

/**
 * Requests foreground permission at runtime and returns the device position.
 *
 * A fresh fix is requested first. Emulators and devices indoors often fail to
 * deliver one, so the last known position is used as a fallback before the
 * app gives up and uses the default location.
 */
export async function getCurrentCoordinates(): Promise<Coordinates> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== Location.PermissionStatus.GRANTED) {
    throw new LocationError('denied');
  }

  let currentError: unknown;
  try {
    const position = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      CURRENT_POSITION_TIMEOUT_MS,
    );
    return toCoordinates(position);
  } catch (error) {
    currentError = error;
  }

  try {
    const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS });
    if (lastKnown) return toCoordinates(lastKnown);
  } catch {
    // Fall through to the error below.
  }

  if (__DEV__) {
    // Shown in the Metro terminal to help diagnose emulator/GPS problems.
    console.warn('StudySpot could not read the device location:', currentError);
  }
  throw new LocationError('unavailable', currentError);
}

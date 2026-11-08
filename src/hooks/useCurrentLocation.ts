import { useQuery } from '@tanstack/react-query';

import { DEFAULT_LOCATION } from '../constants/studySpot';
import { LocationError, getCurrentCoordinates } from '../services/locationService';
import { useSettingsStore } from '../store/settingsStore';
import type { Coordinates } from '../types/Location';

export type LocationStatus = 'disabled' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export interface CurrentLocation {
  /** Device coordinates, or null when GPS is not used. */
  coordinates: Coordinates | null;
  /** Coordinates to search and measure distance from (device or default location). */
  origin: Coordinates;
  status: LocationStatus;
  message: string | null;
  request: () => void;
}

export const currentLocationQueryKey = ['currentLocation'] as const;

/**
 * Shared device location. The query cache makes sure the permission prompt
 * appears once, even though several screens use this hook.
 */
export function useCurrentLocation(): CurrentLocation {
  const locationMode = useSettingsStore((state) => state.locationMode);
  const enabled = locationMode === 'device';

  const query = useQuery({
    queryKey: currentLocationQueryKey,
    queryFn: getCurrentCoordinates,
    enabled,
    retry: false,
    staleTime: 60_000,
  });

  let status: LocationStatus;
  if (!enabled) status = 'disabled';
  else if (query.data) status = 'granted';
  else if (query.error instanceof LocationError) status = query.error.kind;
  else if (query.error) status = 'unavailable';
  else status = 'requesting';

  const coordinates = enabled ? (query.data ?? null) : null;

  return {
    coordinates,
    origin: coordinates ?? DEFAULT_LOCATION,
    status,
    message:
      status === 'denied' || status === 'unavailable' ? new LocationError(status).message : null,
    request: () => void query.refetch(),
  };
}

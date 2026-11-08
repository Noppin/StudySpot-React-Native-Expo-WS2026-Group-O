import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { fetchStudyLocations, getErrorMessage, isApiError, type ApiErrorKind } from '../services/apiService';
import {
  clearLocationCache,
  loadLocationCache,
  saveLocationCache,
  type LocationCache,
} from '../services/storageService';
import { useSettingsStore } from '../store/settingsStore';
import type { Coordinates, StudyLocation } from '../types/Location';
import { sortLocationsByDistance } from '../utils/distance';
import { useCurrentLocation } from './useCurrentLocation';

const cacheQueryKey = ['locationCache'] as const;

/** Round to ~100 m so small GPS jitter does not trigger new API requests. */
function roundOrigin({ latitude, longitude }: Coordinates): Coordinates {
  return { latitude: Number(latitude.toFixed(3)), longitude: Number(longitude.toFixed(3)) };
}

/**
 * Offline-first location loading:
 * load local cache -> show it -> request current data -> update UI and cache on
 * success -> keep showing cached data on failure.
 */
export function useLocations() {
  const queryClient = useQueryClient();
  const radiusMeters = useSettingsStore((state) => state.searchRadiusMeters);
  const currentLocation = useCurrentLocation();
  const origin = roundOrigin(currentLocation.origin);

  const cacheQuery = useQuery({
    queryKey: cacheQueryKey,
    queryFn: loadLocationCache,
    staleTime: Infinity,
  });

  const liveQuery = useQuery({
    queryKey: ['locations', origin.latitude, origin.longitude, radiusMeters],
    queryFn: async ({ signal }): Promise<LocationCache> => {
      const locations = await fetchStudyLocations({ origin, radiusMeters, signal });
      const cache: LocationCache = { locations, timestamp: Date.now(), origin, radiusMeters };
      await saveLocationCache(cache);
      queryClient.setQueryData(cacheQueryKey, cache);
      return cache;
    },
    // Wait for the permission prompt so the first request uses the right origin.
    enabled: currentLocation.status !== 'requesting',
  });

  const source = liveQuery.data ?? cacheQuery.data ?? null;
  const isShowingCache = !liveQuery.data && !!cacheQuery.data;

  const locations: StudyLocation[] = useMemo(
    () => (source ? sortLocationsByDistance(source.locations, currentLocation.origin) : []),
    [source, currentLocation.origin],
  );

  const errorKind: ApiErrorKind | null = isApiError(liveQuery.error) ? liveQuery.error.kind : null;

  return {
    locations,
    currentLocation,
    updatedAt: source?.timestamp ?? null,
    isShowingCache,
    /** True while nothing can be shown yet. */
    isInitialLoading: !source && (cacheQuery.isPending || liveQuery.isPending),
    isRefreshing: liveQuery.isFetching,
    error: liveQuery.error ? getErrorMessage(liveQuery.error) : null,
    errorKind,
    refresh: useCallback(() => {
      void liveQuery.refetch();
    }, [liveQuery.refetch]),
  };
}

/** Deletes the cached API result; favourites and settings are kept. */
export function useClearLocationCache() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await clearLocationCache();
    queryClient.setQueryData(cacheQueryKey, null);
    queryClient.removeQueries({ queryKey: ['locations'] });
  }, [queryClient]);
}

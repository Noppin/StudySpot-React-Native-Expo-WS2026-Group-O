import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { getMockStudyLocations } from '../services/mockLocationService';
import { fetchStudyLocations } from '../services/overpassService';
import { requestDeviceCoordinates } from '../services/deviceLocationService';
import {
  clearCachedLocations,
  loadCachedLocations,
  loadFavoriteLocations,
  saveCachedLocations,
  saveFavoriteLocations,
} from '../services/storageService';
import type { Coordinates, StudyLocation } from '../types/StudyLocation';

export type DataSource = 'live' | 'cache' | 'sample';

interface StudySpotContextValue {
  locations: StudyLocation[];
  favorites: StudyLocation[];
  isLoading: boolean;
  error: string | null;
  dataSource: DataSource;
  lastUpdated: Date | null;
  currentLocation: Coordinates | null;
  locationError: string | null;
  refresh: () => Promise<void>;
  toggleFavorite: (location: StudyLocation) => void;
  isFavorite: (locationId: string) => boolean;
  requestCurrentLocation: () => Promise<void>;
  clearCache: () => Promise<void>;
}

const StudySpotContext = createContext<StudySpotContextValue | undefined>(undefined);

export function StudySpotProvider({ children }: PropsWithChildren) {
  const [locations, setLocations] = useState<StudyLocation[]>(getMockStudyLocations());
  const [favorites, setFavorites] = useState<StudyLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>('sample');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const freshLocations = await fetchStudyLocations();
      if (freshLocations.length === 0) {
        throw new Error('No named study places were returned by OpenStreetMap.');
      }

      await saveCachedLocations(freshLocations);
      setLocations(freshLocations);
      setDataSource('live');
      setLastUpdated(new Date());
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : 'Could not refresh study places.';
      const cached = await loadCachedLocations();

      setError(message);
      if (cached.length > 0) {
        setLocations(cached);
        setDataSource('cache');
      } else {
        setLocations(getMockStudyLocations());
        setDataSource('sample');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      const [cached, savedFavorites] = await Promise.all([
        loadCachedLocations(),
        loadFavoriteLocations(),
      ]);

      if (!active) return;

      setFavorites(savedFavorites);
      if (cached.length > 0) {
        setLocations(cached);
        setDataSource('cache');
      }

      await refresh();
    }

    void initialize();

    return () => {
      active = false;
    };
  }, [refresh]);

  const toggleFavorite = useCallback((location: StudyLocation) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === location.id);
      const next = exists
        ? current.filter((item) => item.id !== location.id)
        : [...current, location];

      void saveFavoriteLocations(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (locationId: string) => favorites.some((item) => item.id === locationId),
    [favorites],
  );

  const requestCurrentLocation = useCallback(async () => {
    setLocationError(null);
    try {
      setCurrentLocation(await requestDeviceCoordinates());
    } catch (cause) {
      setLocationError(
        cause instanceof Error ? cause.message : 'Could not read device location.',
      );
    }
  }, []);

  const clearCache = useCallback(async () => {
    await clearCachedLocations();
    setLocations(getMockStudyLocations());
    setDataSource('sample');
    setLastUpdated(null);
  }, []);

  const value = useMemo(
    () => ({
      locations,
      favorites,
      isLoading,
      error,
      dataSource,
      lastUpdated,
      currentLocation,
      locationError,
      refresh,
      toggleFavorite,
      isFavorite,
      requestCurrentLocation,
      clearCache,
    }),
    [
      locations,
      favorites,
      isLoading,
      error,
      dataSource,
      lastUpdated,
      currentLocation,
      locationError,
      refresh,
      toggleFavorite,
      isFavorite,
      requestCurrentLocation,
      clearCache,
    ],
  );

  return <StudySpotContext.Provider value={value}>{children}</StudySpotContext.Provider>;
}

export { StudySpotContext };

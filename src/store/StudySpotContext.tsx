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
  saveCachedLocations,
} from '../services/storageService';
import type { Coordinates, StudyLocation } from '../types/Location';

export type DataSource = 'live' | 'cache' | 'sample';

interface StudySpotContextValue {
  locations: StudyLocation[];
  isLoading: boolean;
  error: string | null;
  dataSource: DataSource;
  lastUpdated: Date | null;
  currentLocation: Coordinates | null;
  locationError: string | null;
  refresh: (origin?: Coordinates) => Promise<void>;
  requestCurrentLocation: () => Promise<Coordinates | null>;
  clearCache: () => Promise<void>;
}

const StudySpotContext = createContext<StudySpotContextValue | undefined>(undefined);

export function StudySpotProvider({ children }: PropsWithChildren) {
  const [locations, setLocations] = useState<StudyLocation[]>(getMockStudyLocations());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>('sample');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const refresh = useCallback(async (origin?: Coordinates) => {
    setIsLoading(true);
    setError(null);

    try {
      const freshLocations = await fetchStudyLocations(origin);
      if (freshLocations.length === 0) {
        throw new Error('No named study places were returned by OpenStreetMap.');
      }

      await saveCachedLocations(freshLocations);
      setLocations(freshLocations);
      setDataSource('live');
      setLastUpdated(new Date());
    } catch {
      // Keep technical network details, including HTTP status codes, out of the UI.
      const cached = await loadCachedLocations();

      setError('Could not refresh study places. Showing available saved or sample places.');
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
      const cached = await loadCachedLocations();

      if (!active) return;

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

  const requestCurrentLocation = useCallback(async (): Promise<Coordinates | null> => {
    setLocationError(null);
    try {
      const coordinates = await requestDeviceCoordinates();
      setCurrentLocation(coordinates);
      return coordinates;
    } catch {
      setLocationError(
        'Could not access your location. Check the permission and try again.',
      );
      return null;
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
      isLoading,
      error,
      dataSource,
      lastUpdated,
      currentLocation,
      locationError,
      refresh,
      requestCurrentLocation,
      clearCache,
    }),
    [
      locations,
      isLoading,
      error,
      dataSource,
      lastUpdated,
      currentLocation,
      locationError,
      refresh,
      requestCurrentLocation,
      clearCache,
    ],
  );

  return <StudySpotContext.Provider value={value}>{children}</StudySpotContext.Provider>;
}

export { StudySpotContext };

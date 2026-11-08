import * as Location from 'expo-location';

import { LocationError, getCurrentCoordinates } from './locationService';

jest.mock('expo-location', () => ({
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied' },
  Accuracy: { High: 4 },
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
}));

const mocked = jest.mocked(Location);
const fix = (latitude: number, longitude: number) =>
  ({ coords: { latitude, longitude } }) as Location.LocationObject;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  mocked.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' } as never);
});

it('returns the current position when a fix is available', async () => {
  mocked.getCurrentPositionAsync.mockResolvedValue(fix(48.24, 16.38));
  await expect(getCurrentCoordinates()).resolves.toEqual({ latitude: 48.24, longitude: 16.38 });
});

it('reports a denied permission without reading the position', async () => {
  mocked.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' } as never);

  await expect(getCurrentCoordinates()).rejects.toMatchObject({ kind: 'denied' });
  expect(mocked.getCurrentPositionAsync).not.toHaveBeenCalled();
});

it('falls back to the last known position when no current fix arrives', async () => {
  mocked.getCurrentPositionAsync.mockRejectedValue(new Error('Current location is unavailable'));
  mocked.getLastKnownPositionAsync.mockResolvedValue(fix(48.21, 16.31));

  await expect(getCurrentCoordinates()).resolves.toEqual({ latitude: 48.21, longitude: 16.31 });
});

it('reports the location as unavailable when both lookups fail', async () => {
  mocked.getCurrentPositionAsync.mockRejectedValue(new Error('Current location is unavailable'));
  mocked.getLastKnownPositionAsync.mockResolvedValue(null);

  const error = await getCurrentCoordinates().catch((caught: unknown) => caught);
  expect(error).toBeInstanceOf(LocationError);
  expect(error).toMatchObject({ kind: 'unavailable' });
});

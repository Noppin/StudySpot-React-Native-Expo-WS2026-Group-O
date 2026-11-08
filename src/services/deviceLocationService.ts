import * as Location from 'expo-location';

import type { Coordinates } from '../types/Location';

export async function requestDeviceCoordinates(): Promise<Coordinates> {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    throw new Error('Location permission was denied. You can still browse study places.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

import type { StudyLocation } from '../types/Location';
import type { HomeStackParamList } from './navigationTypes';

/**
 * Opens Location Details in the stack of the tab the user is currently in
 * (Home, Map or Favorites), so "back" returns to where they came from.
 */
export function useOpenLocationDetails() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  return useCallback(
    (location: StudyLocation) => navigation.navigate('LocationDetails', { location }),
    [navigation],
  );
}

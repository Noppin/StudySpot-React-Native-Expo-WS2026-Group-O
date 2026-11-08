import type { NavigatorScreenParams } from '@react-navigation/native';

import type { StudyLocation } from '../types/Location';

export interface LocationDetailsParams {
  location: StudyLocation;
}

/** Every list-like tab owns a stack so Location Details opens inside that tab. */
export type HomeStackParamList = {
  HomeList: undefined;
  LocationDetails: LocationDetailsParams;
};

export type MapStackParamList = {
  MapView: undefined;
  LocationDetails: LocationDetailsParams;
};

export type FavoritesStackParamList = {
  FavoritesList: undefined;
  LocationDetails: LocationDetailsParams;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  MapTab: NavigatorScreenParams<MapStackParamList> | undefined;
  FavoritesTab: NavigatorScreenParams<FavoritesStackParamList> | undefined;
  Settings: undefined;
};

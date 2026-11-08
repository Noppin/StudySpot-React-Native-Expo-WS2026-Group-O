import type { NavigatorScreenParams } from '@react-navigation/native';

import type { StudyLocation } from '../types/Location';

export type MainTabParamList = {
  Explore: undefined;
  Nearby: undefined;
  Saved: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Details: { location: StudyLocation };
};

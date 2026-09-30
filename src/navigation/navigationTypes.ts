import type { StudyLocation } from '../types/StudyLocation';

export type RootStackParamList = {
  Home: undefined;
  Details: {
    location: StudyLocation;
  };
};

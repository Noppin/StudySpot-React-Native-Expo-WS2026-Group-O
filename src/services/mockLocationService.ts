import type { StudyLocation } from '../types/StudyLocation';

const mockLocations: StudyLocation[] = [
  {
    id: 'fhtw-library',
    name: 'FHTW Library',
    category: 'Library',
    latitude: 48.239,
    longitude: 16.3776,
    address: 'Höchstädtplatz 6, 1200 Vienna',
  },
  {
    id: 'study-cafe',
    name: 'Study Café',
    category: 'Café',
    latitude: 48.2379,
    longitude: 16.3792,
    address: '1200 Vienna',
  },
];

export function getMockStudyLocations(): StudyLocation[] {
  return mockLocations;
}

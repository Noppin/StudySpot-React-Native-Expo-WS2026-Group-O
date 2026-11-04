import type { StudyLocation } from '../types/StudyLocation';

const mockLocations: StudyLocation[] = [
  {
    id: 'sample-fhtw-library',
    name: 'FHTW Library',
    category: 'Library',
    latitude: 48.239,
    longitude: 16.3776,
    address: 'Höchstädtplatz 6, 1200 Vienna',
    source: 'sample',
  },
  {
    id: 'sample-study-cafe',
    name: 'Study Café',
    category: 'Cafe',
    latitude: 48.2379,
    longitude: 16.3792,
    address: '1200 Vienna',
    source: 'sample',
  },
  {
    id: 'sample-campus',
    name: 'FHTW Campus',
    category: 'University',
    latitude: 48.2395,
    longitude: 16.3781,
    address: 'Höchstädtplatz, 1200 Vienna',
    source: 'sample',
  },
];

export function getMockStudyLocations(): StudyLocation[] {
  return mockLocations;
}

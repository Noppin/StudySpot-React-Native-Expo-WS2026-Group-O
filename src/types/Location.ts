export type StudyLocationCategory =
  | 'Library'
  | 'Cafe'
  | 'University'
  | 'Coworking'
  | 'Study Space';

export type LocationSource = 'openstreetmap' | 'sample';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface StudyLocation extends Coordinates {
  id: string;
  name: string;
  category: StudyLocationCategory;
  osmType?: string;
  osmId?: number;
  address?: string;
  website?: string;
  openingHours?: string;
  distanceMeters?: number;
  source?: LocationSource;
}

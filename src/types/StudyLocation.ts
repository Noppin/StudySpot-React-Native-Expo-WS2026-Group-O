export interface StudyLocation {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  website?: string;
  openingHours?: string;
}

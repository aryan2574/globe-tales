export interface VisitedSite {
  id?: number;
  userId: string;
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  visitedAt: string; // ISO string
}

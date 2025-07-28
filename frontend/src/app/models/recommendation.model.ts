import { Place } from './place.model';

export interface Recommendation {
  place: Place;
  distance: number;
  duration: number;
}

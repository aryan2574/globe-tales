import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, firstValueFrom } from 'rxjs';
import { Place } from '../models/place.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Service for managing places and fetching place data from the backend.
 */
@Injectable()
export class PlacesService {
  private apiUrl = '/api/places';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Search for nearby places by coordinates, radius, and optional type.
   * @param coordinates [latitude, longitude]
   * @param radius Search radius in meters
   * @param type Optional place type
   * @returns Promise resolving to an array of Place objects
   */
  async searchNearbyPlaces(
    coordinates: [number, number],
    radius: number,
    type?: string
  ): Promise<Place[]> {
    const [latitude, longitude] = coordinates;
    const params: any = {
      latitude,
      longitude,
      radius,
    };

    if (type) {
      params.type = type;
    }

    const places$ = this.http
      .get<any[]>(`${this.apiUrl}/nearby`, { params })
      .pipe(
        map((places) =>
          places.map((place) => ({
            id: place.id,
            name: place.name,
            type: place.type,
            latitude: place.latitude,
            longitude: place.longitude,
            tags: place.tags || {},
          }))
        )
      );

    return firstValueFrom(places$);
  }

  /**
   * Fetch places for a given bounding box.
   * @param south Southern latitude
   * @param west Western longitude
   * @param north Northern latitude
   * @param east Eastern longitude
   * @returns Observable of the fetch result
   */
  fetchPlacesForArea(
    south: number,
    west: number,
    north: number,
    east: number
  ): Observable<any> {
    const bbox = `${south},${west},${north},${east}`;
    return this.http.post(`${this.apiUrl}/fetch`, null, {
      params: { bbox },
    });
  }

  /**
   * Get all places from the backend.
   * @returns Observable of Place array
   */
  getAllPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl);
  }

  /**
   * Update sites for a given bounding box (manual update).
   * @param south Southern latitude
   * @param west Western longitude
   * @param north Northern latitude
   * @param east Eastern longitude
   * @returns Observable of the update result
   */
  updateSitesForArea(
    south: number,
    west: number,
    north: number,
    east: number
  ): Observable<any> {
    const bbox = `${south},${west},${north},${east}`;
    return this.http.post(`${this.apiUrl}/update-area`, null, {
      params: { bbox },
    });
  }

  /**
   * Get a place by its internal database ID.
   * @param id Internal place ID
   * @returns Observable of Place
   */
  getPlaceById(id: string): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get a place by its OSM ID.
   * @param osmId OSM node ID
   * @returns Observable of Place
   */
  getPlaceByOsmId(osmId: string): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/osm/${osmId}`);
  }
}

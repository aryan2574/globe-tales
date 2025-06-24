import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, firstValueFrom } from 'rxjs';
import { Place } from '../models/place.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class PlacesService {
  private apiUrl = '/api/places';

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  fetchPlacesForArea(
    south: number,
    west: number,
    north: number,
    east: number
  ): Observable<any> {
    const bbox = `${south},${west},${north},${east}`;
    const creds = this.authService.getCredentials();
    let headers = undefined;
    if (creds) {
      const basicAuth = 'Basic ' + btoa(creds.email + ':' + creds.password);
      headers = { Authorization: basicAuth };
    }
    return this.http.post(`${this.apiUrl}/fetch`, null, {
      params: { bbox },
      headers,
    });
  }

  getAllPlaces(): Observable<Place[]> {
    const creds = this.authService.getCredentials();
    let headers = undefined;
    if (creds) {
      const basicAuth = 'Basic ' + btoa(creds.email + ':' + creds.password);
      headers = { Authorization: basicAuth };
    }
    return this.http.get<Place[]>(this.apiUrl, { headers });
  }

  /**
   * Update sites for a given bounding box (manual update, requires Basic Auth)
   */
  updateSitesForArea(
    south: number,
    west: number,
    north: number,
    east: number
  ): Observable<any> {
    const bbox = `${south},${west},${north},${east}`;
    const creds = this.authService.getCredentials();
    let headers = undefined;
    if (creds) {
      const basicAuth = 'Basic ' + btoa(creds.email + ':' + creds.password);
      headers = { Authorization: basicAuth };
    }
    return this.http.post(`${this.apiUrl}/update-area`, null, {
      params: { bbox },
      headers,
    });
  }

  getPlaceById(id: string): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`);
  }
}

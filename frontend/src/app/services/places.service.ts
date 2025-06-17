import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, firstValueFrom } from 'rxjs';
import { Place } from '../models/place.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private apiUrl = `${environment.apiUrl}/places`;

  constructor(private http: HttpClient) {}

  async searchNearbyPlaces(
    coordinates: [number, number],
    radius: number,
    type?: string
  ): Promise<Place[]> {
    const [lat, lng] = coordinates;
    const params: any = {
      lat,
      lng,
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
            coordinates: [place.lat, place.lon] as [number, number],
            tags: place.tags || {},
          }))
        )
      );

    return firstValueFrom(places$);
  }
}

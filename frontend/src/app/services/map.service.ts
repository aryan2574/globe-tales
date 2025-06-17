import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Place } from '../models/place.model';
import { RouteInfo } from '../models/route.model';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService implements OnDestroy {
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private routeLayer: L.Polyline | null = null;
  private readonly OVERPASS_API = 'https://overpass-api.de/api/interpreter';

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.destroyMap();
  }

  initializeMap(elementId: string): void {
    if (this.map) {
      this.destroyMap();
    }

    try {
      this.map = L.map(elementId).setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);
    } catch (error) {
      console.error('Error initializing map:', error);
      throw new Error('Failed to initialize map');
    }
  }

  destroyMap(): void {
    if (this.map) {
      this.clearMarkers();
      this.clearRoute();
      this.map.remove();
      this.map = null;
    }
  }

  private clearMarkers(): void {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }

  public clearRoute(): void {
    if (this.routeLayer) {
      this.routeLayer.remove();
      this.routeLayer = null;
    }
  }

  flyTo(coordinates: [number, number]): void {
    if (!this.map) {
      throw new Error('Map not initialized');
    }
    this.map.flyTo(coordinates, 13);
  }

  displayPlaces(places: Place[]): void {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    this.clearMarkers();
    places.forEach((place) => {
      const marker = L.marker(place.coordinates).bindPopup(`
          <strong>${place.name}</strong><br>
          ${place.description || ''}
        `);
      marker.addTo(this.map!);
      this.markers.push(marker);
    });
  }

  displayRoute(geometry: {
    coordinates: [number, number][];
    type: string;
  }): void {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    this.clearRoute();
    const latLngs = geometry.coordinates.map(
      (coord) => [coord[1], coord[0]] as [number, number]
    );
    this.routeLayer = L.polyline(latLngs, {
      color: '#3388ff',
      weight: 5,
      opacity: 0.7,
    }).addTo(this.map);
  }

  getCurrentLocation(): Observable<{ lat: number; lng: number }> {
    return new Observable((observer) => {
      if (!navigator.geolocation) {
        observer.error(
          new Error('Geolocation is not supported by this browser.')
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          observer.complete();
        },
        (error) => {
          let errorMessage = 'Failed to get current location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          observer.error(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }

  searchPlaces(
    lat: number,
    lng: number,
    radius: number = 1000,
    type?: string
  ): Observable<Place[]> {
    const typeFilter = type ? `["tourism"="${type}"]` : '["tourism"]';
    const query = `[out:json][timeout:25];(node${typeFilter}(around:${radius},${lat},${lng});way${typeFilter}(around:${radius},${lat},${lng});relation${typeFilter}(around:${radius},${lat},${lng}););out body;>;out skel qt;`;

    return this.http
      .get(this.OVERPASS_API, {
        params: { data: query },
        responseType: 'text',
      })
      .pipe(
        map((response) => {
          try {
            const data = JSON.parse(response);
            return this.processOverpassResponse(data);
          } catch (error) {
            console.error('Error parsing Overpass response:', error);
            return [];
          }
        }),
        catchError((error) => {
          console.error('Error fetching places:', error);
          return of([]);
        })
      );
  }

  private processOverpassResponse(data: any): Place[] {
    if (!data || !data.elements) {
      return [];
    }

    return data.elements
      .filter((element: any) => element.tags && element.tags.name)
      .map((element: any) => ({
        id: element.id,
        name: element.tags.name,
        description: element.tags.description || '',
        coordinates: [element.lat, element.lon],
        type: element.tags.tourism || 'unknown',
      }));
  }

  getMap(): L.Map | null {
    return this.map;
  }
}

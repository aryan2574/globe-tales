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

  initializeMap(elementId: string, coordinates?: [number, number]): void {
    // Always destroy any previous map instance attached to this element
    if (this.map) {
      this.destroyMap();
    }
    // Ensure the container is properly sized and not leaking styles
    const container = document.getElementById(elementId);
    if (container) {
      container.style.height = '250px';
      container.style.width = '100%';
      container.style.maxWidth = '100%';
      container.style.borderRadius = '12px';
      container.style.overflow = 'hidden';
    }
    try {
      const isValidCoords =
        Array.isArray(coordinates) &&
        coordinates.length === 2 &&
        typeof coordinates[0] === 'number' &&
        typeof coordinates[1] === 'number';
      const center: [number, number] = isValidCoords
        ? [coordinates[0], coordinates[1]]
        : [0, 0];
      const zoom = isValidCoords ? 14 : 2;
      this.map = L.map(elementId, {
        zoomControl: true,
        attributionControl: true,
      }).setView(center, zoom);
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
      console.warn('Map not initialized, skipping displayPlaces');
      return;
    }
    this.clearMarkers();
    places.forEach((place) => {
      if (
        typeof place.latitude === 'number' &&
        typeof place.longitude === 'number' &&
        !isNaN(place.latitude) &&
        !isNaN(place.longitude)
      ) {
        const iconClass = this.getIconClassForPlace(place.type);
        const iconHtml = `<i class=\"fas ${iconClass}\"></i>`;
        const marker = L.marker([place.latitude, place.longitude], {
          icon: L.divIcon({
            className: 'custom-fa-marker',
            html: iconHtml,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        }).bindPopup(`
            <strong>${place.name}</strong><br>
            ${place.description || ''}
          `);
        marker.addTo(this.map!);
        this.markers.push(marker);
      }
    });
  }

  // Helper to get Font Awesome icon class for a place type
  private getIconClassForPlace(type: string): string {
    switch (type) {
      case 'hotel':
        return 'fa-hotel';
      case 'attraction':
        return 'fa-landmark';
      case 'museum':
        return 'fa-university';
      case 'restaurant':
        return 'fa-utensils';
      case 'viewpoint':
        return 'fa-mountain';
      default:
        return 'fa-map-marker-alt';
    }
  }

  // Call this after map is initialized to show user location
  public showUserLocationMarker(coordinates: [number, number]): void {
    if (!this.map) return;
    const userMarker = L.marker(coordinates, {
      icon: L.divIcon({
        className: 'custom-fa-marker user-location',
        html: '<i class="fas fa-location-arrow"></i>',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      }),
    }).addTo(this.map!);
    this.markers.push(userMarker);
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
      .filter(
        (element: any) =>
          element.tags &&
          element.tags.name &&
          typeof element.lat === 'number' &&
          typeof element.lon === 'number'
      )
      .map((element: any) => ({
        id: element.id,
        name: element.tags.name,
        description: element.tags.description || '',
        coordinates: [element.lat, element.lon] as [number, number],
        type: element.tags.tourism || 'unknown',
        tags: element.tags || {},
      }));
  }

  getMap(): L.Map | null {
    return this.map;
  }
}

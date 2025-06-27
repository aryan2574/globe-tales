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
  private userLocationMarker: L.Marker | null = null;
  private routeLayer: L.Polyline | null = null;
  private readonly OVERPASS_API = 'https://overpass-api.de/api/interpreter';
  private favouriteMarkers: L.Marker[] = [];

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.destroyMap();
  }

  initializeMap(elementId: string, coordinates?: [number, number]): void {
    // Always destroy any previous map instance attached to this element
    if (this.map) {
      this.destroyMap();
    }
    // The container should be styled by CSS, not inline styles here.
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
      // invalidateSize will be called from the component
    } catch (error) {
      console.error('Error initializing map:', error);
      throw new Error('Failed to initialize map');
    }
  }

  destroyMap(): void {
    this.clearMarkers();
    this.clearRoute();
    if (this.userLocationMarker) {
      this.userLocationMarker.remove();
      this.userLocationMarker = null;
    }
    if (this.map) {
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
        // Assign a color based on place type
        let color = '#007bff'; // default blue
        switch (place.type) {
          case 'hotel':
            color = '#e67e22';
            break; // orange
          case 'attraction':
            color = '#e74c3c';
            break; // red
          case 'museum':
            color = '#8e44ad';
            break; // purple
          case 'restaurant':
            color = '#27ae60';
            break; // green
          case 'viewpoint':
            color = '#2980b9';
            break; // dark blue
        }
        const iconHtml = `<i class=\"fas ${iconClass}\" style=\"font-size:2.2rem;color:${color};text-shadow:0 0 4px #fff;\"></i>`;
        const marker = L.marker([place.latitude, place.longitude], {
          icon: L.divIcon({
            className: 'custom-fa-marker',
            html: iconHtml,
            iconSize: [48, 48], // Larger marker
            iconAnchor: [24, 48], // Bottom center
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
    if (this.userLocationMarker) {
      this.userLocationMarker.setLatLng(coordinates);
    } else {
      this.userLocationMarker = L.marker(coordinates, {
        icon: L.divIcon({
          className: 'custom-fa-marker user-location',
          html: '<i class="fas fa-location-arrow user-location-icon"></i>',
          iconSize: [54, 54], // Larger marker
          iconAnchor: [27, 54], // Bottom center
        }),
      }).addTo(this.map!);
    }
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
      (coord) => [coord[0], coord[1]] as [number, number]
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
    let queryTags = '';
    if (type) {
      if (type === 'restaurant') {
        queryTags = `["amenity"="restaurant"]`;
      } else {
        queryTags = `["tourism"="${type}"]`;
      }
    } else {
      // For "All types", we search for common keys.
      queryTags = `["tourism"]`;
    }

    const query = `[out:json][timeout:25];(node${queryTags}(around:${radius},${lat},${lng});way${queryTags}(around:${radius},${lat},${lng});relation${queryTags}(around:${radius},${lat},${lng}););out body;>;out skel qt;`;

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
        latitude: element.lat,
        longitude: element.lon,
        type: element.tags.tourism || element.tags.amenity || 'unknown',
        tags: element.tags || {},
      }));
  }

  getMap(): L.Map | null {
    return this.map;
  }

  displayFavourites(favourites: Place[]): void {
    if (!this.map) return;
    favourites.forEach((place) => {
      if (
        typeof place.latitude === 'number' &&
        typeof place.longitude === 'number' &&
        !isNaN(place.latitude) &&
        !isNaN(place.longitude)
      ) {
        const marker = L.marker([place.latitude, place.longitude], {
          icon: L.divIcon({
            className: 'custom-fa-marker favourite-marker',
            html: '<i class="fas fa-heart favourite-heart-icon"></i>',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          }),
        }).bindPopup(`
            <strong>${place.name}</strong><br>
            ${place.description || ''}
          `);
        marker.addTo(this.map!);
        this.favouriteMarkers.push(marker);
      }
    });
  }
}

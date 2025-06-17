import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RouteInfo } from '../models/route.model';
import { environment } from '../../environments/environment';
import * as L from 'leaflet';

export interface RouteResponse {
  type: string;
  features: Array<{
    type: string;
    properties: {
      segments: Array<{
        distance: number;
        duration: number;
      }>;
    };
    geometry: {
      type: string;
      coordinates: number[][];
    };
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private routeLayer: L.Polyline | null = null;
  private currentLocationMarker: L.Marker | null = null;
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRoute(
    start: [number, number],
    end: [number, number],
    transportMode: 'driving-car' | 'foot-walking' | 'cycling-regular'
  ): Observable<RouteInfo> {
    const url = `${this.API_URL}/routes`;
    const body = {
      start,
      end,
      transportMode,
    };

    return this.http.post<any>(url, body).pipe(
      map((response) => ({
        distance: response.distance,
        duration: response.duration,
        geometry: response.geometry,
        steps: response.steps.map((step: any) => ({
          distance: step.distance,
          duration: step.duration,
          instruction: step.instruction,
          geometry: step.geometry,
        })),
      }))
    );
  }

  drawRoute(map: L.Map, coordinates: number[][]) {
    this.clearRoute();

    // Convert coordinates to LatLng objects
    const latLngs = coordinates.map((coord) => L.latLng(coord[1], coord[0]));

    // Create and add the route polyline
    this.routeLayer = L.polyline(latLngs, {
      color: '#3498db',
      weight: 5,
      opacity: 0.7,
      lineJoin: 'round',
    }).addTo(map);

    // Fit the map to show the entire route
    map.fitBounds(this.routeLayer.getBounds(), {
      padding: [50, 50],
    });
  }

  updateCurrentLocation(map: L.Map, lat: number, lng: number) {
    if (this.currentLocationMarker) {
      this.currentLocationMarker.setLatLng([lat, lng]);
    } else {
      // Create a custom icon for the current location with a human-like icon
      const currentLocationIcon = L.divIcon({
        className: 'current-location-marker',
        html: `
          <div class="location-marker-container">
            <i class="fas fa-user-circle"></i>
            <div class="location-pulse"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      this.currentLocationMarker = L.marker([lat, lng], {
        icon: currentLocationIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    }
  }

  clearRoute() {
    if (this.routeLayer) {
      this.routeLayer.remove();
      this.routeLayer = null;
    }
  }

  getRouteInfo(route: RouteResponse): { distance: number; duration: number } {
    const segment = route.features[0].properties.segments[0];
    return {
      distance: segment.distance,
      duration: segment.duration,
    };
  }

  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)}km`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  getRoute(
    start: [number, number],
    end: [number, number],
    profile: 'driving-car' | 'foot-walking' | 'cycling-regular' = 'driving-car'
  ): Observable<RouteResponse> {
    const headers = new HttpHeaders({
      Authorization: environment.openRouteApiKey,
      Accept:
        'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      'Content-Type': 'application/json; charset=utf-8',
    });

    const body = {
      coordinates: [start, end],
      format: 'geojson',
      preference: 'fastest',
      units: 'm',
      language: 'en',
      geometry_simplify: true,
    };

    return this.http.post<RouteResponse>(
      `/api/ors/v2/directions/${profile}`,
      body,
      { headers }
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

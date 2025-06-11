import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import * as L from 'leaflet';

export interface Place {
  id: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private readonly OVERPASS_API = 'https://overpass-api.de/api/interpreter';

  constructor(private http: HttpClient) {
    // Fix marker shadow issue
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'src/assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  initializeMap(elementId: string, lat: number, lng: number): L.Map {
    this.map = L.map(elementId).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    return this.map;
  }

  getCurrentLocation(): Observable<{ lat: number; lng: number }> {
    return new Observable((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not supported by this browser.');
      }
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
    const places: Place[] = [];

    if (!data.elements) {
      return places;
    }

    data.elements.forEach((element: any) => {
      if (element.tags && element.tags.tourism && element.lat && element.lon) {
        // Generate a meaningful name if none exists
        let name = element.tags.name;
        if (!name) {
          const type =
            element.tags.tourism.charAt(0).toUpperCase() +
            element.tags.tourism.slice(1);
          const address =
            element.tags['addr:street'] || element.tags['addr:place'] || '';
          name = `${type}${address ? ` on ${address}` : ''}`;
        }

        places.push({
          id: element.id.toString(),
          name: name,
          type: element.tags.tourism,
          lat: element.lat,
          lon: element.lon,
          tags: element.tags,
        });
      }
    });

    return places;
  }

  addMarkersToMap(places: Place[]): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    // Add new markers
    places.forEach((place) => {
      if (place.lat && place.lon) {
        const marker = L.marker([place.lat, place.lon]).bindPopup(`
            <strong>${place.name}</strong><br>
            Type: ${place.type}<br>
            ${
              place.tags['description']
                ? `Description: ${place.tags['description']}<br>`
                : ''
            }
            ${
              place.tags['website']
                ? `<a href="${place.tags['website']}" target="_blank">Website</a>`
                : ''
            }
          `);

        marker.addTo(this.map!);
        this.markers.push(marker);
      }
    });
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }

  getMap(): L.Map | null {
    return this.map;
  }
}

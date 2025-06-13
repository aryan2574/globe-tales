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
    // Create custom marker icon using Font Awesome
    const createCustomIcon = (type: string) => {
      const iconHtml = `
        <div class="custom-marker">
          <i class="fas ${this.getIconForType(type)}"></i>
        </div>
      `;

      return L.divIcon({
        html: iconHtml,
        className: 'custom-marker-container',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    };

    // Override default marker icon
    L.Marker.prototype.options.icon = createCustomIcon('default');
  }

  private getIconForType(type: string): string {
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

  initializeMap(elementId: string, lat: number, lng: number): L.Map {
    this.map = L.map(elementId).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Add custom marker styles
    const style = document.createElement('style');
    style.textContent = `
      .custom-marker-container {
        background: none;
        border: none;
      }
      .custom-marker {
        background: #3498db;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
      }
      .custom-marker i {
        font-size: 16px;
      }
      .custom-marker:hover {
        transform: scale(1.1);
        background: #2980b9;
      }
    `;
    document.head.appendChild(style);

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
        const marker = L.marker([place.lat, place.lon], {
          icon: L.divIcon({
            html: `
              <div class="custom-marker">
                <i class="fas ${this.getIconForType(place.type)}"></i>
              </div>
            `,
            className: 'custom-marker-container',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        }).bindPopup(`
          <div class="marker-popup">
            <h3><i class="fas ${this.getIconForType(place.type)}"></i> ${
          place.name
        }</h3>
            <p class="popup-type">${place.type}</p>
            ${
              place.tags['description']
                ? `<p class="popup-description">${place.tags['description']}</p>`
                : ''
            }
            ${
              place.tags['website']
                ? `<a href="${place.tags['website']}" target="_blank" class="popup-website"><i class="fas fa-external-link-alt"></i> Website</a>`
                : ''
            }
          </div>
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MapService, Place } from '../../services/map.service';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { DistancePipe } from '../../shared/pipes/distance.pipe';
import { DurationPipe } from '../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DistancePipe,
    DurationPipe,
  ],
  template: `
    <div class="dashboard-container">
      <div class="map-section">
        <div class="map-container" id="map"></div>
        <button class="current-location-btn" (click)="goToCurrentLocation()">
          <i class="fas fa-crosshairs"></i>
        </button>
        <div class="route-controls" *ngIf="selectedPlace">
          <div class="route-info" *ngIf="routeInfo">
            <div class="info-item">
              <i class="fas fa-road"></i>
              <span>{{ routeInfo.distance | distance }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-clock"></i>
              <span>{{ routeInfo.duration | duration }}</span>
            </div>
          </div>
          <div class="transport-modes">
            <button
              class="transport-btn"
              [class.active]="transportMode === 'driving-car'"
              (click)="getRoute('driving-car')"
            >
              <i class="fas fa-car"></i>
            </button>
            <button
              class="transport-btn"
              [class.active]="transportMode === 'foot-walking'"
              (click)="getRoute('foot-walking')"
            >
              <i class="fas fa-walking"></i>
            </button>
            <button
              class="transport-btn"
              [class.active]="transportMode === 'cycling-regular'"
              (click)="getRoute('cycling-regular')"
            >
              <i class="fas fa-bicycle"></i>
            </button>
          </div>
          <button class="clear-route-btn" (click)="clearRoute()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="places-panel">
        <div class="search-section">
          <h2><i class="fas fa-map-marker-alt"></i> Nearby Places</h2>
          <div class="filter-controls">
            <select [(ngModel)]="selectedType" (change)="onTypeChange()">
              <option value="">All Types</option>
              <option value="hotel"><i class="fas fa-hotel"></i> Hotels</option>
              <option value="attraction">
                <i class="fas fa-landmark"></i> Attractions
              </option>
              <option value="museum">
                <i class="fas fa-university"></i> Museums
              </option>
              <option value="restaurant">
                <i class="fas fa-utensils"></i> Restaurants
              </option>
              <option value="viewpoint">
                <i class="fas fa-mountain"></i> Viewpoints
              </option>
            </select>
            <div class="radius-control">
              <i class="fas fa-circle-notch"></i>
              <input
                type="range"
                [(ngModel)]="searchRadius"
                min="500"
                max="5000"
                step="500"
                (change)="onRadiusChange()"
              />
              <span>{{ searchRadius }}m</span>
            </div>
          </div>
        </div>

        <div class="places-list">
          <div *ngIf="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading places...
          </div>
          <div *ngIf="error" class="error">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>

          <div
            *ngIf="!loading && !error && places.length === 0"
            class="no-places"
          >
            <i class="fas fa-search"></i> No places found in this area
          </div>

          <div
            *ngFor="let place of places"
            class="place-card"
            [class.selected]="place === selectedPlace"
            (click)="selectPlace(place)"
          >
            <h3>
              <i
                class="fas"
                [ngClass]="{
                  'fa-hotel': place.type === 'hotel',
                  'fa-landmark': place.type === 'attraction',
                  'fa-university': place.type === 'museum',
                  'fa-utensils': place.type === 'restaurant',
                  'fa-mountain': place.type === 'viewpoint',
                  'fa-map-marker-alt': ![
                    'hotel',
                    'attraction',
                    'museum',
                    'restaurant',
                    'viewpoint'
                  ].includes(place.type)
                }"
              ></i>
              {{ place.name }}
            </h3>
            <p class="place-type">{{ place.type }}</p>
            <p *ngIf="place.tags['description']" class="place-description">
              {{ place.tags['description'] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        display: grid;
        grid-template-columns: 1fr 350px;
        height: calc(100vh - 64px);
        background: #f5f5f5;
        overflow: hidden;
      }

      .map-section {
        position: relative;
        height: 100%;
      }

      .map-container {
        height: 100%;
        width: 100%;
        background: #e0e0e0;
      }

      .current-location-btn {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: white;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        transition: all 0.3s ease;
        color: #3498db;

        &:hover {
          background: #3498db;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        &:active {
          transform: scale(0.95);
        }

        i {
          font-size: 1.4rem;
        }
      }

      .route-controls {
        position: absolute;
        top: 20px;
        left: 20px;
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .route-info {
        display: flex;
        gap: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e0e0e0;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;

        i {
          color: #3498db;
        }
      }

      .transport-modes {
        display: flex;
        gap: 0.5rem;
      }

      .transport-btn {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        background: white;
        color: #666;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        &:hover {
          background: #f5f5f5;
        }

        &.active {
          background: #3498db;
          color: white;
          border-color: #3498db;
        }

        i {
          font-size: 1.2rem;
        }
      }

      .clear-route-btn {
        width: 100%;
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        background: #e74c3c;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.2s ease;

        &:hover {
          background: #c0392b;
        }

        i {
          font-size: 1rem;
        }
      }

      .places-panel {
        background: white;
        border-left: 1px solid #e0e0e0;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      .search-section {
        padding: 1rem;
        border-bottom: 1px solid #e0e0e0;
        flex-shrink: 0;
      }

      .filter-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-top: 1rem;
      }

      .radius-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;

        i {
          color: #3498db;
          font-size: 1.1rem;
        }
      }

      select {
        padding: 0.5rem;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        flex: 1;
      }

      input[type='range'] {
        flex: 1;
      }

      .places-list {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .place-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        &.selected {
          border-color: #3498db;
          background: #f8f9fa;
        }

        h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          i {
            color: #3498db;
          }
        }
      }

      .place-type {
        color: #666;
        font-size: 0.9rem;
        margin: 0.5rem 0;
      }

      .place-description {
        font-size: 0.9rem;
        color: #666;
        margin: 0.5rem 0;
      }

      .loading,
      .error,
      .no-places {
        text-align: center;
        padding: 2rem;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        i {
          font-size: 1.2rem;
        }
      }

      .error {
        color: #d32f2f;
      }

      :host ::ng-deep {
        .marker-popup {
          padding: 0.5rem;

          h3 {
            margin: 0 0 0.5rem 0;
            color: #2c3e50;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.1rem;

            i {
              color: #3498db;
            }
          }

          .popup-type {
            color: #666;
            font-size: 0.9rem;
            margin: 0.5rem 0;
            text-transform: capitalize;
          }

          .popup-description {
            color: #666;
            font-size: 0.9rem;
            margin: 0.5rem 0;
          }

          .popup-website {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #3498db;
            text-decoration: none;
            font-size: 0.9rem;
            margin-top: 0.5rem;

            &:hover {
              text-decoration: underline;
            }

            i {
              font-size: 0.8rem;
            }
          }
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .leaflet-popup-content {
          margin: 0.8rem 1rem;
        }

        .leaflet-popup-tip {
          background: white;
        }

        .current-location-marker {
          .location-marker-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
          }

          i {
            color: #3498db;
            font-size: 2rem;
            z-index: 2;
            background: white;
            border-radius: 50%;
            padding: 2px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .location-pulse {
            position: absolute;
            width: 40px;
            height: 40px;
            background: rgba(52, 152, 219, 0.2);
            border-radius: 50%;
            animation: pulse 2s infinite;
            z-index: 1;
          }

          @keyframes pulse {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.5;
            }
            100% {
              transform: scale(0.8);
              opacity: 1;
            }
          }
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  places: Place[] = [];
  loading = false;
  error: string | null = null;
  selectedType = '';
  searchRadius = 1000;
  selectedPlace: Place | null = null;
  transportMode: 'driving-car' | 'foot-walking' | 'cycling-regular' =
    'driving-car';
  routeInfo: { distance: number; duration: number } | null = null;
  private currentLocation: [number, number] | null = null;

  constructor(
    private mapService: MapService,
    private routeService: RouteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    // Clean up map instance
    const map = this.mapService.getMap();
    if (map) {
      map.remove();
    }
  }

  private async initializeMap() {
    try {
      const location = await this.mapService.getCurrentLocation().toPromise();
      if (location) {
        this.currentLocation = [location.lat, location.lng];
        const map = this.mapService.initializeMap(
          'map',
          location.lat,
          location.lng
        );
        this.routeService.updateCurrentLocation(
          map,
          location.lat,
          location.lng
        );
        this.searchPlaces(location.lat, location.lng);
      }
    } catch (error) {
      this.error =
        'Could not get your location. Please enable location services.';
      // Default to a central location if geolocation fails
      const map = this.mapService.initializeMap('map', 0, 0);
    }
  }

  private searchPlaces(lat: number, lng: number, types: string[] = []) {
    this.loading = true;
    this.error = null;

    this.mapService
      .searchPlaces(
        lat,
        lng,
        this.searchRadius,
        types.length > 0 ? types[0] : undefined
      )
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (places) => {
          this.places = places;
          this.mapService.addMarkersToMap(places);
        },
        error: (error) => {
          console.error('Error searching places:', error);
          this.error = 'Failed to load nearby places. Please try again.';
        },
      });
  }

  onTypeChange() {
    const map = this.mapService.getMap();
    if (map) {
      const center = map.getCenter();
      this.searchPlaces(center.lat, center.lng);
    }
  }

  onRadiusChange() {
    const map = this.mapService.getMap();
    if (map) {
      const center = map.getCenter();
      this.searchPlaces(center.lat, center.lng);
    }
  }

  selectPlace(place: Place) {
    this.selectedPlace = place;
    const map = this.mapService.getMap();
    if (map) {
      map.setView([place.lat, place.lon], 16);
      if (this.currentLocation) {
        this.getRoute(this.transportMode);
      }
    }
  }

  async goToCurrentLocation() {
    try {
      const location = await this.mapService.getCurrentLocation().toPromise();
      if (location) {
        this.currentLocation = [location.lat, location.lng];
        const map = this.mapService.getMap();
        if (map) {
          map.setView([location.lat, location.lng], 15);
          this.routeService.updateCurrentLocation(
            map,
            location.lat,
            location.lng
          );
          this.searchPlaces(location.lat, location.lng);
          if (this.selectedPlace) {
            this.getRoute(this.transportMode);
          }
        }
      }
    } catch (error) {
      this.error =
        'Could not get your location. Please enable location services.';
    }
  }

  getRoute(profile: 'driving-car' | 'foot-walking' | 'cycling-regular') {
    if (!this.currentLocation || !this.selectedPlace) return;

    this.transportMode = profile;
    this.routeService
      .getRoute(
        this.currentLocation,
        [this.selectedPlace.lat, this.selectedPlace.lon],
        profile
      )
      .subscribe({
        next: (route) => {
          const map = this.mapService.getMap();
          if (map) {
            this.routeService.drawRoute(
              map,
              route.features[0].geometry.coordinates
            );
            this.routeInfo = this.routeService.getRouteInfo(route);
          }
        },
        error: (error) => {
          console.error('Error getting route:', error);
          this.error = 'Failed to get route. Please try again.';
        },
      });
  }

  clearRoute() {
    this.routeService.clearRoute();
    this.routeInfo = null;
  }
}

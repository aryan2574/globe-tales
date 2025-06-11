import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MapService, Place } from '../../services/map.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <div class="map-container" id="map"></div>

      <div class="places-panel">
        <div class="search-section">
          <h2>Nearby Places</h2>
          <div class="filter-controls">
            <select [(ngModel)]="selectedType" (change)="onTypeChange()">
              <option value="">All Types</option>
              <option value="hotel">Hotels</option>
              <option value="attraction">Attractions</option>
              <option value="museum">Museums</option>
              <option value="restaurant">Restaurants</option>
              <option value="viewpoint">Viewpoints</option>
            </select>
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

        <div class="places-list">
          <div *ngIf="loading" class="loading">Loading places...</div>
          <div *ngIf="error" class="error">{{ error }}</div>

          <div
            *ngIf="!loading && !error && places.length === 0"
            class="no-places"
          >
            No places found in this area
          </div>

          <div
            *ngFor="let place of places"
            class="place-card"
            (click)="selectPlace(place)"
          >
            <h3>{{ place.name }}</h3>
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
      }

      .map-container {
        height: 100%;
        background: #e0e0e0;
      }

      .places-panel {
        background: white;
        border-left: 1px solid #e0e0e0;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .search-section {
        padding: 1rem;
        border-bottom: 1px solid #e0e0e0;
      }

      .filter-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-top: 1rem;
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
      }

      .error {
        color: #d32f2f;
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

  constructor(
    private mapService: MapService,
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
        const map = this.mapService.initializeMap(
          'map',
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
    const map = this.mapService.getMap();
    if (map) {
      map.setView([place.lat, place.lon], 16);
    }
  }
}

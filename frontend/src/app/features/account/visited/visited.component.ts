import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Place } from '../../../models/place.model';
import { MapService } from '../../../services/map.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { MapComponent } from '../../../shared/components/map/map.component';

@Component({
  selector: 'app-visited',
  standalone: true,
  imports: [CommonModule, RouterModule, MapComponent],
  template: `
    <div class="visited-container">
      <h2>Places I've Visited</h2>

      <div class="user-location-section">
        <ng-container
          *ngIf="
            user && user.latitude != null && user.longitude != null;
            else noLocation
          "
        >
          <div class="visited-map-box">
            <app-map
              [latitude]="user.latitude"
              [longitude]="user.longitude"
            ></app-map>
          </div>
          <div style="font-size: 0.95em; color: #555; margin-bottom: 0.5rem;">
            Lat: {{ user.latitude }}, Lng: {{ user.longitude }}
          </div>
          <div class="your-location-label">Your location</div>
        </ng-container>
        <ng-template #noLocation>
          <button
            type="button"
            class="btn-review"
            (click)="setLocation()"
            [disabled]="loadingLocation"
          >
            <span *ngIf="!loadingLocation">Set My Location</span>
            <span *ngIf="loadingLocation"
              ><i class="fas fa-spinner fa-spin"></i> Setting...</span
            >
          </button>
        </ng-template>
      </div>

      <div class="visited-grid">
        <div *ngIf="loading" class="loading">Loading visited places...</div>
        <div *ngIf="error" class="error">{{ error }}</div>
        <div
          *ngIf="!loading && !error && visitedPlaces.length === 0"
          class="no-places"
        >
          You haven't visited any places yet.
        </div>

        <div *ngFor="let place of visitedPlaces" class="visited-card">
          <div class="visited-image">
            <i
              class="fas fa-map-marker-alt"
              style="font-size:3rem;color:#4a90e2;"
            ></i>
          </div>
          <div class="visited-content">
            <h3>{{ place.name }}</h3>
            <p class="location">{{ place.latitude }}, {{ place.longitude }}</p>
            <p class="description">{{ place.description }}</p>
            <div class="visit-info">
              <span class="visit-date"
                >Visited on {{ place.visitDate | date : 'mediumDate' }}</span
              >
              <div class="rating">
                <span
                  *ngFor="let star of [1, 2, 3, 4, 5]"
                  [class.filled]="star <= place.rating"
                  class="star"
                  >★</span
                >
              </div>
            </div>
            <div class="visited-actions">
              <button class="btn-review" (click)="writeReview(place.id)">
                Write Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./visited.component.scss'],
})
export class VisitedComponent implements OnInit {
  visitedPlaces: (Place & { visitDate: string; rating: number })[] = [];
  loading = false;
  error: string | null = null;
  user: any = null;
  loadingLocation = false;

  constructor(
    private mapService: MapService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadVisitedPlaces();
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  private loadVisitedPlaces() {
    this.loading = true;
    const stored = localStorage.getItem('visited');
    this.visitedPlaces = stored ? JSON.parse(stored) : [];
    this.loading = false;
  }

  async setLocation() {
    if (!this.user) return;
    this.loadingLocation = true;
    try {
      const pos = await new Promise<{ lat: number; lng: number }>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject('Geolocation not supported');
          }
          navigator.geolocation.getCurrentPosition(
            (position) =>
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }),
            (err) => reject(err)
          );
        }
      );
      const creds = this.authService.getCredentials();
      if (!creds) throw new Error('No credentials');
      await this.userService
        .updateUserLocation(
          this.user.id,
          pos.lat,
          pos.lng,
          creds.email,
          creds.password
        )
        .toPromise();
      // Reload user info from backend to update location and trigger map display
      this.userService.getCurrentUser(creds.email, creds.password).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: () => {
          // fallback: update manually
          this.user.latitude = pos.lat;
          this.user.longitude = pos.lng;
        },
      });
    } catch (e) {
      alert('Failed to get or save location');
    } finally {
      this.loadingLocation = false;
    }
  }

  writeReview(id: number) {
    // TODO: Implement writing a review
    console.log('Writing review for place:', id);
  }
}

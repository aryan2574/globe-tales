import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-visited',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="visited-container">
      <h2>Places I've Visited</h2>

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
            <p class="location">
              {{ place.coordinates[0] }}, {{ place.coordinates[1] }}
            </p>
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

  constructor() {}

  ngOnInit() {
    this.loadVisitedPlaces();
  }

  private loadVisitedPlaces() {
    this.loading = true;
    const stored = localStorage.getItem('visited');
    this.visitedPlaces = stored ? JSON.parse(stored) : [];
    this.loading = false;
  }

  writeReview(id: number) {
    // TODO: Implement writing a review
    console.log('Writing review for place:', id);
  }
}

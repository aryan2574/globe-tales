import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-visited',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="visited-container">
      <h2>Places I've Visited</h2>

      <div class="visited-list">
        <div *ngIf="loading" class="loading">Loading visited places...</div>
        <div *ngIf="error" class="error">{{ error }}</div>

        <div
          *ngIf="!loading && !error && visitedPlaces.length === 0"
          class="no-places"
        >
          You haven't marked any places as visited yet.
        </div>

        <div *ngFor="let place of visitedPlaces" class="visited-card">
          <div class="visited-header">
            <h3>{{ place.name }}</h3>
            <span class="visit-date">{{ place.visitDate | date }}</span>
          </div>
          <p class="place-type">{{ place.type }}</p>
          <p *ngIf="place.description" class="place-description">
            {{ place.description }}
          </p>
          <div class="place-actions">
            <button class="btn-view" (click)="viewPlace(place)">
              View Details
            </button>
            <button class="btn-remove" (click)="removeVisited(place)">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .visited-container {
        padding: 2rem;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 2rem;
      }

      .visited-list {
        display: grid;
        gap: 1.5rem;
      }

      .visited-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .visited-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .visit-date {
        color: #666;
        font-size: 0.9rem;
      }

      .place-type {
        color: #666;
        font-size: 0.9rem;
        margin: 0.5rem 0;
      }

      .place-description {
        color: #666;
        margin: 1rem 0;
      }

      .place-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }

      .btn-view,
      .btn-remove {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-view {
        background: #3498db;
        color: white;

        &:hover {
          background: #2980b9;
        }
      }

      .btn-remove {
        background: #e74c3c;
        color: white;

        &:hover {
          background: #c0392b;
        }
      }

      .loading,
      .error,
      .no-places {
        text-align: center;
        padding: 2rem;
        color: #666;
      }

      .error {
        color: #e74c3c;
      }
    `,
  ],
})
export class VisitedComponent implements OnInit {
  visitedPlaces: any[] = [];
  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit() {
    this.loadVisitedPlaces();
  }

  private loadVisitedPlaces() {
    this.loading = true;
    // TODO: Implement loading visited places from the backend
    this.loading = false;
  }

  viewPlace(place: any) {
    // TODO: Implement navigation to place details
  }

  removeVisited(place: any) {
    // TODO: Implement removing from visited places
  }
}

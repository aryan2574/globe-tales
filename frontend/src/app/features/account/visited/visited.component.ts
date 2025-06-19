import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface VisitedPlace {
  id: string;
  name: string;
  description: string;
  location: string;
  visitDate: Date;
  rating: number;
  iconClass?: string;
}

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
              [class]="place.iconClass || 'fas fa-map-marker-alt'"
              style="font-size:3rem;color:#4a90e2;"
            ></i>
          </div>
          <div class="visited-content">
            <h3>{{ place.name }}</h3>
            <p class="location">{{ place.location }}</p>
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
  styles: [
    `
      .visited-container {
        padding: 2rem;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 2rem;
      }

      .visited-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .visited-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-4px);
        }
      }

      .visited-image {
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .visited-content {
        padding: 1.5rem;

        h3 {
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .location {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .description {
          color: #34495e;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }
      }

      .visit-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .visit-date {
        color: #7f8c8d;
      }

      .rating {
        display: flex;
        gap: 0.25rem;
      }

      .star {
        color: #ddd;
        font-size: 1.2rem;

        &.filled {
          color: #f1c40f;
        }
      }

      .visited-actions {
        display: flex;
        justify-content: flex-end;
      }

      .btn-review {
        background: #3498db;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s;

        &:hover {
          background: #2980b9;
        }
      }

      .loading,
      .error,
      .no-places {
        text-align: center;
        padding: 2rem;
        color: #666;
        grid-column: 1 / -1;
      }

      .error {
        color: #e74c3c;
      }
    `,
  ],
})
export class VisitedComponent implements OnInit {
  visitedPlaces: VisitedPlace[] = [];
  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit() {
    this.loadVisitedPlaces();
  }

  private loadVisitedPlaces() {
    this.loading = true;
    // TODO: Implement loading visited places from the backend
    // For now, using mock data
    this.visitedPlaces = [
      {
        id: '1',
        name: 'Eiffel Tower',
        description: 'Iconic iron lattice tower on the Champ de Mars in Paris.',
        location: 'Paris, France',
        visitDate: new Date('2024-01-15'),
        rating: 5,
        iconClass: 'fas fa-landmark',
      },
      {
        id: '2',
        name: 'Taj Mahal',
        description: 'White marble mausoleum in Agra, India.',
        location: 'Agra, India',
        visitDate: new Date('2024-02-01'),
        rating: 4,
        iconClass: 'fas fa-archway',
      },
    ];
    this.loading = false;
  }

  writeReview(id: string) {
    // TODO: Implement writing a review
    console.log('Writing review for place:', id);
  }
}

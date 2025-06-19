import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="favorites-container">
      <h2>My Favorite Places</h2>

      <div class="favorites-grid">
        <div *ngIf="loading" class="loading">Loading favorites...</div>
        <div *ngIf="error" class="error">{{ error }}</div>
        <div
          *ngIf="!loading && !error && favorites.length === 0"
          class="no-favorites"
        >
          You haven't added any places to your favorites yet.
        </div>

        <div *ngFor="let place of favorites" class="favorite-card">
          <div class="favorite-image">
            <i
              class="fas fa-map-marker-alt"
              style="font-size:3rem;color:#e67e22;"
            ></i>
          </div>
          <div class="favorite-content">
            <h3>{{ place.name }}</h3>
            <p class="location">
              {{ place.coordinates[0] }}, {{ place.coordinates[1] }}
            </p>
            <p class="description">{{ place.description }}</p>
            <div class="favorite-actions">
              <button class="btn-remove" (click)="removeFavorite(place.id)">
                Remove from Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .favorites-container {
        padding: 2rem;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 2rem;
      }

      .favorites-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .favorite-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-4px);
        }
      }

      .favorite-image {
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .favorite-content {
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

      .favorite-actions {
        display: flex;
        justify-content: flex-end;
      }

      .btn-remove {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s;

        &:hover {
          background: #c0392b;
        }
      }

      .loading,
      .error,
      .no-favorites {
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
export class FavoritesComponent implements OnInit {
  favorites: Place[] = [];
  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit() {
    this.loadFavorites();
  }

  private loadFavorites() {
    this.loading = true;
    const stored = localStorage.getItem('favorites');
    this.favorites = stored ? JSON.parse(stored) : [];
    this.loading = false;
  }

  removeFavorite(id: number) {
    this.favorites = this.favorites.filter((place) => place.id !== id);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }
}

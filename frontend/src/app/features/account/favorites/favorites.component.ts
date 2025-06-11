import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="favorites-container">
      <h2>My Favorite Places</h2>

      <div class="favorites-list">
        <div *ngIf="loading" class="loading">Loading favorites...</div>
        <div *ngIf="error" class="error">{{ error }}</div>

        <div
          *ngIf="!loading && !error && favorites.length === 0"
          class="no-favorites"
        >
          You haven't added any places to your favorites yet.
        </div>

        <div *ngFor="let favorite of favorites" class="favorite-card">
          <h3>{{ favorite.name }}</h3>
          <p class="favorite-type">{{ favorite.type }}</p>
          <p *ngIf="favorite.description" class="favorite-description">
            {{ favorite.description }}
          </p>
          <div class="favorite-actions">
            <button class="btn-view" (click)="viewPlace(favorite)">
              View Details
            </button>
            <button class="btn-remove" (click)="removeFavorite(favorite)">
              Remove
            </button>
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

      .favorites-list {
        display: grid;
        gap: 1.5rem;
      }

      .favorite-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .favorite-type {
        color: #666;
        font-size: 0.9rem;
        margin: 0.5rem 0;
      }

      .favorite-description {
        color: #666;
        margin: 1rem 0;
      }

      .favorite-actions {
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
      .no-favorites {
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
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit() {
    this.loadFavorites();
  }

  private loadFavorites() {
    this.loading = true;
    // TODO: Implement loading favorites from the backend
    this.loading = false;
  }

  viewPlace(favorite: any) {
    // TODO: Implement navigation to place details
  }

  removeFavorite(favorite: any) {
    // TODO: Implement removing favorite
  }
}

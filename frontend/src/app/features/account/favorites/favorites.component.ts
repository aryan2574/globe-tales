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
  styleUrls: ['./favorites.component.scss'],
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

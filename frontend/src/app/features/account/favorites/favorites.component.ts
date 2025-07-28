import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserFavourite } from '../../../models/user-favourite.model';
import { UserFavouriteService } from '../../../services/user-favourite.service';
import { AuthService } from '../../../services/auth.service';

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
          Currently you have no favourite places
        </div>

        <div *ngFor="let place of favorites" class="favorite-card">
          <div class="favorite-image">
            <i
              class="fas fa-map-marker-alt"
              style="font-size:3rem;color:#e67e22;"
            ></i>
          </div>
          <div class="favorite-content">
            <h3>{{ place.placeName || 'Site ID: ' + place.siteId }}</h3>
            <p class="site-type">Type: {{ place.siteType }}</p>
            <p class="saved-at">
              Saved at: {{ place.savedAt | date : 'medium' }}
            </p>
            <div class="favorite-actions">
              <button class="btn-remove" (click)="removeFavorite(place.siteId)">
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
  favorites: UserFavourite[] = [];
  loading = false;
  error: string | null = null;
  user: any = null;

  constructor(
    private userFavouriteService: UserFavouriteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.loadFavorites();
      }
    });
  }

  private loadFavorites() {
    if (!this.user) return;
    this.loading = true;
    this.userFavouriteService.getFavouritesByUser(this.user.id).subscribe({
      next: (favs) => {
        this.favorites = favs;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load favorites';
        this.loading = false;
      },
    });
  }

  removeFavorite(siteId: number) {
    if (!this.user) return;
    this.userFavouriteService.deleteFavourite(this.user.id, siteId).subscribe({
      next: () => this.loadFavorites(),
      error: () => (this.error = 'Failed to remove favorite'),
    });
  }
}

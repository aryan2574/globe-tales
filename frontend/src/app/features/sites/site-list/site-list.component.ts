import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Site {
  id: string;
  name: string;
  type: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  iconClass?: string;
}

@Component({
  selector: 'app-site-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="site-list-container">
      <div class="filters-section">
        <h2>Cultural Sites</h2>
        <div class="search-filters">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Search sites..."
            class="search-input"
          />
          <select
            [(ngModel)]="selectedType"
            (change)="onTypeChange()"
            class="type-select"
          >
            <option value="">All Types</option>
            <option value="museum">Museums</option>
            <option value="monument">Monuments</option>
            <option value="historic">Historic Sites</option>
            <option value="religious">Religious Sites</option>
            <option value="cultural">Cultural Centers</option>
          </select>
          <select
            [(ngModel)]="sortBy"
            (change)="onSortChange()"
            class="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      <div class="sites-grid">
        <div *ngIf="loading" class="loading">Loading sites...</div>
        <div *ngIf="error" class="error">{{ error }}</div>

        <div *ngIf="!loading && !error && sites.length === 0" class="no-sites">
          No sites found matching your criteria.
        </div>

        <div
          *ngFor="let site of sites"
          class="site-card"
          [routerLink]="['/sites', site.id]"
        >
          <div class="site-icon">
            <i [class]="getIconClass(site.type)"></i>
            <div class="site-rating">
              <i class="fas fa-star"></i>
              {{ site.rating }}
            </div>
          </div>
          <div class="site-content">
            <h3>{{ site.name }}</h3>
            <p class="site-type">{{ site.type }}</p>
            <p class="site-description">{{ site.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .site-list-container {
        padding: 2rem;
      }

      .filters-section {
        margin-bottom: 2rem;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }

      .search-filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .search-input,
      .type-select,
      .sort-select {
        padding: 0.5rem;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 1rem;
      }

      .search-input {
        flex: 2;
      }

      .type-select,
      .sort-select {
        flex: 1;
      }

      .sites-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }

      .site-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
          transform: translateY(-4px);
        }
      }

      .site-icon {
        height: 200px;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        i {
          font-size: 5rem;
          color: #2c3e50;
        }
      }

      .site-rating {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .site-content {
        padding: 1.5rem;
      }

      h3 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
      }

      .site-type {
        color: #666;
        font-size: 0.9rem;
        margin: 0.5rem 0;
      }

      .site-description {
        color: #666;
        font-size: 0.9rem;
        margin: 0.5rem 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .loading,
      .error,
      .no-sites {
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
export class SiteListComponent implements OnInit {
  sites: Site[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  selectedType = '';
  sortBy = 'name';

  constructor() {}

  ngOnInit() {
    this.loadSites();
  }

  private loadSites() {
    this.loading = true;
    // TODO: Implement loading sites from the backend
    // For now, using mock data
    this.sites = [
      {
        id: '1',
        name: 'National Museum',
        type: 'museum',
        description:
          "A comprehensive museum showcasing the country's rich cultural heritage.",
        location: { lat: 0, lng: 0 },
        rating: 4.5,
      },
      {
        id: '2',
        name: 'Historic Cathedral',
        type: 'religious',
        description:
          'A magnificent cathedral with stunning architecture and religious artifacts.',
        location: { lat: 0, lng: 0 },
        rating: 4.8,
      },
    ];
    this.loading = false;
  }

  onSearch() {
    // TODO: Implement search functionality
  }

  onTypeChange() {
    // TODO: Implement type filtering
  }

  onSortChange() {
    // TODO: Implement sorting
  }

  getIconClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'museum':
        return 'fas fa-landmark';
      case 'monument':
        return 'fas fa-monument';
      case 'historic':
        return 'fas fa-archway';
      case 'religious':
        return 'fas fa-church';
      case 'cultural':
        return 'fas fa-theater-masks';
      default:
        return 'fas fa-map-marker-alt';
    }
  }
}

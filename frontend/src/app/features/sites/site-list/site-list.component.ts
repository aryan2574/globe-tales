import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MapService } from '../../../services/map.service';
import { LocationService } from '../../../services/location.service';

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
          <select
            [(ngModel)]="pageSize"
            (change)="onPageSizeChange()"
            class="page-size-select"
          >
            <option *ngFor="let size of pageSizeOptions" [value]="size">
              Show {{ size }}
            </option>
          </select>
        </div>
      </div>

      <div class="sites-grid">
        <div *ngIf="loading" class="loading">Loading sites...</div>
        <div *ngIf="error" class="error">{{ error }}</div>

        <div
          *ngIf="!loading && !error && pagedSites.length === 0"
          class="no-sites"
        >
          No sites found matching your criteria.
        </div>

        <div
          *ngFor="let site of pagedSites"
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

      <div class="pagination-controls" *ngIf="totalPages > 1">
        <button (click)="prevPage()" [disabled]="currentPage === 1">
          Prev
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button (click)="nextPage()" [disabled]="currentPage === totalPages">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .site-list-container {
        padding: 2.5rem 1rem 3rem 1rem;
        background: linear-gradient(120deg, #f8fafc 0%, #e3e9f3 100%);
        min-height: 100vh;
      }

      .filters-section {
        margin-bottom: 2.5rem;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .search-filters {
        display: flex;
        gap: 1.2rem;
        margin-bottom: 2.5rem;
        flex-wrap: wrap;
      }

      .search-input,
      .type-select,
      .sort-select,
      .page-size-select {
        padding: 0.7rem 1.2rem;
        border: 1px solid #d0d7e2;
        border-radius: 24px;
        font-size: 1.05rem;
        background: #fff;
        transition: border-color 0.2s;
        outline: none;
      }

      .search-input:focus,
      .type-select:focus,
      .sort-select:focus,
      .page-size-select:focus {
        border-color: #4a90e2;
      }

      .search-input {
        flex: 2;
        min-width: 180px;
      }

      .type-select,
      .sort-select,
      .page-size-select {
        flex: 1;
        min-width: 120px;
      }

      .sites-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2.2rem;
      }

      .site-card {
        background: linear-gradient(120deg, #fff 60%, #f0f4fa 100%);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(74, 144, 226, 0.08);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        border: 1px solid #e3e9f3;
        display: flex;
        flex-direction: column;
        min-height: 340px;
      }

      .site-card:hover {
        transform: translateY(-8px) scale(1.03);
        box-shadow: 0 8px 32px rgba(74, 144, 226, 0.18);
        border-color: #b3c6e6;
      }

      .site-icon {
        height: 180px;
        background: linear-gradient(120deg, #e3e9f3 0%, #f8fafc 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .site-icon i {
        font-size: 4.5rem;
        color: #4a90e2;
        filter: drop-shadow(0 2px 8px rgba(74, 144, 226, 0.12));
      }

      .site-rating {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #4a90e2;
        color: white;
        padding: 0.45rem 0.85rem;
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        box-shadow: 0 2px 8px rgba(74, 144, 226, 0.12);
      }

      .site-content {
        padding: 1.5rem 1.2rem 1.2rem 1.2rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }

      h3 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .site-type {
        color: #4a90e2;
        font-size: 1rem;
        margin: 0.5rem 0 0.5rem 0;
        text-transform: capitalize;
        font-weight: 500;
      }

      .site-description {
        color: #666;
        font-size: 1rem;
        margin: 0.5rem 0 0 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
      }

      .loading,
      .error,
      .no-sites {
        text-align: center;
        padding: 2.5rem 1rem;
        color: #666;
        grid-column: 1 / -1;
        font-size: 1.2rem;
      }

      .error {
        color: #e74c3c;
      }

      .pagination-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.2rem;
        margin-top: 2.5rem;
      }

      .pagination-controls button {
        background: #4a90e2;
        color: white;
        border: none;
        padding: 0.6rem 1.4rem;
        border-radius: 24px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s, transform 0.2s;
      }

      .pagination-controls button:disabled {
        background: #b3c6e6;
        cursor: not-allowed;
      }

      .pagination-controls span {
        font-size: 1.1rem;
        color: #2c3e50;
        font-weight: 500;
      }

      @media (max-width: 900px) {
        .sites-grid {
          grid-template-columns: 1fr;
        }
        .site-list-container {
          padding: 1rem 0.5rem 2rem 0.5rem;
        }
      }
    `,
  ],
})
export class SiteListComponent implements OnInit {
  sites: Site[] = [];
  pagedSites: Site[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  selectedType = '';
  sortBy = 'name';
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  currentPage = 1;
  totalPages = 1;

  constructor(
    private mapService: MapService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.loadSites();
  }

  private async loadSites() {
    this.loading = true;
    this.error = null;
    try {
      const [lat, lng] = await this.locationService.getCurrentLocation();
      // Overpass query for cultural sites (historic, museum, monument, religious, cultural)
      const query = `[out:json][timeout:25];(
        node["historic"](around:3000,${lat},${lng});
        node["tourism"="museum"](around:3000,${lat},${lng});
        node["tourism"="attraction"](around:3000,${lat},${lng});
        node["historic"="monument"](around:3000,${lat},${lng});
        node["amenity"="place_of_worship"](around:3000,${lat},${lng});
        node["amenity"="cultural_centre"](around:3000,${lat},${lng});
      );out body;`;
      this.mapService['http']
        .get('https://overpass-api.de/api/interpreter', {
          params: { data: query },
          responseType: 'text',
        })
        .subscribe({
          next: (response: any) => {
            let data;
            try {
              data = JSON.parse(response);
            } catch {
              this.error = 'Failed to parse Overpass API response.';
              this.loading = false;
              return;
            }
            this.sites = (data.elements || []).map((el: any) => ({
              id: el.id,
              name: el.tags?.name || 'Unknown',
              type:
                el.tags?.historic ||
                el.tags?.tourism ||
                el.tags?.amenity ||
                'cultural',
              description: el.tags?.description || '',
              location: { lat: el.lat, lng: el.lon },
              rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Fake rating for demo
              iconClass: this.getIconClass(
                el.tags?.tourism ||
                  el.tags?.historic ||
                  el.tags?.amenity ||
                  'cultural'
              ),
            }));
            this.applyFiltersAndPagination();
            this.loading = false;
          },
          error: (err: any) => {
            this.error = 'Failed to load sites from Overpass API.';
            this.loading = false;
          },
        });
    } catch (e) {
      this.error = 'Could not get user location.';
      this.loading = false;
    }
  }

  private applyFiltersAndPagination() {
    let filtered = this.sites;
    if (this.searchQuery) {
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          site.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );
    }
    if (this.selectedType) {
      filtered = filtered.filter((site) => site.type === this.selectedType);
    }
    if (this.sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'rating') {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }
    this.totalPages = Math.ceil(filtered.length / this.pageSize) || 1;
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage < 1) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedSites = filtered.slice(start, end);
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onTypeChange() {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onSortChange() {
    this.applyFiltersAndPagination();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFiltersAndPagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFiltersAndPagination();
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'museum':
        return 'fas fa-university';
      case 'monument':
        return 'fas fa-landmark';
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

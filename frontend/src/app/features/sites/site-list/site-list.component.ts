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
  latitude: number;
  longitude: number;
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
  styleUrls: ['./site-list.component.scss'],
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
              latitude: el.lat,
              longitude: el.lon,
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
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
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

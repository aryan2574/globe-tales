import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MapService } from '../../../services/map.service';

interface Contact {
  phone?: string;
  email?: string;
  website?: string;
}

interface Site {
  id: number;
  name: string;
  type: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  rating: number;
  iconClass?: string;
  openingHours?: string;
  contact?: Contact;
  facilities: string[];
  reviews: {
    id: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

@Component({
  selector: 'app-site-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="site-detail-container" *ngIf="site">
      <div class="site-header">
        <div class="site-icon">
          <i [class]="getIconClass(site.type)"></i>
          <div class="site-rating">
            <i class="fas fa-star"></i>
            {{ site.rating }}
          </div>
        </div>
        <div class="site-info">
          <h1>{{ site.name }}</h1>
          <p class="site-type">{{ site.type }}</p>
          <div class="site-actions">
            <button class="btn-favorite" (click)="toggleFavorite()">
              <i
                class="fas"
                [class.fa-heart]="isFavorite"
                [class.fa-heart-o]="!isFavorite"
              ></i>
              {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
            </button>
            <button class="btn-visited" (click)="markAsVisited()">
              <i class="fas fa-check"></i>
              Mark as Visited
            </button>
          </div>
        </div>
      </div>

      <div class="site-content">
        <div class="main-content">
          <section class="description-section">
            <h2>About</h2>
            <p>{{ site.description }}</p>
          </section>

          <section class="map-section">
            <h2>Location</h2>
            <div id="site-map" class="site-map"></div>
          </section>

          <section class="reviews-section">
            <h2>Reviews</h2>
            <div class="reviews-list">
              <div *ngFor="let review of site.reviews" class="review-card">
                <div class="review-header">
                  <span class="reviewer-name">{{ review.userName }}</span>
                  <span class="review-date">{{ review.date | date }}</span>
                </div>
                <div class="review-rating">
                  <i
                    class="fas fa-star"
                    *ngFor="let star of [1, 2, 3, 4, 5]"
                    [class.filled]="star <= review.rating"
                  ></i>
                </div>
                <p class="review-comment">{{ review.comment }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="sidebar">
          <section class="info-section">
            <h3>Information</h3>
            <div class="info-item" *ngIf="site.openingHours">
              <i class="fas fa-clock"></i>
              <span>{{ site.openingHours }}</span>
            </div>
            <div class="info-item" *ngIf="site.contact && site.contact.phone">
              <i class="fas fa-phone"></i>
              <span>{{ site.contact.phone }}</span>
            </div>
            <div class="info-item" *ngIf="site.contact && site.contact.email">
              <i class="fas fa-envelope"></i>
              <span>{{ site.contact.email }}</span>
            </div>
            <div class="info-item" *ngIf="site.contact && site.contact.website">
              <i class="fas fa-globe"></i>
              <a [href]="site.contact.website" target="_blank">Visit Website</a>
            </div>
          </section>

          <section class="facilities-section" *ngIf="site.facilities?.length">
            <h3>Facilities</h3>
            <ul class="facilities-list">
              <li *ngFor="let facility of site.facilities">
                <i class="fas fa-check"></i>
                {{ facility }}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./site-detail.component.scss'],
})
export class SiteDetailComponent implements OnInit {
  site: Site | null = null;
  isFavorite = false;

  constructor() {}

  ngOnInit() {
    // TODO: Load site details from backend
    this.loadSiteDetails();
  }

  private loadSiteDetails() {
    // TODO: Implement loading site details from the backend
    // For now, using mock data
    this.site = {
      id: 1,
      name: 'Ancient Temple',
      type: 'religious',
      description:
        'A magnificent ancient temple with stunning architecture and religious significance.',
      location: {
        lat: 0,
        lng: 0,
        address: '123 Temple Street, City',
      },
      rating: 4.7,
      openingHours: '9:00 AM - 5:00 PM',
      contact: {
        phone: '+1 234 567 890',
        email: 'info@temple.com',
        website: 'https://temple.com',
      },
      facilities: ['Parking', 'Guided Tours', 'Gift Shop', 'Restrooms'],
      reviews: [
        {
          id: 1,
          userId: 1,
          userName: 'John Doe',
          rating: 5,
          comment: 'Amazing place with rich history!',
          date: '2024-01-15',
        },
      ],
    };
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    // TODO: Update favorite status in backend
  }

  markAsVisited() {
    // TODO: Update visited status in backend
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

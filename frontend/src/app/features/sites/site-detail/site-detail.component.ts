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
  imageUrl: string;
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
        <div
          class="site-image"
          [style.background-image]="
            'url(' + (site.imageUrl || 'assets/placeholder.jpg') + ')'
          "
        >
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
  styles: [
    `
      .site-detail-container {
        padding: 2rem;
      }

      .site-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .site-image {
        height: 400px;
        background-size: cover;
        background-position: center;
        border-radius: 8px;
        position: relative;
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

      .site-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      h1 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
      }

      .site-type {
        color: #666;
        font-size: 1.1rem;
        margin: 0.5rem 0 1.5rem 0;
      }

      .site-actions {
        display: flex;
        gap: 1rem;
      }

      .btn-favorite,
      .btn-visited {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
      }

      .btn-favorite {
        background: #e74c3c;
        color: white;

        &:hover {
          background: #c0392b;
        }
      }

      .btn-visited {
        background: #2ecc71;
        color: white;

        &:hover {
          background: #27ae60;
        }
      }

      .site-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
      }

      section {
        margin-bottom: 2rem;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }

      .site-map {
        height: 300px;
        border-radius: 8px;
        overflow: hidden;
      }

      .reviews-list {
        display: grid;
        gap: 1rem;
      }

      .review-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .reviewer-name {
        font-weight: bold;
        color: #2c3e50;
      }

      .review-date {
        color: #666;
        font-size: 0.9rem;
      }

      .review-rating {
        color: #f1c40f;
        margin-bottom: 0.5rem;
      }

      .review-comment {
        color: #666;
      }

      .sidebar section {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: #666;

        i {
          color: #3498db;
        }

        a {
          color: #3498db;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .facilities-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #666;

          i {
            color: #2ecc71;
          }
        }
      }
    `,
  ],
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
    // Mock data for demonstration
    this.site = {
      id: 1,
      name: 'Ancient Temple',
      type: 'Historical Site',
      description:
        'A magnificent ancient temple with rich cultural heritage...',
      location: {
        lat: 51.5074,
        lng: -0.1278,
        address: '123 Temple Street, London',
      },
      rating: 4.5,
      imageUrl: 'assets/images/temple.jpg',
      openingHours: '9:00 AM - 5:00 PM',
      contact: {
        phone: '+44 123 456 7890',
        email: 'info@ancienttemple.com',
        website: 'https://ancienttemple.com',
      },
      facilities: [
        'Guided Tours',
        'Gift Shop',
        'Restrooms',
        'Parking',
        'Wheelchair Access',
      ],
      reviews: [
        {
          id: 1,
          userId: 1,
          userName: 'John Doe',
          rating: 5,
          comment: 'Amazing historical site with beautiful architecture.',
          date: '2024-02-15',
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
}

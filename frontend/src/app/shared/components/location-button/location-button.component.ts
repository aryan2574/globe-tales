import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-location-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="location-btn" (click)="requestLocation()">
      <i class="fas fa-map-marker-alt"></i>
      Share Location
    </button>
  `,
  styles: [
    `
      .location-btn {
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        transition: all 0.2s ease;

        &:hover {
          background-color: #357abd;
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }

        i {
          font-size: 16px;
        }
      }
    `,
  ],
})
export class LocationButtonComponent {
  constructor(private locationService: LocationService) {}

  async requestLocation(): Promise<void> {
    try {
      await this.locationService.getCurrentLocation();
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }
}

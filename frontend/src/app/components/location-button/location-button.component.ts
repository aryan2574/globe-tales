import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="requestLocation()" [disabled]="isLoading">
      <i class="fas fa-location-arrow"></i>
      {{ isLoading ? 'Getting Location...' : 'Share My Location' }}
    </button>
  `,
  styles: [
    `
      button {
        padding: 1.2rem 2.5rem;
        font-size: 1.2rem;
        border-radius: 30px;
        background: linear-gradient(90deg, #4a90e2 0%, #357ab8 100%);
        color: #fff;
        box-shadow: 0 4px 16px rgba(74, 144, 226, 0.15);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.2s;
      }
      button:hover {
        background: linear-gradient(90deg, #357ab8 0%, #4a90e2 100%);
        transform: scale(1.04);
      }
      button:active {
        transform: scale(0.98);
      }
      i.fas {
        margin-right: 12px;
        font-size: 2rem;
      }
    `,
  ],
})
export class LocationButtonComponent {
  isLoading = false;

  constructor(private locationService: LocationService) {}

  async requestLocation(): Promise<void> {
    this.isLoading = true;
    try {
      await this.locationService.requestAndSaveLocation();
    } catch (error) {
      console.error('Error getting location:', error);
      // You might want to show an error message to the user here
    } finally {
      this.isLoading = false;
    }
  }
}

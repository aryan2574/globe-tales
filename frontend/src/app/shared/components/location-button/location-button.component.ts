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
  styleUrls: ['./location-button.component.scss'],
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

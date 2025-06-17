import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button
      mat-raised-button
      color="primary"
      (click)="requestLocation()"
      [disabled]="isLoading"
    >
      <mat-icon>location_on</mat-icon>
      {{ isLoading ? 'Getting Location...' : 'Share My Location' }}
    </button>
  `,
  styles: [
    `
      button {
        margin: 1rem;
      }
      mat-icon {
        margin-right: 8px;
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

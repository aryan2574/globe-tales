import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Location {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private static readonly LOCAL_STORAGE_KEY = 'user_location';
  private hasLocationSubject = new BehaviorSubject<boolean>(false);
  hasLocation$ = this.hasLocationSubject.asObservable();

  constructor() {
    this.checkLocation();
  }

  private checkLocation(): void {
    const location = localStorage.getItem(LocationService.LOCAL_STORAGE_KEY);
    this.hasLocationSubject.next(!!location);
  }

  async getCurrentLocation(): Promise<[number, number]> {
    const location = localStorage.getItem(LocationService.LOCAL_STORAGE_KEY);
    if (location) {
      const { latitude, longitude } = JSON.parse(location);
      return [latitude, longitude];
    }
    throw new Error('Location not available');
  }

  async requestAndSaveLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          // Save to localStorage
          localStorage.setItem(
            LocationService.LOCAL_STORAGE_KEY,
            JSON.stringify({
              latitude: coordinates[0],
              longitude: coordinates[1],
            })
          );
          this.hasLocationSubject.next(true);
          resolve(coordinates);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  clearLocation(): void {
    localStorage.removeItem(LocationService.LOCAL_STORAGE_KEY);
    this.hasLocationSubject.next(false);
  }
}

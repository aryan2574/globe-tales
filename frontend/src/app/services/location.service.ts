import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface Location {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private static readonly LOCAL_STORAGE_KEY = 'user_location';
  private locationSubject = new BehaviorSubject<Location | null>(null);
  public location$ = this.locationSubject.asObservable();

  constructor() {
    this.loadLocationFromStorage();
  }

  private loadLocationFromStorage(): void {
    const storedLocation = localStorage.getItem(
      LocationService.LOCAL_STORAGE_KEY
    );
    if (storedLocation) {
      try {
        const location: Location = JSON.parse(storedLocation);
        this.locationSubject.next(location);
      } catch (error) {
        console.error('Error parsing stored location:', error);
        localStorage.removeItem(LocationService.LOCAL_STORAGE_KEY);
      }
    }
  }

  setLocation(location: Location): void {
    this.locationSubject.next(location);
    localStorage.setItem(
      LocationService.LOCAL_STORAGE_KEY,
      JSON.stringify(location)
    );
  }

  getCurrentLocation(): Observable<Location> {
    const currentLocation = this.locationSubject.getValue();
    if (currentLocation) {
      return of(currentLocation);
    }
    return this.requestAndSaveLocation();
  }

  requestAndSaveLocation(): Observable<Location> {
    return new Observable<Location>((observer) => {
      if (!navigator.geolocation) {
        observer.error(
          new Error('Geolocation is not supported by this browser')
        );
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          localStorage.setItem(
            LocationService.LOCAL_STORAGE_KEY,
            JSON.stringify(location)
          );
          this.locationSubject.next(location);
          observer.next(location);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        },
        { enableHighAccuracy: true }
      );
    });
  }

  clearLocation(): void {
    localStorage.removeItem(LocationService.LOCAL_STORAGE_KEY);
    this.locationSubject.next(null);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Location {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/users`;
  private hasLocationSubject = new BehaviorSubject<boolean>(false);
  hasLocation$ = this.hasLocationSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkLocation();
  }

  private async checkLocation(): Promise<void> {
    try {
      const response = await this.http
        .get<any>(`${this.apiUrl}/location`)
        .toPromise();
      this.hasLocationSubject.next(!!response);
    } catch (error) {
      this.hasLocationSubject.next(false);
    }
  }

  async getCurrentLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];

          try {
            await this.http
              .post(`${this.apiUrl}/location`, { coordinates })
              .toPromise();
            this.hasLocationSubject.next(true);
            resolve(coordinates);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async requestAndSaveLocation(): Promise<[number, number]> {
    try {
      const coordinates = await this.getCurrentLocation();
      return coordinates;
    } catch (error) {
      console.error('Error requesting and saving location:', error);
      throw error;
    }
  }
}

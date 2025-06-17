import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserPlace } from '../models/user-place.model';

@Injectable({
  providedIn: 'root',
})
export class UserPlaceService {
  constructor(private apiService: ApiService) {}

  getAllPlaces(): Observable<UserPlace[]> {
    return this.apiService.get<UserPlace[]>('/places');
  }

  getPlaceById(id: number): Observable<UserPlace> {
    return this.apiService.get<UserPlace>(`/places/${id}`);
  }

  createPlace(place: UserPlace): Observable<UserPlace> {
    return this.apiService.post<UserPlace>('/places', place);
  }

  updatePlace(id: number, place: UserPlace): Observable<UserPlace> {
    return this.apiService.put<UserPlace>(`/places/${id}`, place);
  }

  deletePlace(id: number): Observable<void> {
    return this.apiService.delete(`/places/${id}`);
  }

  getPlacesByUser(userId: string): Observable<UserPlace[]> {
    return this.apiService.get<UserPlace[]>(`/places/user/${userId}`);
  }

  checkPlaceExists(userId: string, siteId: number): Observable<boolean> {
    return this.apiService.get<boolean>(
      `/places/check?userId=${userId}&siteId=${siteId}`
    );
  }

  removePlace(userId: string, siteId: number): Observable<void> {
    return this.apiService.delete(`/places/user/${userId}/site/${siteId}`);
  }

  getPlacesByType(userId: string, siteType: string): Observable<UserPlace[]> {
    return this.apiService.get<UserPlace[]>(
      `/places/user/${userId}/type/${siteType}`
    );
  }

  getPlacesByStatus(
    userId: string,
    visitStatus: string
  ): Observable<UserPlace[]> {
    return this.apiService.get<UserPlace[]>(
      `/places/user/${userId}/status/${visitStatus}`
    );
  }
}

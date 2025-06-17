import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserFavourite } from '../models/user-favourite.model';

@Injectable({
  providedIn: 'root',
})
export class UserFavouriteService {
  constructor(private apiService: ApiService) {}

  getAllFavourites(): Observable<UserFavourite[]> {
    return this.apiService.get<UserFavourite[]>('/favourites');
  }

  getFavouriteById(id: number): Observable<UserFavourite> {
    return this.apiService.get<UserFavourite>(`/favourites/${id}`);
  }

  createFavourite(favourite: UserFavourite): Observable<UserFavourite> {
    return this.apiService.post<UserFavourite>('/favourites', favourite);
  }

  deleteFavourite(id: number): Observable<void> {
    return this.apiService.delete(`/favourites/${id}`);
  }

  getFavouritesByUser(userId: string): Observable<UserFavourite[]> {
    return this.apiService.get<UserFavourite[]>(`/favourites/user/${userId}`);
  }

  checkFavouriteExists(userId: string, siteId: number): Observable<boolean> {
    return this.apiService.get<boolean>(
      `/favourites/check?userId=${userId}&siteId=${siteId}`
    );
  }

  removeFavourite(userId: string, siteId: number): Observable<void> {
    return this.apiService.delete(`/favourites/user/${userId}/site/${siteId}`);
  }

  getFavouritesByType(
    userId: string,
    siteType: string
  ): Observable<UserFavourite[]> {
    return this.apiService.get<UserFavourite[]>(
      `/favourites/user/${userId}/type/${siteType}`
    );
  }
}

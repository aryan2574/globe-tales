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
    return this.apiService.get<UserFavourite[]>('/user-favourites');
  }

  getFavouriteById(id: number): Observable<UserFavourite> {
    return this.apiService.get<UserFavourite>(`/user-favourites/${id}`);
  }

  createFavourite(
    favourite: UserFavourite,
    username?: string,
    password?: string
  ): Observable<UserFavourite> {
    return this.apiService.post<UserFavourite>(
      '/user-favourites',
      favourite,
      username,
      password
    );
  }

  deleteFavourite(id: number): Observable<void> {
    return this.apiService.delete(`/user-favourites/${id}`);
  }

  getFavouritesByUser(
    userId: string,
    username?: string,
    password?: string
  ): Observable<UserFavourite[]> {
    return this.apiService.get<UserFavourite[]>(
      `/user-favourites/user/${userId}`,
      username,
      password
    );
  }

  checkFavouriteExists(userId: string, siteId: number): Observable<boolean> {
    return this.apiService.get<boolean>(
      `/user-favourites/check?userId=${userId}&siteId=${siteId}`
    );
  }

  removeFavourite(
    userId: string,
    siteId: number,
    username?: string,
    password?: string
  ): Observable<void> {
    return this.apiService.delete(
      `/user-favourites/user/${userId}/site/${siteId}`,
      username,
      password
    );
  }

  getFavouritesByType(
    userId: string,
    siteType: string
  ): Observable<UserFavourite[]> {
    return this.apiService.get<UserFavourite[]>(
      `/user-favourites/user/${userId}/type/${siteType}`
    );
  }
}

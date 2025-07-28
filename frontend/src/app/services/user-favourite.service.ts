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

  createFavourite(favourite: UserFavourite): Observable<UserFavourite> {
    return this.apiService.post<UserFavourite>('/user-favourites', favourite);
  }

  deleteFavourite(userId: string, siteId: number): Observable<void> {
    return this.apiService.delete<void>(
      `/user-favourites/user/${userId}/site/${siteId}`
    );
  }

  getFavouritesByUser(userId: string): Observable<UserFavourite[]> {
    return this.apiService.get<UserFavourite[]>(
      `/user-favourites/user/${userId}`
    );
  }

  checkFavouriteExists(userId: string, siteId: number): Observable<boolean> {
    return this.apiService.get<boolean>(
      `/user-favourites/check?userId=${userId}&siteId=${siteId}`
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

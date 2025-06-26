import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { VisitedSite } from '../models/visited-site.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class VisitedSiteService {
  private apiUrl = '/api/visited-sites';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {}

  addVisitedSite(site: VisitedSite): Observable<VisitedSite> {
    return this.http
      .post<VisitedSite>(this.apiUrl, site)
      .pipe(tap(() => this.userService.refreshCurrentUser()));
  }

  getVisitedSitesByUser(userId: string): Observable<VisitedSite[]> {
    return this.http.get<VisitedSite[]>(`${this.apiUrl}/user/${userId}`);
  }

  isSiteVisited(userId: string, placeId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check`, {
      params: { userId, placeId: placeId.toString() },
    });
  }

  removeVisitedSite(userId: string, placeId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/user/${userId}/place/${placeId}`
    );
  }
}

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

  private getAuthHeaders(): HttpHeaders {
    const creds = this.authService.getCredentials();
    if (!creds) return new HttpHeaders();
    const basicAuth = 'Basic ' + btoa(creds.email + ':' + creds.password);
    return new HttpHeaders().set('Authorization', basicAuth);
  }

  addVisitedSite(site: VisitedSite): Observable<VisitedSite> {
    return this.http
      .post<VisitedSite>(this.apiUrl, site, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap(() => this.userService.refreshCurrentUser()));
  }

  getVisitedSitesByUser(userId: string): Observable<VisitedSite[]> {
    return this.http.get<VisitedSite[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  isSiteVisited(userId: string, placeId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check`, {
      params: { userId, placeId: placeId.toString() },
      headers: this.getAuthHeaders(),
    });
  }

  removeVisitedSite(userId: string, placeId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/user/${userId}/place/${placeId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}

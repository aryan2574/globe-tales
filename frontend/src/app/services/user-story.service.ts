import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStory } from '../models/user-story.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserStoryService {
  private apiUrl = '/api/stories';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const creds = this.authService.getCredentials();
    if (!creds) {
      return new HttpHeaders();
    }
    const basicAuth = 'Basic ' + btoa(creds.email + ':' + creds.password);
    return new HttpHeaders().set('Authorization', basicAuth);
  }

  createStory(story: UserStory): Observable<UserStory> {
    const headers = this.getAuthHeaders();
    return this.http.post<UserStory>(this.apiUrl, story, { headers });
  }

  getStories(): Observable<UserStory[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserStory[]>(this.apiUrl, { headers });
  }

  getStory(id: string): Observable<UserStory> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserStory>(`${this.apiUrl}/${id}`, { headers });
  }

  updateStory(id: string, story: UserStory): Observable<UserStory> {
    const headers = this.getAuthHeaders();
    return this.http.put<UserStory>(`${this.apiUrl}/${id}`, story, { headers });
  }

  deleteStory(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  markSiteAsVisited(placeId: string): Observable<UserStory> {
    const headers = this.getAuthHeaders();
    return this.http.post<UserStory>(
      `${this.apiUrl}/visit/${placeId}`,
      {},
      { headers }
    );
  }

  getVisitedSites(): Observable<UserStory[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserStory[]>(`${this.apiUrl}/visited`, { headers });
  }
}

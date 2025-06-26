import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStory } from '../models/user-story.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserStoryService {
  private apiUrl = '/api/stories';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createStory(story: UserStory): Observable<UserStory> {
    return this.http.post<UserStory>(this.apiUrl, story);
  }

  getStories(): Observable<UserStory[]> {
    return this.http.get<UserStory[]>(this.apiUrl);
  }

  getStory(id: string): Observable<UserStory> {
    return this.http.get<UserStory>(`${this.apiUrl}/${id}`);
  }

  updateStory(id: string, story: UserStory): Observable<UserStory> {
    return this.http.put<UserStory>(`${this.apiUrl}/${id}`, story);
  }

  deleteStory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markSiteAsVisited(placeId: string): Observable<UserStory> {
    return this.http.post<UserStory>(`${this.apiUrl}/visit/${placeId}`, {});
  }

  getVisitedSites(): Observable<UserStory[]> {
    return this.http.get<UserStory[]>(`${this.apiUrl}/visited`);
  }
}

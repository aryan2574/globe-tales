import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAchievement } from '../models/user-achievement.model';

@Injectable({
  providedIn: 'root',
})
export class UserAchievementService {
  private apiUrl = '/api/user-achievements';

  constructor(private http: HttpClient) {}

  getAchievementsForUser(userId: string): Observable<UserAchievement[]> {
    return this.http.get<UserAchievement[]>(`${this.apiUrl}/user/${userId}`);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserAchievement } from '../models/user-achievement.model';

@Injectable({
  providedIn: 'root',
})
export class UserAchievementService {
  constructor(private apiService: ApiService) {}

  getAllUserAchievements(): Observable<UserAchievement[]> {
    return this.apiService.get<UserAchievement[]>('/user-achievements');
  }

  getUserAchievementById(id: number): Observable<UserAchievement> {
    return this.apiService.get<UserAchievement>(`/user-achievements/${id}`);
  }

  createUserAchievement(
    userAchievement: UserAchievement
  ): Observable<UserAchievement> {
    return this.apiService.post<UserAchievement>(
      '/user-achievements',
      userAchievement
    );
  }

  deleteUserAchievement(id: number): Observable<void> {
    return this.apiService.delete(`/user-achievements/${id}`);
  }

  getUserAchievementsByUser(userId: string): Observable<UserAchievement[]> {
    return this.apiService.get<UserAchievement[]>(
      `/user-achievements/user/${userId}`
    );
  }

  checkUserAchievementExists(
    userId: string,
    achievementCode: string
  ): Observable<boolean> {
    return this.apiService.get<boolean>(
      `/user-achievements/check?userId=${userId}&achievementCode=${achievementCode}`
    );
  }

  unlockAchievement(userId: string, achievementCode: string): Observable<void> {
    return this.apiService.post<void>(
      `/user-achievements/user/${userId}/achievement/${achievementCode}`,
      {}
    );
  }

  getRecentAchievements(
    userId: string,
    limit: number = 5
  ): Observable<UserAchievement[]> {
    return this.apiService.get<UserAchievement[]>(
      `/user-achievements/user/${userId}/recent?limit=${limit}`
    );
  }

  getAchievementsByCategory(
    userId: string,
    category: string
  ): Observable<UserAchievement[]> {
    return this.apiService.get<UserAchievement[]>(
      `/user-achievements/user/${userId}/category/${category}`
    );
  }
}

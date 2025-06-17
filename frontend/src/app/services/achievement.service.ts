import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Achievement } from '../models/achievement.model';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  constructor(private apiService: ApiService) {}

  getAllAchievements(): Observable<Achievement[]> {
    return this.apiService.get<Achievement[]>('/achievements');
  }

  getAchievementByCode(code: string): Observable<Achievement> {
    return this.apiService.get<Achievement>(`/achievements/${code}`);
  }

  createAchievement(achievement: Achievement): Observable<Achievement> {
    return this.apiService.post<Achievement>('/achievements', achievement);
  }

  updateAchievement(
    code: string,
    achievement: Achievement
  ): Observable<Achievement> {
    return this.apiService.put<Achievement>(
      `/achievements/${code}`,
      achievement
    );
  }

  deleteAchievement(code: string): Observable<void> {
    return this.apiService.delete(`/achievements/${code}`);
  }

  getAchievementsByCategory(category: string): Observable<Achievement[]> {
    return this.apiService.get<Achievement[]>(
      `/achievements/category/${category}`
    );
  }

  getAchievementsByDifficulty(difficulty: string): Observable<Achievement[]> {
    return this.apiService.get<Achievement[]>(
      `/achievements/difficulty/${difficulty}`
    );
  }

  getUnlockedAchievements(userId: string): Observable<Achievement[]> {
    return this.apiService.get<Achievement[]>(
      `/achievements/user/${userId}/unlocked`
    );
  }

  getLockedAchievements(userId: string): Observable<Achievement[]> {
    return this.apiService.get<Achievement[]>(
      `/achievements/user/${userId}/locked`
    );
  }

  checkAndAwardAchievements(userId: string): Observable<void> {
    return this.apiService.post<void>(`/achievements/user/${userId}/check`, {});
  }
}

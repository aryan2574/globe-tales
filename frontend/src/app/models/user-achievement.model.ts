import { Achievement } from './achievement.model';
import { User } from './user.model';

export interface UserAchievement {
  id: number;
  userId: string;
  achievementCode: string;
  achievement: Achievement;
  unlockedAt: Date;
}

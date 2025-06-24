import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAchievementService } from '../../../services/user-achievement.service';
import { UserAchievement } from '../../../models/user-achievement.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit {
  achievements: UserAchievement[] = [];
  loading = true;

  constructor(
    private userAchievementService: UserAchievementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userAchievementService
        .getAchievementsForUser(userId)
        .subscribe((data) => {
          this.achievements = data;
          this.loading = false;
        });
    }
  }
}

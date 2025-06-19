import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  icon: string;
}

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="achievements-container">
      <h2>My Rewards</h2>

      <div class="achievements-grid">
        <div *ngIf="loading" class="loading">Loading rewards...</div>
        <div *ngIf="error" class="error">{{ error }}</div>

        <div class="achievement-card" [class.completed]="rewards[0].completed">
          <div class="achievement-icon">
            <i class="fas fa-gift"></i>
          </div>
          <div class="achievement-content">
            <h3>Visit 10 places to get 5 points</h3>
            <p>Track your journey and earn rewards!</p>
            <div class="progress-bar">
              <div
                class="progress"
                [style.width.%]="
                  ((rewards[0].progress || 0) / (rewards[0].total || 1)) * 100
                "
              ></div>
            </div>
            <span class="progress-text">
              {{ rewards[0].progress || 0 }}/{{ rewards[0].total || 10 }}
              <span
                *ngIf="rewards[0].completed"
                style="color:#27ae60;font-weight:600;"
                >Completed!</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./achievements.component.scss'],
})
export class RewardsComponent implements OnInit {
  rewards: { progress: number; total: number; completed: boolean }[] = [];
  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit() {
    this.loadRewards();
  }

  private loadRewards() {
    this.loading = true;
    // Get visited places from localStorage
    let visited: any[] = [];
    try {
      const stored = localStorage.getItem('visited');
      visited = stored ? JSON.parse(stored) : [];
    } catch (e) {
      visited = [];
    }
    const progress = visited.length;
    const total = 10;
    this.rewards = [
      {
        progress,
        total,
        completed: progress >= total,
      },
    ];
    this.loading = false;
  }
}

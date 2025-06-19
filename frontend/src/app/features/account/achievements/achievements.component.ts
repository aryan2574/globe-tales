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
  styles: [
    `
      .achievements-container {
        padding: 2rem;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 2rem;
      }

      .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .achievement-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 1rem;
        transition: all 0.3s ease;

        &.completed {
          background: #f8f9fa;
          border: 2px solid #2ecc71;
        }
      }

      .achievement-icon {
        font-size: 2rem;
        color: #3498db;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: #f8f9fa;
        border-radius: 50%;
      }

      .achievement-content {
        flex: 1;
      }

      h3 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
      }

      p {
        color: #666;
        font-size: 0.9rem;
        margin: 0 0 1rem 0;
      }

      .progress-bar {
        background: #f1f1f1;
        border-radius: 4px;
        height: 8px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }

      .progress {
        background: #3498db;
        height: 100%;
        transition: width 0.3s ease;
      }

      .progress-text {
        font-size: 0.8rem;
        color: #666;
      }

      .loading,
      .error {
        text-align: center;
        padding: 2rem;
        color: #666;
        grid-column: 1 / -1;
      }

      .error {
        color: #e74c3c;
      }
    `,
  ],
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

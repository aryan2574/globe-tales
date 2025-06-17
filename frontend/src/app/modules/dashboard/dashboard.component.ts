import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Welcome to GlobeTales</h1>
        <div class="user-info">
          <span>Welcome, {{ currentUser?.username }}</span>
          <button (click)="logout()" class="btn btn-logout">Logout</button>
        </div>
      </header>
      <main class="dashboard-content">
        <p>Your dashboard content will go here.</p>
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        min-height: 100vh;
        background-color: #f5f5f5;
      }

      .dashboard-header {
        background-color: white;
        padding: 1rem 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .btn-logout {
        padding: 0.5rem 1rem;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .btn-logout:hover {
        background-color: #c82333;
      }

      .dashboard-content {
        padding: 2rem;
      }
    `,
  ],
})
export class DashboardComponent {
  currentUser = this.authService.getCurrentUser();

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}

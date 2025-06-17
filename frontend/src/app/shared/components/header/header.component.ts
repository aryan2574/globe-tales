import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="app-header">
      <nav class="nav-container">
        <div class="nav-brand">
          <a routerLink="/" class="brand-link">GlobeTales</a>
        </div>

        <div class="nav-links">
          <a routerLink="/dashboard" class="nav-link">Explore</a>
          <a routerLink="/sites" class="nav-link">Cultural Sites</a>
          <a routerLink="/account" class="nav-link" *ngIf="isAuthenticated()"
            >My Journey</a
          >
        </div>

        <div class="nav-auth">
          <ng-container *ngIf="isAuthenticated(); else authButtons">
            <button (click)="logout()" class="btn btn-logout">Logout</button>
          </ng-container>
          <ng-template #authButtons>
            <a routerLink="/login" class="btn btn-login">Login</a>
            <a routerLink="/register" class="btn btn-register">Register</a>
          </ng-template>
        </div>
      </nav>
    </header>
  `,
  styles: [
    `
      .app-header {
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
      }

      .brand-link {
        color: #2c3e50;
        text-decoration: none;
      }

      .nav-links {
        display: flex;
        gap: 2rem;
      }

      .nav-link {
        color: #2c3e50;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .nav-link:hover {
        color: #3498db;
      }

      .nav-auth {
        display: flex;
        gap: 1rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .btn-login {
        background-color: transparent;
        color: #3498db;
        border: 1px solid #3498db;
      }

      .btn-login:hover {
        background-color: #3498db;
        color: white;
      }

      .btn-register {
        background-color: #3498db;
        color: white;
        border: 1px solid #3498db;
      }

      .btn-register:hover {
        background-color: #2980b9;
        border-color: #2980b9;
      }

      .btn-logout {
        background-color: #e74c3c;
        color: white;
        border: none;
        cursor: pointer;
      }

      .btn-logout:hover {
        background-color: #c0392b;
      }
    `,
  ],
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }
}

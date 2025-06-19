import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="logo">
        <a routerLink="/">GlobeTales</a>
      </div>
      <nav class="main-nav">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/sites" routerLinkActive="active">Cultural Sites</a>
        <a routerLink="/account" routerLinkActive="active">My Journey</a>
        <a routerLink="/about" routerLinkActive="active">About</a>
      </nav>
      <div class="auth-nav">
        <ng-container *ngIf="isLoggedIn(); else loginButton">
          <button class="btn-logout" (click)="logout()">Logout</button>
        </ng-container>
        <ng-template #loginButton>
          <a routerLink="/auth/login" class="btn-login">Login</a>
        </ng-template>
      </div>
    </header>
  `,
  styles: [
    `
      .app-header {
        background: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .logo a {
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c3e50;
        text-decoration: none;
      }

      .main-nav {
        display: flex;
        gap: 2rem;
        align-items: center;
      }

      .main-nav a {
        color: #2c3e50;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
      }

      .main-nav a:hover {
        background: #f8f9fa;
        color: #3498db;
      }

      .main-nav a.active {
        color: #3498db;
        background: #f8f9fa;
      }

      .auth-nav {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .btn-login {
        background: #3498db;
        color: white;
        padding: 0.5rem 1.5rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .btn-login:hover {
        background: #2980b9;
      }

      .btn-logout {
        background: #e74c3c;
        color: white;
        padding: 0.5rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-logout:hover {
        background: #c0392b;
      }
    `,
  ],
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}

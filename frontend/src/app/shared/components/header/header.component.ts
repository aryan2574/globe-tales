import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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

        <div class="nav-links" [class.active]="isMenuOpen">
          <ng-container *ngIf="isAuthenticated()">
            <a routerLink="/dashboard" class="nav-link">Dashboard</a>
            <a routerLink="/sites" class="nav-link">Cultural Sites</a>
            <a routerLink="/account" class="nav-link">My Journey</a>
          </ng-container>
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

        <button class="menu-toggle" (click)="toggleMenu()" *ngIf="isMobile">
          <span class="menu-icon"></span>
        </button>
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
        position: relative;
      }

      .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 2;
      }

      .brand-link {
        color: #2c3e50;
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .brand-link:hover {
        color: #3498db;
      }

      .nav-links {
        display: flex;
        gap: 2rem;
        align-items: center;
      }

      .nav-link {
        color: #2c3e50;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
        padding: 0.5rem 0;
        position: relative;
      }

      .nav-link:hover {
        color: #3498db;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: #3498db;
        transition: width 0.3s ease;
      }

      .nav-link:hover::after {
        width: 100%;
      }

      .nav-auth {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
        border: none;
        font-size: 0.9rem;
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
      }

      .btn-logout:hover {
        background-color: #c0392b;
      }

      .menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        z-index: 2;
      }

      .menu-icon {
        display: block;
        width: 25px;
        height: 2px;
        background-color: #2c3e50;
        position: relative;
        transition: background-color 0.3s ease;
      }

      .menu-icon::before,
      .menu-icon::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #2c3e50;
        transition: transform 0.3s ease;
      }

      .menu-icon::before {
        transform: translateY(-8px);
      }

      .menu-icon::after {
        transform: translateY(8px);
      }

      @media (max-width: 768px) {
        .menu-toggle {
          display: block;
        }

        .nav-links {
          position: fixed;
          top: 0;
          right: -100%;
          width: 70%;
          height: 100vh;
          background-color: white;
          flex-direction: column;
          padding: 5rem 2rem;
          transition: right 0.3s ease;
          box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
        }

        .nav-links.active {
          right: 0;
        }

        .nav-auth {
          position: fixed;
          bottom: 2rem;
          left: 0;
          right: 0;
          justify-content: center;
          padding: 1rem;
          background-color: white;
          box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
        }
      }
    `,
  ],
})
export class HeaderComponent {
  isMenuOpen = false;
  isMobile = false;

  constructor(private authService: AuthService, private router: Router) {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

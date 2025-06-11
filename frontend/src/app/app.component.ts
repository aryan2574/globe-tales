import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>GlobeTales</h3>
            <p>
              Discover and explore cultural heritage sites around the world.
            </p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <a routerLink="/dashboard">Explore</a>
            <a routerLink="/sites">Cultural Sites</a>
            <a routerLink="/account">My Journey</a>
          </div>
          <div class="footer-section">
            <h3>Connect</h3>
            <a href="#" target="_blank">Twitter</a>
            <a href="#" target="_blank">Facebook</a>
            <a href="#" target="_blank">Instagram</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 GlobeTales. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .app-footer {
        background: #2c3e50;
        color: white;
        padding: 3rem 2rem 1rem;
      }

      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }

      .footer-section h3 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }

      .footer-section a {
        color: #ecf0f1;
        text-decoration: none;
        display: block;
        margin-bottom: 0.5rem;
        transition: color 0.3s ease;
      }

      .footer-section a:hover {
        color: #3498db;
      }

      .footer-bottom {
        max-width: 1200px;
        margin: 2rem auto 0;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        font-size: 0.9rem;
        color: #bdc3c7;
      }
    `,
  ],
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}

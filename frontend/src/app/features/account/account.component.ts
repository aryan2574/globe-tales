import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="account-container">
      <div class="account-sidebar">
        <nav class="account-nav">
          <a routerLink="profile" routerLinkActive="active">Profile</a>
          <a routerLink="favorites" routerLinkActive="active">Favorites</a>
          <a routerLink="visited" routerLinkActive="active">Visited Places</a>
          <a routerLink="achievements" routerLinkActive="active"
            >Achievements</a
          >
        </nav>
      </div>
      <div class="account-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .account-container {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 2rem;
        padding: 2rem;
        min-height: calc(100vh - 4rem);
      }

      .account-sidebar {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .account-nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        a {
          color: #2c3e50;
          text-decoration: none;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          transition: all 0.3s;

          &:hover {
            background: #f5f6fa;
            color: #3498db;
          }

          &.active {
            background: #3498db;
            color: white;
          }
        }
      }

      .account-content {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class AccountComponent {}

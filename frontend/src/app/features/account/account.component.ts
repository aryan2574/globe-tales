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
          <a routerLink="profile" routerLinkActive="active"
            ><i class="fas fa-user"></i> Profile</a
          >
          <a routerLink="favorites" routerLinkActive="active"
            ><i class="fas fa-star"></i> Favorites</a
          >
          <a routerLink="visited" routerLinkActive="active"
            ><i class="fas fa-map-marked-alt"></i> Visited Places</a
          >
          <a routerLink="achievements" routerLinkActive="active"
            ><i class="fas fa-award"></i> Achievements</a
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
        grid-template-columns: 270px 1fr;
        gap: 2rem;
        padding: 2rem;
        min-height: calc(100vh - 4rem);
      }

      .account-sidebar {
        background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
        border-radius: 16px;
        padding: 2rem 1.5rem;
        box-shadow: 0 8px 32px rgba(44, 62, 80, 0.1);
        font-family: 'Montserrat', Arial, sans-serif;
      }

      .account-nav {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        a {
          color: #1a5276;
          text-decoration: none;
          padding: 0.85rem 1.2rem;
          border-radius: 8px;
          font-size: 1.08rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          transition: all 0.3s;
          position: relative;
          i {
            font-size: 1.1rem;
            color: #3498db;
            min-width: 20px;
            text-align: center;
          }
          &:hover {
            background: #f5fafd;
            color: #3498db;
            i {
              color: #2ecc71;
            }
          }
          &.active {
            background: #3498db;
            color: white;
            border-left: 5px solid #2ecc71;
            i {
              color: #fff;
            }
          }
        }
      }

      .account-content {
        background: rgba(255, 255, 255, 0.97);
        border-radius: 16px;
        padding: 2.5rem 2rem;
        box-shadow: 0 8px 32px rgba(44, 62, 80, 0.1);
      }
    `,
  ],
})
export class AccountComponent {}

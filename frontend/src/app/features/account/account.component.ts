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
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {}

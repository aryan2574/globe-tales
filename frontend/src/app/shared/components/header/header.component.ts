import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AchievementService } from '../../../services/achievement.service';
import { Achievement } from '../../../models/achievement.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="app-header">
      <nav class="nav-container">
        <div class="nav-brand">
          <a class="brand-link" (click)="onBrandClick($event)">GlobeTales</a>
          <span
            *ngIf="isAuthenticated()"
            class="user-status"
            [title]="statusTooltip"
          >
            <i class="fas" [ngClass]="statusIcon" style="margin-right:4px;"></i>
            <span class="status-name">{{ userStatus }}</span>
            <ng-container *ngIf="pointsToNext !== null">
              <div class="status-next">
                Get {{ pointsToNext }} more points to become next status
              </div>
            </ng-container>
          </span>
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
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isMobile = false;
  userStatus: string = '';
  statusIcon: string = 'fa-compass';
  statusTooltip: string = '';
  pointsToNext: number | null = null;
  points: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private achievementService: AchievementService
  ) {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  ngOnInit(): void {
    console.log('Header ngOnInit, isAuthenticated:', this.isAuthenticated());
    if (this.isAuthenticated()) {
      this.loadUserStatus();
    }
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

  loadUserStatus(): void {
    // Simulate unlocked achievements from localStorage
    const unlocked = localStorage.getItem('unlockedAchievements');
    let achievements: any[] = [];
    try {
      achievements = unlocked ? JSON.parse(unlocked) : [];
    } catch (e) {
      achievements = [];
    }
    this.points = (achievements?.length || 0) * 5;
    if (this.points >= 40) {
      this.userStatus = 'Adventurer';
      this.statusIcon = 'fa-hiking';
      this.statusTooltip = '40+ points';
      this.pointsToNext = null;
    } else if (this.points >= 20) {
      this.userStatus = 'Pro Explorer';
      this.statusIcon = 'fa-map-marked-alt';
      this.statusTooltip = '20+ points';
      this.pointsToNext = 40 - this.points;
    } else {
      this.userStatus = 'Explorer';
      this.statusIcon = 'fa-compass';
      this.statusTooltip = '0+ points';
      this.pointsToNext = 20 - this.points;
    }
  }

  onBrandClick(event: Event) {
    event.preventDefault();
    if (this.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}

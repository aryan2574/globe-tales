import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { Subscription } from 'rxjs';
import { LEVEL_CONFIG, Level } from '../../../config/gamification.config';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="app-header">
      <nav class="nav-container">
        <div class="nav-brand">
          <div class="brand-container">
            <a class="brand-link" (click)="onBrandClick($event)">GlobeTales</a>
            <span class="tagline">Every place has a story</span>
          </div>
          <div *ngIf="isAuthenticated()" class="user-status-container">
            <div class="user-level">
              <i class="fas fa-star"></i>
              <span>{{ user?.level || 'Beginner' }}</span>
            </div>
            <div class="xp-bar-container">
              <div class="xp-bar" [style.width.%]="levelProgress"></div>
            </div>
            <div class="xp-text">
              {{ user?.experiencePoints || 0 }} / {{ nextLevelThreshold }} XP
            </div>
          </div>
        </div>

        <div class="nav-links" [class.active]="isMenuOpen">
          <ng-container *ngIf="isAuthenticated()">
            <a routerLink="/dashboard" class="nav-link">Dashboard</a>
            <a routerLink="/sites" class="nav-link">Cultural Sites</a>
            <a routerLink="/my-story" class="nav-link">My Story</a>
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
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isMobile = false;
  user: User | null = null;
  private userSubscription: Subscription | undefined;

  levelProgress = 0;
  nextLevelThreshold = 100;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.userService.getCurrentUser().subscribe();
      this.userSubscription = this.userService.currentUser.subscribe(
        (user: User | null) => {
          this.user = user;
          this.updateGamificationStatus();
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  private updateGamificationStatus(): void {
    if (!this.user || !this.user.level) {
      this.levelProgress = 0;
      this.nextLevelThreshold = LEVEL_CONFIG.Beginner.threshold;
      return;
    }
    const currentLevelKey = this.user.level as Level;
    const levelConf = LEVEL_CONFIG[currentLevelKey];

    if (levelConf && levelConf.nextLevel) {
      const nextLevelConf = LEVEL_CONFIG[levelConf.nextLevel as Level];
      const prevLevelThreshold =
        currentLevelKey === 'Beginner'
          ? 0
          : LEVEL_CONFIG[this.getPreviousLevel(currentLevelKey)].threshold;

      const totalPointsForLevel = nextLevelConf.threshold - prevLevelThreshold;
      const pointsInCurrentLevel =
        (this.user.experiencePoints || 0) - prevLevelThreshold;

      this.levelProgress = (pointsInCurrentLevel / totalPointsForLevel) * 100;
      this.nextLevelThreshold = nextLevelConf.threshold;
    } else {
      this.levelProgress = 100;
      this.nextLevelThreshold = this.user.experiencePoints || 0;
    }
  }

  private getPreviousLevel(level: Level): Level {
    const levels = Object.keys(LEVEL_CONFIG) as Level[];
    const currentIndex = levels.indexOf(level);
    return currentIndex > 0 ? levels[currentIndex - 1] : 'Beginner';
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

  onBrandClick(event: Event) {
    event.preventDefault();
    if (this.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}

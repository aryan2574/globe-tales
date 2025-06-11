import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./features/account/account.component').then(
        (m) => m.AccountComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/account/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/account/favorites/favorites.component').then(
            (m) => m.FavoritesComponent
          ),
      },
      {
        path: 'visited',
        loadComponent: () =>
          import('./features/account/visited/visited.component').then(
            (m) => m.VisitedComponent
          ),
      },
      {
        path: 'achievements',
        loadComponent: () =>
          import('./features/account/achievements/achievements.component').then(
            (m) => m.AchievementsComponent
          ),
      },
    ],
  },
  {
    path: 'sites',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/sites/site-list/site-list.component').then(
            (m) => m.SiteListComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/sites/site-detail/site-detail.component').then(
            (m) => m.SiteDetailComponent
          ),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [authGuard],
  },
];

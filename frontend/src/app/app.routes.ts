import { Routes } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'sites',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/sites/site-list/site-list.component').then(
            (m) => m.SiteListComponent
          ),
      },
      {
        path: 'account',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/account/account.component').then(
            (m) => m.AccountComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
];

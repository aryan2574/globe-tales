import { Routes } from '@angular/router';
import { AccountComponent } from './features/account/account.component';

export const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: '', redirectTo: '/account', pathMatch: 'full' },
];

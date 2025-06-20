import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../features/dashboard/dashboard.component';
import { MapComponent } from '../../shared/components/map/map.component';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashboardComponent,
    MapComponent,
  ],
})
export class DashboardModule {}

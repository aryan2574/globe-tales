import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Site {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedDate: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>Admin Dashboard</h1>
        <div class="admin-stats">
          <div class="stat-card">
            <h3>Pending Sites</h3>
            <p class="stat-number">{{ pendingSites.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Total Sites</h3>
            <p class="stat-number">{{ sites.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Total Users</h3>
            <p class="stat-number">{{ totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="admin-content">
        <div class="sites-section">
          <h2>Site Submissions</h2>
          <div class="filter-controls">
            <select
              [(ngModel)]="statusFilter"
              (change)="onStatusFilterChange()"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div class="sites-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let site of filteredSites">
                  <td>{{ site.name }}</td>
                  <td>{{ site.type }}</td>
                  <td>{{ site.submittedBy }}</td>
                  <td>{{ site.submittedDate | date }}</td>
                  <td>
                    <span class="status-badge" [class]="site.status">
                      {{ site.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-view" (click)="viewSite(site)">
                        View
                      </button>
                      <button
                        *ngIf="site.status === 'pending'"
                        class="btn-approve"
                        (click)="approveSite(site)"
                      >
                        Approve
                      </button>
                      <button
                        *ngIf="site.status === 'pending'"
                        class="btn-reject"
                        (click)="rejectSite(site)"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  sites: Site[] = [];
  filteredSites: Site[] = [];
  statusFilter = 'all';
  totalUsers = 0;

  get pendingSites() {
    return this.sites.filter((site) => site.status === 'pending');
  }

  constructor() {}

  ngOnInit() {
    this.loadSites();
  }

  private loadSites() {
    // TODO: Implement loading sites from the backend
    // For now, using mock data
    this.sites = [
      {
        id: '1',
        name: 'New Museum',
        type: 'museum',
        status: 'pending',
        submittedBy: 'user1',
        submittedDate: '2024-03-15',
      },
      {
        id: '2',
        name: 'Historic Church',
        type: 'religious',
        status: 'approved',
        submittedBy: 'user2',
        submittedDate: '2024-03-10',
      },
      {
        id: '3',
        name: 'Art Gallery',
        type: 'museum',
        status: 'rejected',
        submittedBy: 'user3',
        submittedDate: '2024-03-05',
      },
    ];
    this.filteredSites = [...this.sites];
    this.totalUsers = 150; // Mock data
  }

  onStatusFilterChange() {
    if (this.statusFilter === 'all') {
      this.filteredSites = [...this.sites];
    } else {
      this.filteredSites = this.sites.filter(
        (site) => site.status === this.statusFilter
      );
    }
  }

  viewSite(site: Site) {
    // TODO: Implement viewing site details
  }

  approveSite(site: Site) {
    // TODO: Implement site approval
  }

  rejectSite(site: Site) {
    // TODO: Implement site rejection
  }
}

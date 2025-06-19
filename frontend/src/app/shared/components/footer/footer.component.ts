import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>GlobeTales</h3>
          <p>Discover and explore cultural heritage sites around the world.</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/sites">Cultural Sites</a>
          <a routerLink="/account">My Journey</a>
        </div>
        <div class="footer-section">
          <h3>Connect</h3>
          <a href="#" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
          <a href="#" target="_blank"
            ><i class="fab fa-facebook"></i> Facebook</a
          >
          <a href="#" target="_blank"
            ><i class="fab fa-instagram"></i> Instagram</a
          >
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 GlobeTales. All rights reserved.</p>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {}

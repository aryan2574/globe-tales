import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <h1>About GlobeTales</h1>
      <p>
        Welcome to GlobeTales, your personal travel companion and story
        collector.
      </p>
      <p>
        Our mission is to help travelers document and share their adventures
        while exploring the world's most fascinating destinations.
      </p>
      <p>
        Whether you're a seasoned globetrotter or planning your first journey,
        GlobeTales provides the tools and community to make your travel
        experiences more meaningful and memorable.
      </p>
    </div>
  `,
  styles: [
    `
      .about-container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 0 1rem;
      }
      h1 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
      }
      p {
        line-height: 1.6;
        margin-bottom: 1rem;
        color: #34495e;
      }
    `,
  ],
})
export class AboutComponent {}

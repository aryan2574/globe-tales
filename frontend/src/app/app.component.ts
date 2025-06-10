import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'GlobeTales';

  constructor(private router: Router) {}

  ngOnInit() {
    // Remove automatic navigation since we have a default route
  }

  navigateToAccount() {
    this.router.navigate(['/account']);
  }
}

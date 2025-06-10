import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: new Date('2024-01-01'),
  };
}

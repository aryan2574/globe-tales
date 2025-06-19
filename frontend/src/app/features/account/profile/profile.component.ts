import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <h2>Profile Information</h2>
      <form
        [formGroup]="profileForm"
        (ngSubmit)="onSubmit()"
        class="profile-form"
      >
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            formControlName="username"
            placeholder="Enter your username"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="Enter your email"
            readonly
          />
        </div>
        <div class="form-group">
          <label for="location">Location</label>
          <input
            type="text"
            id="location"
            formControlName="location"
            placeholder="Your location"
          />
        </div>
        <button type="submit" class="btn-save" [disabled]="profileForm.invalid">
          Save Changes
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      location: [''],
    });
  }

  ngOnInit() {
    // Load user profile data
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          location: user.location || '',
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Update user profile
      console.log('Profile update:', this.profileForm.value);
    }
  }
}

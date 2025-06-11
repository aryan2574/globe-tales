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
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            placeholder="Enter your full name"
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
          <label for="currentLocation">Current Location</label>
          <input
            type="text"
            id="currentLocation"
            formControlName="currentLocation"
            placeholder="Your current location"
          />
        </div>
        <button type="submit" class="btn-save" [disabled]="profileForm.invalid">
          Save Changes
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .profile-container {
        max-width: 600px;
        margin: 0 auto;

        h2 {
          color: #2c3e50;
          margin-bottom: 2rem;
          font-size: 1.8rem;
        }
      }

      .profile-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-group {
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;

          &:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          }

          &[readonly] {
            background-color: #f5f6fa;
            cursor: not-allowed;
          }
        }
      }

      .btn-save {
        padding: 0.75rem;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: #2980b9;
        }

        &:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currentLocation: [''],
    });
  }

  ngOnInit() {
    // Load user profile data
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          currentLocation: user.currentLocation,
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

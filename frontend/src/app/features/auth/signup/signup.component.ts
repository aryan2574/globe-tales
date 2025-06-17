import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <h2>Create an Account</h2>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="form-control"
              [class.is-invalid]="
                signupForm.get('name')?.invalid &&
                signupForm.get('name')?.touched
              "
            />
            <div
              class="error-message"
              *ngIf="
                signupForm.get('name')?.invalid &&
                signupForm.get('name')?.touched
              "
            >
              Please enter your full name
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="
                signupForm.get('email')?.invalid &&
                signupForm.get('email')?.touched
              "
            />
            <div
              class="error-message"
              *ngIf="
                signupForm.get('email')?.invalid &&
                signupForm.get('email')?.touched
              "
            >
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.is-invalid]="
                signupForm.get('password')?.invalid &&
                signupForm.get('password')?.touched
              "
            />
            <div
              class="error-message"
              *ngIf="
                signupForm.get('password')?.invalid &&
                signupForm.get('password')?.touched
              "
            >
              Password must be at least 6 characters
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="signupForm.invalid"
            class="btn-signup"
          >
            Sign Up
          </button>

          <div class="auth-links">
            Already have an account? <a routerLink="/login">Sign In</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.errorMessage = '';
      const { name, email, password } = this.signupForm.value;
      this.authService.register({ username: name, email, password }).subscribe({
        next: () => {
          this.router.navigate(['/account']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.errorMessage =
            error.error?.message || 'Registration failed. Please try again.';
        },
      });
    }
  }
}

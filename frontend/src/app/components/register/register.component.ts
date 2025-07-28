import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <form
        [formGroup]="registerForm"
        (ngSubmit)="onSubmit()"
        class="register-form"
      >
        <h2>Register</h2>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            formControlName="username"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('username')"
          />
          <div class="invalid-feedback" *ngIf="isFieldInvalid('username')">
            Username is required and must be between 3 and 50 characters
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('email')"
          />
          <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
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
            [class.is-invalid]="isFieldInvalid('password')"
          />
          <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
            Password must be at least 6 characters
          </div>
        </div>

        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="registerForm.invalid || isLoading"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>

        <div class="mt-3">
          <a routerLink="/login">Already have an account? Login here</a>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, email, password } = this.registerForm.value;

      this.authService.register({ username, email, password }).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message || 'An error occurred during registration';
        },
      });
    }
  }
}

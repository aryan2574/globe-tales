import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap, map } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/auth.model';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'current_user';
  private readonly CREDENTIALS_KEY = 'auth_credentials';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => !!user)
  );

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/register`, request)
      .pipe(
        tap((response) => {
          this.handleAuthResponse(response);
          this.storeCredentials(request.email, request.password);
        }),
        catchError(this.handleError)
      );
  }

  login(email: string, password: string): Observable<User> {
    const loginRequest: LoginRequest = { email, password };
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, loginRequest)
      .pipe(
        tap((response) => {
          this.storeCredentials(email, password);
          this.handleAuthResponse(response);
        }),
        map((response) => response.user),
        catchError((error: HttpErrorResponse) => {
          const errorMessage =
            error.error?.message ||
            'Login failed due to an unknown error. Please try again.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.CREDENTIALS_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  updateCurrentUser(user: User): void {
    this.handleAuthResponse({ user });
  }

  getCredentials(): { email: string; password: string } | null {
    const creds = localStorage.getItem(this.CREDENTIALS_KEY);
    if (!creds) return null;
    try {
      return JSON.parse(creds);
    } catch {
      return null;
    }
  }

  private storeCredentials(email: string, password: string) {
    localStorage.setItem(
      this.CREDENTIALS_KEY,
      JSON.stringify({ email, password })
    );
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (!response.user) {
      throw new Error('Invalid auth response: missing user');
    }

    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    } catch (error) {
      console.error('Error storing auth data:', error);
      this.logout();
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth service error:', error);
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}

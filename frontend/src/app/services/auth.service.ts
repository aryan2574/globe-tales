import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    currentLocation?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<
    LoginResponse['user'] | null
  >(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private platformId = inject(PLATFORM_ID);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      // Check if user is already logged in
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser && storedUser !== 'undefined') {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
          this.setupTokenExpiration();
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          this.logout();
        }
      }
    }
  }

  private setupTokenExpiration() {
    // Clear any existing timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    // Set new timer for 30 minutes
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/register`, {
        name,
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (isPlatformBrowser(this.platformId)) {
            // Store user details and token in local storage
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
          }
          this.currentUserSubject.next(response.user);
          this.setupTokenExpiration();
        })
      );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (isPlatformBrowser(this.platformId)) {
            // Store user details and token in local storage
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
          }
          this.currentUserSubject.next(response.user);
          this.setupTokenExpiration();
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Clear the token expiration timer
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }

      // Call logout endpoint
      this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
        complete: () => {
          // Remove user from local storage and set current user to null
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Logout error:', error);
          // Still clear local storage and redirect even if the server call fails
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        },
      });
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
}

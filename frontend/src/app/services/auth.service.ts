import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  throwError,
  tap,
  Subject,
  takeUntil,
} from 'rxjs';
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
export class AuthService implements OnDestroy {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';
  private destroy$ = new Subject<void>();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private cachedToken: string | null = null;

  constructor(private http: HttpClient) {
    this.loadStoredUser();
    this.cachedToken = localStorage.getItem(this.TOKEN_KEY);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError(this.handleError),
        takeUntil(this.destroy$)
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/authenticate`, request)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError(this.handleError),
        takeUntil(this.destroy$)
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.cachedToken = null;
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh-token`, null, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError((error) => {
          this.logout();
          return this.handleError(error);
        }),
        takeUntil(this.destroy$)
      );
  }

  getToken(): string | null {
    if (!this.cachedToken) {
      this.cachedToken = localStorage.getItem(this.TOKEN_KEY);
    }
    return this.cachedToken;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (!response.token || !response.refreshToken) {
      throw new Error('Invalid auth response: missing tokens');
    }

    try {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
      this.cachedToken = response.token;
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

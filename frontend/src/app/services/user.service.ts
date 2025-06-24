import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { LocationDTO } from '../models/location.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/me`)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  getUserById(
    id: string,
    username?: string,
    password?: string
  ): Observable<User> {
    return this.apiService.get<User>(`/users/${id}`, username, password);
  }

  createUser(user: User, password: string): Observable<User> {
    return this.apiService.post<User>(`/users?password=${password}`, user);
  }

  updateUser(id: string, user: User): Observable<User> {
    const creds = this.authService.getCredentials();
    return this.apiService.put<User>(
      `/users/${id}`,
      user,
      creds?.email,
      creds?.password
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.apiService.delete(`/users/${id}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.apiService.get<boolean>(`/users/check/email?email=${email}`);
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.apiService.get<boolean>(
      `/users/check/username?username=${username}`
    );
  }

  updateCurrentUserLocation(location: LocationDTO): Observable<void> {
    const creds = this.authService.getCredentials();
    return this.apiService
      .put<void>(`/users/location`, location, creds?.email, creds?.password)
      .pipe(tap(() => this.getCurrentUser().subscribe()));
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { LocationDTO } from '../models/location.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getCurrentUser(): Observable<User> {
    const creds = this.authService.getCredentials();
    return this.apiService.get<User>(
      '/users/current',
      creds?.email,
      creds?.password
    );
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
    return this.apiService.put<User>(`/users/${id}`, user);
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
    return this.apiService.put<void>(
      `/users/location`,
      location,
      creds?.email,
      creds?.password
    );
  }
}

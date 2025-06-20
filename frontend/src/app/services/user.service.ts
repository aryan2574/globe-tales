import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getCurrentUser(username?: string, password?: string): Observable<User> {
    return this.apiService.get<User>('/users/current', username, password);
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

  updateUserLocation(
    id: string,
    latitude: number,
    longitude: number,
    email?: string,
    password?: string
  ): Observable<void> {
    return this.apiService.post<void>(
      `/users/${id}/location`,
      {
        latitude,
        longitude,
      },
      email,
      password
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.apiService.get<boolean>(`/users/check/email?email=${email}`);
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.apiService.get<boolean>(
      `/users/check/username?username=${username}`
    );
  }
}

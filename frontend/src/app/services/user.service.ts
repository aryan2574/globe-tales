import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>('/users/current');
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`/users/${id}`);
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
    longitude: number
  ): Observable<void> {
    return this.apiService.put<void>(
      `/users/${id}/location?latitude=${latitude}&longitude=${longitude}`,
      {}
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

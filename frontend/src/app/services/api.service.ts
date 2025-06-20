import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || error.message;
    }
    return throwError(() => new Error(errorMessage));
  }

  // Helper to create Basic Auth headers
  private createAuthHeaders(username: string, password: string): HttpHeaders {
    const credentials = btoa(`${username}:${password}`);
    return new HttpHeaders({
      Authorization: `Basic ${credentials}`,
    });
  }

  get<T>(path: string, username?: string, password?: string): Observable<T> {
    const headers =
      username && password
        ? this.createAuthHeaders(username, password)
        : undefined;
    return this.http
      .get<T>(`${this.apiUrl}${path}`, { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  post<T>(
    path: string,
    body: any,
    username?: string,
    password?: string
  ): Observable<T> {
    const headers =
      username && password
        ? this.createAuthHeaders(username, password)
        : undefined;
    return this.http
      .post<T>(`${this.apiUrl}${path}`, body, {
        headers,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  put<T>(
    path: string,
    body: any,
    username?: string,
    password?: string
  ): Observable<T> {
    const headers =
      username && password
        ? this.createAuthHeaders(username, password)
        : undefined;
    return this.http
      .put<T>(`${this.apiUrl}${path}`, body, { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  delete<T = void>(
    path: string,
    username?: string,
    password?: string
  ): Observable<T> {
    const headers =
      username && password
        ? this.createAuthHeaders(username, password)
        : undefined;
    return this.http
      .delete<T>(`${this.apiUrl}${path}`, { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
  }
}

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

  get<T>(path: string): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}${path}`)
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  delete<T = void>(path: string): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}${path}`)
      .pipe(catchError(this.handleError));
  }
}

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip token for auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = authService.getToken();
  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 403) {
        // Try to refresh token if we have a refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap((response) => {
              // Retry the original request with the new token
              const newAuthReq = req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${response.token}`
                ),
              });
              return next(newAuthReq);
            }),
            catchError((refreshError) => {
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          authService.logout();
        }
      }
      return throwError(() => error);
    })
  );
};

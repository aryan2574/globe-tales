import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const credentials = this.authService.getCredentials();
    if (credentials) {
      const { email, password } = credentials;
      const headers = req.headers.set(
        'Authorization',
        'Basic ' + btoa(`${email}:${password}`)
      );
      const authReq = req.clone({ headers });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}

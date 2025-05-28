

import { HttpInterceptorFn, HttpRequest, HttpHandler } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authHeader = authService.getAuthHeader();

  let authReq = req;
  if (authHeader) {
    authReq = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
  }

  return next(authReq);
};

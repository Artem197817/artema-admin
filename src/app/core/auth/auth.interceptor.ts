

import {
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import {BehaviorSubject, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  const token = authService.getToken();

  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  // Используем BehaviorSubject для отслеживания обновления токена
  let isRefreshing = false;
  const refreshTokenSubject = new BehaviorSubject<string | null>(null);

  const handle401Error = (
    request: HttpRequest<unknown>,
    nextFn: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> => {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((res) => {
          isRefreshing = false;
          refreshTokenSubject.next(res.accessToken);
          return nextFn(
            request.clone({
              headers: request.headers.set('Authorization', `Bearer ${res.accessToken}`)
            })
          );
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      return refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) =>
          nextFn(
            request.clone({
              headers: request.headers.set('Authorization', `Bearer ${token!}`)
            })
          )
        )
      );
    }
  };

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(authReq, next);
      }
      return throwError(() => error);
    })
  );
};

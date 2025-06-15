import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

interface AuthResponse {
  accessToken: string;
  refreshToken?: string; // если используете refresh tokens
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private url  = environment.api

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient,
              private router: Router,) {
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(this.url + 'auth/login', {username, password}).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        if (res.refreshToken) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
        }
        this.loggedIn.next(true);
      }),
      map(() => true),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.loggedIn.next(false);
    this.router.navigate(['login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Пример метода для обновления токена (если реализовано на сервере)
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return this.http.post<AuthResponse>('/auth/refresh', {refreshToken}).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        if (res.refreshToken) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Обработка ошибок
    return throwError(() => new Error(error.message || 'Server error'));
  }
}


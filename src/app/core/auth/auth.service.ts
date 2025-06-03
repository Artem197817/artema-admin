import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = environment.api + '/api/user/check';
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private authHeader: string | null = null;

  constructor(private http: HttpClient) {
    const savedAuthHeader = localStorage.getItem('authHeader');
    if (savedAuthHeader) {
      this.authHeader = savedAuthHeader;
      this.loggedInSubject.next(true);
    }
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  getAuthHeader(): string | null {
    return this.authHeader;
  }

  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`)
    });

    return this.http.get('/api/user/check', { headers, responseType: 'text' }).pipe(
      tap(() => {
        this.authHeader = headers.get('Authorization')!;
        this.loggedInSubject.next(true);
        localStorage.setItem('authHeader', this.authHeader);
      }),
      map(() => true),
      catchError(() => {
        this.authHeader = null;
        this.loggedInSubject.next(false);
        localStorage.removeItem('authHeader');
        return of(false);
      })
    );
  }

  logout(): void {
    this.authHeader = null;
    this.loggedInSubject.next(false);
    localStorage.removeItem('authHeader'); // исправлено
  }

}

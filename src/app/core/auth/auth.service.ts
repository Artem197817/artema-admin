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

  constructor(private http: HttpClient) {}

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
      }),
      map(() => true),
      catchError(() => {
        this.authHeader = null;
        this.loggedInSubject.next(false);
        return of(false);
      })
    );
  }

  logout(): void {
    this.authHeader = null;
    this.loggedInSubject.next(false); // исправлено
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError, timeout } from 'rxjs';
import {
  LoginCredentials,
  RegisterDetails,
  SessionUser,
  User
} from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/users';
  private readonly requestTimeoutMs = 8000;
  private readonly storageKey = 'vehicle-service-session';
  private readonly currentUserState = signal<SessionUser | null>(this.readSession());

  readonly currentUser = this.currentUserState.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserState() !== null);

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<SessionUser> {
    const params = new HttpParams()
      .set('email', credentials.email.trim().toLowerCase())
      .set('password', credentials.password);

    return this.http.get<User[]>(this.apiUrl, { params }).pipe(
      timeout(this.requestTimeoutMs),
      switchMap((users) => {
        const user = users[0];
        return user
          ? [this.startSession(user)]
          : throwError(() => new Error('Invalid email or password.'));
      }),
      catchError((error) => this.handleRequestError(error))
    );
  }

  register(details: RegisterDetails): Observable<SessionUser> {
    const email = details.email.trim().toLowerCase();
    const params = new HttpParams().set('email', email);

    return this.http.get<User[]>(this.apiUrl, { params }).pipe(
      timeout(this.requestTimeoutMs),
      switchMap((users) => {
        if (users.length) {
          return throwError(() => new Error('An account with this email already exists.'));
        }

        const user: User = {
          ...details,
          name: details.name.trim(),
          email,
          phone: details.phone.trim(),
          role: 'customer'
        };

        return this.http.post<User>(this.apiUrl, user);
      }),
      map((user) => this.startSession(user)),
      catchError((error) => this.handleRequestError(error))
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserState.set(null);
  }

  hasRole(role: User['role']): boolean {
    return this.currentUserState()?.role === role;
  }

  private startSession(user: User): SessionUser {
    const { password: _password, ...sessionUser } = user;
    localStorage.setItem(this.storageKey, JSON.stringify(sessionUser));
    this.currentUserState.set(sessionUser);
    return sessionUser;
  }

  private readSession(): SessionUser | null {
    try {
      const value = localStorage.getItem(this.storageKey);
      return value ? JSON.parse(value) as SessionUser : null;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private handleRequestError(error: unknown): Observable<never> {
    if (error instanceof Error && (
      error.message === 'Invalid email or password.' ||
      error.message === 'An account with this email already exists.'
    )) {
      return throwError(() => error);
    }

    const isConnectionError = error instanceof HttpErrorResponse && error.status === 0;
    const message = isConnectionError || error instanceof Error
      ? 'Authentication service is unavailable. Start the app with "npm start" and try again.'
      : 'Unable to complete authentication. Please try again.';

    return throwError(() => new Error(message));
  }
}

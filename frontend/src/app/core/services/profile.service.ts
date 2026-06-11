import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/users';

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Failed to load profile. Please try again.')))
    );
  }

  updateProfile(id: number, updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, updates).pipe(
      catchError(() => throwError(() => new Error('Failed to update profile. Please try again.')))
    );
  }
}
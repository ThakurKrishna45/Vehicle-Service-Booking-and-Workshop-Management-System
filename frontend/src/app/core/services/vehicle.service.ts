import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Vehicle } from '../models/vehicle';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/vehicles';

  getVehiclesByUser(userId: number): Observable<Vehicle[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Vehicle[]>(this.apiUrl, { params }).pipe(
      catchError(() => throwError(() => new Error('Failed to load vehicles. Please try again.')))
    );
  }

  getVehicleById(id: number | string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Vehicle not found.')))
    );
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle).pipe(
      catchError(() => throwError(() => new Error('Failed to add vehicle. Please try again.')))
    );
  }

  updateVehicle(id: number | string, vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.apiUrl}/${id}`, vehicle).pipe(
      catchError(() => throwError(() => new Error('Failed to update vehicle. Please try again.')))
    );
  }

  deleteVehicle(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Failed to delete vehicle. Please try again.')))
    );
  }
}
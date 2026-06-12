import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/bookings';

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(
      `${this.apiUrl}/${id}`
    );
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(
      this.apiUrl,
      booking
    );
  }

  updateBooking(
    id: number,
    booking: Booking
  ): Observable<Booking> {

    return this.http.put<Booking>(
      `${this.apiUrl}/${id}`,
      booking
    );

  }

  deleteBooking(id: number) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }
}
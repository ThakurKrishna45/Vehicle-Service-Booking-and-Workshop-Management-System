import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { BookingSlot } from '../models/booking-slot';

@Injectable({
  providedIn: 'root'
})
export class BookingSlotService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/bookingSlots';

  getAllSlots(): Observable<BookingSlot[]> {

    return this.http.get<BookingSlot[]>(
      this.apiUrl
    );

  }

  getAvailableSlots(): Observable<BookingSlot[]> {

    return this.http.get<BookingSlot[]>(
      `${this.apiUrl}?available=true`
    );

  }

}
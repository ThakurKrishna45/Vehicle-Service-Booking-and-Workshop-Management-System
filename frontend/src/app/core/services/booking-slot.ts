import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingSlotService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/bookingSlots';

  getAvailableSlots(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}?available=true`
    );

  }

}
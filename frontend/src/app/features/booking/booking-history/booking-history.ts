import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingService } from '../../../core/services/booking';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-history.html',
  styleUrl: './booking-history.css'
})
export class BookingHistoryComponent implements OnInit {

  private bookingApi = inject(BookingService);

  bookings = signal<any[]>([]);

  ngOnInit(): void {

    this.bookingApi
      .getBookings()
      .subscribe(data => {

        console.log('Bookings:', data);

        this.bookings.set(data);

      });

  }

}
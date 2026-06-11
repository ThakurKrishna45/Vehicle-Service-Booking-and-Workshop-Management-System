import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingService } from '../../../core/services/booking';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-booking-history',
  imports: [CommonModule,
     FormsModule
  ],
  templateUrl: './booking-history.html',
  styleUrl: './booking-history.css'
})
export class BookingHistoryComponent implements OnInit {

  private bookingApi = inject(BookingService);

  bookings = signal<any[]>([]);
  selectedStatus = '';

  ngOnInit(): void {

    this.bookingApi
      .getBookings()
      .subscribe(data => {

        console.log('Bookings:', data);

        this.bookings.set(data);

      });

  }
  get filteredBookings() {

  if (!this.selectedStatus) {
    return this.bookings();
  }

  return this.bookings().filter(
    booking =>
      booking.status === this.selectedStatus
  );

}

}
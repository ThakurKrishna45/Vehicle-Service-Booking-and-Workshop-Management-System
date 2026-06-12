import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookingService } from '../../../core/services/booking';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './booking-history.html',
  styleUrl: './booking-history.css'
})
export class BookingHistoryComponent implements OnInit {

  private bookingApi =
    inject(BookingService);

  private auth =
    inject(AuthService);

  bookings =
    signal<any[]>([]);

  selectedStatus = '';

  ngOnInit(): void {

    const currentUser =
      this.auth.currentUser();

    this.bookingApi
      .getBookings()
      .subscribe(data => {

        console.log(
          'All Bookings:',
          data
        );

        const filteredData =
          currentUser?.role === 'admin'
            ? data
            : data.filter(
                booking =>
                  String(booking.userId) ===
                  String(currentUser?.id)
              );

        this.bookings.set(
          filteredData
        );

      });

  }

  get filteredBookings() {

    if (!this.selectedStatus) {
      return this.bookings();
    }

    return this.bookings().filter(
      booking =>
        booking.status ===
        this.selectedStatus
    );

  }

}
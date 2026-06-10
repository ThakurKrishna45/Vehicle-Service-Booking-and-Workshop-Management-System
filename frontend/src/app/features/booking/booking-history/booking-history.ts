import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { BookingService } from '../../../core/services/booking';

import { Booking }
from '../../../core/models/booking';

@Component({
  selector:'app-booking-history',
  imports:[CommonModule],
  templateUrl:'./booking-history.html',
  styleUrl:'./booking-history.css'
})
export class BookingHistoryComponent
implements OnInit{

  private bookingApi=
  inject(BookingService);

  bookings:Booking[]=[];

  ngOnInit(): void {

    this.bookingApi
      .getBookings()
      .subscribe(data => {

        this.bookings=data;

      });

  }

}
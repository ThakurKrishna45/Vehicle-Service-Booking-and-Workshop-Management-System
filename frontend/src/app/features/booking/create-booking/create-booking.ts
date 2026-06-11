import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  futureDateValidator
} from '../../../shared/validators/future-date.validator';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { BookingService } from '../../../core/services/booking';
import { BookingSlotService } from '../../../core/services/booking-slot';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-booking.html',
  styleUrls: ['./create-booking.css']
})
export class CreateBookingComponent implements OnInit {

  private fb = inject(FormBuilder);

  private bookingApi = inject(BookingService);

  private slotApi = inject(BookingSlotService);

  bookingForm!: FormGroup;

  slots = signal<any[]>([]);

  ngOnInit(): void {

    this.bookingForm = this.fb.group({

      vehicleId: ['', Validators.required],

      serviceId: ['', Validators.required],

      bookingDate:[
  '',
  [
    Validators.required,
    futureDateValidator
  ]
],

      slot: ['', Validators.required],

      issueDescription: ['']

    });

    this.loadSlots();

  }

  loadSlots() {

    this.slotApi
      .getAvailableSlots()
      .subscribe(data => {

        console.log('Slots:', data);

        this.slots.set(data);

      });

  }

  createBooking() {

    if (this.bookingForm.invalid) {
      return;
    }

    const booking = {

      ...this.bookingForm.value,

      userId: 1,

      status: 'Requested'

    };

    this.bookingApi
      .createBooking(booking)
      .subscribe(() => {

        alert('Booking Created Successfully');

        this.bookingForm.reset();

      });

  }

}
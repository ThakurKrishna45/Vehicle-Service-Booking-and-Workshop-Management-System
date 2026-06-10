import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { BookingService } from '../../../core/services/booking';

@Component({
  selector:'app-create-booking',
  imports:[
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl:'./create-booking.html',
  styleUrl:'./create-booking.css'
})
export class CreateBookingComponent
implements OnInit{

  private fb=inject(FormBuilder);

  private bookingApi=
  inject(BookingService);

  bookingForm!:FormGroup;

  ngOnInit(): void {

    this.bookingForm=this.fb.group({

      vehicleId:['',Validators.required],

      serviceId:['',Validators.required],

      bookingDate:['',Validators.required],

      slot:['',Validators.required],

      issueDescription:['']

    });

  }

  createBooking(){

    const booking={

      ...this.bookingForm.value,

      userId:1,

      status:'Requested'

    };

    this.bookingApi
      .createBooking(booking)
      .subscribe(() => {

        alert('Booking Created');

        this.bookingForm.reset();

      });

  }

}
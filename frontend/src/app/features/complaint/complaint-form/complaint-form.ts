import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './complaint-form.html',
  styleUrls: ['./complaint-form.css']
})
export class ComplaintForm {

  complaintForm: FormGroup;

  categories = [
    'Service Quality',
    'Delayed Delivery',
    'Invoice Issue',
    'Technician Behaviour',
    'Vehicle Damage',
    'Other'
  ];

  constructor(private fb: FormBuilder) {

    this.complaintForm = this.fb.group({

      bookingId: [
        '',
        Validators.required
      ],

      category: [
        '',
        Validators.required
      ],

      subject: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20)
        ]
      ]

    });

  }

  submitComplaint() {

    if (this.complaintForm.valid) {

      console.log(this.complaintForm.value);

      alert('Complaint Submitted Successfully');

      this.complaintForm.reset();

    }

  }

}
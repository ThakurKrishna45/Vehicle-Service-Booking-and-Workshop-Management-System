import {
  Component,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Complaint } from '../../../core/models/complaint';
import { ComplaintService } from '../../../core/services/complaint';

@Component({
  selector: 'app-complaint-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complaint-list.html',
  styleUrl: './complaint-list.css'
})
export class ComplaintList {

  private complaintService =
    inject(ComplaintService);

  complaints =
    signal<Complaint[]>([]);

  constructor() {

    this.loadComplaints();

  }

  loadComplaints(): void {

    this.complaintService
      .getAllComplaints()
      .subscribe({
        next: (data) => {

          console.log(
            'Complaints:',
            data
          );

          this.complaints.set(data);

        },
        error: (err) => {

          console.error(err);

        }
      });

  }

}
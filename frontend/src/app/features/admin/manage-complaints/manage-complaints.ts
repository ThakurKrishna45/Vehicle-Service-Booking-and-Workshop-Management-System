import {
  Component,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ComplaintService } from '../../../core/services/complaint';
import { Complaint } from '../../../core/models/complaint';

@Component({
  selector: 'app-manage-complaints',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-complaints.html',
  styleUrl: './manage-complaints.css'
})
export class ManageComplaints {

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

  markAsResolved(
    complaint: Complaint
  ): void {

    const updatedComplaint = {
      ...complaint,
      status: 'Resolved'
    };

    this.complaintService
      .updateComplaint(
        complaint.id,
        updatedComplaint
      )
      .subscribe(() => {

        this.complaints.update(
          complaints =>
            complaints.map(c =>
              c.id === complaint.id
                ? {
                    ...c,
                    status: 'Resolved'
                  }
                : c
            )
        );

      });

  }

  markAsReview(
    complaint: Complaint
  ): void {

    const updatedComplaint = {
      ...complaint,
      status: 'In Review'
    };

    this.complaintService
      .updateComplaint(
        complaint.id,
        updatedComplaint
      )
      .subscribe(() => {

        this.complaints.update(
          complaints =>
            complaints.map(c =>
              c.id === complaint.id
                ? {
                    ...c,
                    status: 'In Review'
                  }
                : c
            )
        );

      });

  }

}
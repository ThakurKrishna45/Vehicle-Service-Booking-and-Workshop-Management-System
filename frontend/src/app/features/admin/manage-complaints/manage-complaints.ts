import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplaintService } from '../../../core/services/complaint';
import { Complaint } from '../../../core/models/complaint';

@Component({
  selector: 'app-manage-complaints',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-complaints.html',
  styleUrls: ['./manage-complaints.css']
})
export class ManageComplaints implements OnInit {

  complaints: Complaint[] = [];

  constructor(
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {

    this.complaintService
      .getAllComplaints()
      .subscribe(data => {

        this.complaints = data;

      });

  }

  markAsResolved(complaint: Complaint): void {

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

        complaint.status = 'Resolved';

      });

  }

  markAsReview(complaint: Complaint): void {

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

        complaint.status = 'In Review';

      });

  }

}
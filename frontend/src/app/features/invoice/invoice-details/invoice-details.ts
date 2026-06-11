import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Invoice } from '../../../core/models/invoice';
import { InvoiceService } from '../../../core/services/invoice';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-details.html',
  styleUrls: ['./invoice-details.css']
})
export class InvoiceDetails implements OnInit {

  invoice!: Invoice;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.invoiceService
      .getInvoiceById(id)
      .subscribe({
        next: (data) => {
          this.invoice = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  getSubTotal(): number {
    return (
      this.invoice.serviceCharge +
      this.invoice.partsCharge
    );
  }
}
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice';
import { Invoice } from '../../../core/models/invoice';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.css'
})
export class InvoiceDetails {

  private route = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceService);

  invoice = signal<Invoice | null>(null);

  constructor() {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Invoice ID:', id);

    this.invoiceService
      .getInvoiceById(id)
      .subscribe({
        next: data => {
          console.log(data);
          this.invoice.set(data);
        },
        error: err => console.error(err)
      });

  }
}
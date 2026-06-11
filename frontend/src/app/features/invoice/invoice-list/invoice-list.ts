import {
  Component,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Invoice } from '../../../core/models/invoice';
import { InvoiceService } from '../../../core/services/invoice';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css'
})
export class InvoiceList {

  private invoiceService =
    inject(InvoiceService);

  invoices = signal<Invoice[]>([]);

  constructor() {
    this.loadInvoices();
  }

  loadInvoices(): void {

    this.invoiceService
      .getAllInvoices()
      .subscribe({
        next: (data) => {

          console.log(
            'Invoices from API:',
            data
          );

          this.invoices.set(data);
        },
        error: (err) => {

          console.error(
            'Invoice API Error:',
            err
          );
        }
      });

  }
}
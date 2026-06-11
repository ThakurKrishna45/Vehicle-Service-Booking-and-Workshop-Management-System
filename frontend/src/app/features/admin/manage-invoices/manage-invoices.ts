import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Invoice } from '../../../core/models/invoice';
import { InvoiceService } from '../../../core/services/invoice';

@Component({
  selector: 'app-manage-invoices',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-invoices.html',
  styleUrl: './manage-invoices.css'
})
export class ManageInvoices {

  private invoiceService =
    inject(InvoiceService);

  invoices =
    signal<Invoice[]>([]);

  constructor() {

    console.log(
      'ManageInvoices Loaded'
    );

    this.loadInvoices();

  }

  loadInvoices(): void {

    this.invoiceService
      .getAllInvoices()
      .subscribe({
        next: (data) => {

          console.log(
            'Invoices Received:',
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
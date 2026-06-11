import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Invoice } from '../../../core/models/invoice';
import { InvoiceService } from '../../../core/services/invoice';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.css']
})
export class InvoiceList implements OnInit {

  invoices: Invoice[] = [];

  constructor(
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {

  console.log('Invoice List Loaded');

  this.loadInvoices();

  }

  loadInvoices(): void {

  this.invoiceService
    .getAllInvoices()
    .subscribe({
      next: (data) => {

        console.log('Invoices from API:', data);

        this.invoices = data;

      },
      error: (err) => {

        console.error('Invoice API Error:', err);

      }
    });

  }

}
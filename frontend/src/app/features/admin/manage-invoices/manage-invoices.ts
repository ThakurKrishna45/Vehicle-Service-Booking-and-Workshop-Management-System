import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Invoice } from '../../../core/models/invoice';
import { InvoiceService } from '../../../core/services/invoice';

@Component({
  selector: 'app-manage-invoices',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-invoices.html',
  styleUrls: ['./manage-invoices.css']
})
export class ManageInvoices implements OnInit {

  invoices: Invoice[] = [];

  constructor(
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {

  console.log('ManageInvoices Loaded');

  this.invoiceService
    .getAllInvoices()
    .subscribe({
      next: (data) => {

        console.log('Invoices Received:', data);

        this.invoices = data;

      },
      error: (err) => {

        console.error('Invoice API Error:', err);

      }
    });

}

}
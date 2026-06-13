import {
  Component,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Invoice } from '../../../core/models/invoice';
import { InvoiceService } from '../../../core/services/invoice';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking';

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

  private bookingService =
    inject(BookingService);

  private auth =
    inject(AuthService);

  invoices =
    signal<Invoice[]>([]);

  constructor() {
    this.loadInvoices();
  }

  loadInvoices(): void {

    const currentUser =
      this.auth.currentUser();

    console.log(
      'Current User:',
      currentUser
    );

    // Admin → All invoices
    if (currentUser?.role === 'admin') {

      this.invoiceService
        .getAllInvoices()
        .subscribe({

          next: (data) => {

            console.log(
              'All Invoices:',
              data
            );

            this.invoices.set(data);

          },

          error: (err) => {

            console.error(
              'Invoice Error:',
              err
            );

          }

        });

      return;

    }

    // Customer → Only own invoices
    this.bookingService
      .getBookings()
      .subscribe({

        next: (bookings) => {

          console.log(
            'All Bookings:',
            bookings
          );

          const userBookingIds =
            bookings
              .filter(
                booking =>
                  Number(booking.userId) ===
                  Number(currentUser?.id)
              )
              .map(
                booking =>
                  Number(booking.id)
              );

          console.log(
            'User Booking IDs:',
            userBookingIds
          );

          this.invoiceService
            .getAllInvoices()
            .subscribe({

              next: (invoices) => {

                console.log(
                  'All Invoices:',
                  invoices
                );

                const filteredInvoices =
                  invoices.filter(
                    invoice =>
                      userBookingIds.includes(
                        Number(invoice.bookingId)
                      )
                  );

                console.log(
                  'Filtered Invoices:',
                  filteredInvoices
                );

                this.invoices.set(
                  filteredInvoices
                );

              },

              error: (err) => {

                console.error(
                  'Invoice Error:',
                  err
                );

              }

            });

        },

        error: (err) => {

          console.error(
            'Booking Error:',
            err
          );

        }

      });

  }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Invoice } from '../models/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'http://localhost:3000/invoices';

  constructor(private http: HttpClient) {}

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(
      `${this.apiUrl}/${id}`
    );
  }

  getInvoicesByBookingIds(
    bookingIds: number[]
  ): Observable<Invoice[]> {

    return this.http
      .get<Invoice[]>(this.apiUrl)
      .pipe(
        map(invoices =>
          invoices.filter(invoice =>
            bookingIds.includes(
              Number(invoice.bookingId)
            )
          )
        )
      );

  }

  updateInvoice(
    id: number,
    invoice: Invoice
  ): Observable<Invoice> {

    return this.http.put<Invoice>(
      `${this.apiUrl}/${id}`,
      invoice
    );

  }

}
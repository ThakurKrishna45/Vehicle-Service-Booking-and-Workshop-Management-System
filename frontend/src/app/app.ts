import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  template: `
    <h1>Vehicle Service Booking & Workshop Management System</h1>

    <nav>
      <a routerLink="/admin">Admin Dashboard</a> |
      <a routerLink="/invoices">Invoices</a> |
      <a routerLink="/complaint">Complaint</a> |
      <a routerLink="/admin/invoices">Manage Invoices</a> |
      <a routerLink="/admin/complaints">Manage Complaints</a> |
      <a routerLink="/admin/status">Manage Status</a>
    </nav>

    <hr>

    <router-outlet></router-outlet>
  `
})
export class App {
  title = 'vehicle-service-booking-system';
}
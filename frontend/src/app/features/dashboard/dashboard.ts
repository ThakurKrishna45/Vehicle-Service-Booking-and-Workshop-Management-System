import { Component } from '@angular/core';
import { DashboardCard } from '../../shared/components/dashboard-card/dashboard-card';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  totalBookings = 12;
  completedServices = 8;
  inProgress = 2;
  readyForDelivery = 2;

  recentBookings = [
    {
      bookingId: 101,
      vehicle: 'Honda City',
      service: 'Premium Service',
      status: 'Repair'
    },
    {
      bookingId: 102,
      vehicle: 'Hyundai i20',
      service: 'Basic Service',
      status: 'Ready For Delivery'
    },
    {
      bookingId: 103,
      vehicle: 'Tata Nexon',
      service: 'AC Service',
      status: 'Inspection'
    }
  ];

}
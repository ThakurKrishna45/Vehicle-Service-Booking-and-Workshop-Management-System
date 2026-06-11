import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardCard } from '../../shared/components/dashboard-card/dashboard-card';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardCard, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  constructor(private router: Router) {}

  totalBookings = 12;
  completedServices = 8;
  inProgress = 2;
  readyForDelivery = 2;

  recentBookings = [
    { bookingId: 101, vehicle: 'Honda City',   service: 'Premium Service', status: 'Repair'              },
    { bookingId: 102, vehicle: 'Hyundai i20',  service: 'Basic Service',   status: 'Ready For Delivery'  },
    { bookingId: 103, vehicle: 'Tata Nexon',   service: 'AC Service',      status: 'Inspection'          },
  ];

  // Issue 3 fix: navigate to /service-tracking
  goToTracking(): void {
    this.router.navigate(['/service-tracking']);
  }
}

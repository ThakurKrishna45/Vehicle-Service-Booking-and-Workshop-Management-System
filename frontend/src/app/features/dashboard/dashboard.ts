import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardCard } from '../../shared/components/dashboard-card/dashboard-card';
import { Navbar } from '../../shared/components/navbar/navbar';
import { AuthService } from '../../core/services/auth.service';
import {
  DashboardService,
  DashboardPageData,
  ActiveServiceProgress,
  UpcomingAppointment,
  RecentBookingRow,
  DashboardTimelineStage,
} from '../../core/services/dashboard.service';

@Component({
  selector:    'app-dashboard',
  standalone:  true,
  imports:     [CommonModule, RouterLink, DashboardCard, Navbar],
  templateUrl: './dashboard.html',
  styleUrl:    './dashboard.css',
})
export class Dashboard implements OnInit {

  private readonly router           = inject(Router);
  private readonly auth             = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  totalBookings     = 0;
  completedServices = 0;
  inProgress        = 0;
  readyForDelivery  = 0;

  userName             = 'Customer';
  recentBookings:      RecentBookingRow[]            = [];
  activeProgress:      ActiveServiceProgress | null  = null;
  upcomingAppointment: UpcomingAppointment   | null  = null;

  isLoading    = true;
  errorMessage = '';
goToBookings(): void {
  this.router.navigate(['/bookings']);
}
 ngOnInit(): void {

  const currentUser =
    this.auth.currentUser();

  const userId =
    currentUser?.role === 'admin'
      ? null
      : String(currentUser?.id);

  this.dashboardService
    .getDashboardPageData(userId)
    .subscribe({
      next: (data: DashboardPageData) => {

        console.log(
          'Dashboard Data:',
          data
        );

        this.userName =
          data.userName;

        this.totalBookings =
          data.summary.totalBookings;

        this.completedServices =
          data.summary.completedServices;

        this.inProgress =
          data.summary.inProgress;

        this.readyForDelivery =
          data.summary.readyForDelivery;

        this.recentBookings =
          data.recentBookings;

        this.activeProgress =
          data.activeProgress;

        this.upcomingAppointment =
          data.upcomingAppointment;

        this.isLoading = false;

      },
      error: (err) => {

        console.error(
          'Dashboard load failed:',
          err
        );

        this.errorMessage =
          'Could not load dashboard. Ensure the backend is running.';

        this.isLoading = false;

      }
    });

}

  get timelineStages(): DashboardTimelineStage[] {
    return this.activeProgress?.timelineStages ?? [];
  }

  goToTracking(): void {
    this.router.navigate(['/service-tracking']);
  }
}
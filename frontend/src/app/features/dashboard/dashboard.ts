import { Router, RouterLink }        from '@angular/router';
import { DashboardCard }             from '../../shared/components/dashboard-card/dashboard-card';
import { Navbar }                    from '../../shared/components/navbar/navbar';
import { AuthService }               from '../../core/services/auth.service';
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule }              from '@angular/common';
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
  imports:     [CommonModule, DashboardCard, Navbar,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl:    './dashboard.css',
})
export class Dashboard implements OnInit {

  // ── Summary card counts ────────────────────────────────────────────────────
  totalBookings     = signal(0);
  completedServices = signal(0);
  inProgress        = signal(0);
  readyForDelivery  = signal(0);

  // ── Hero section ───────────────────────────────────────────────────────────
  userName = signal('Customer');

  // ── Recent bookings table ──────────────────────────────────────────────────
  recentBookings = signal<RecentBookingRow[]>([]);

  // ── Current service progress card ─────────────────────────────────────────
  activeProgress = signal<ActiveServiceProgress | null>(null);

  // ── Upcoming appointment card ──────────────────────────────────────────────
  upcomingAppointment = signal<UpcomingAppointment | null>(null);

  // ── Loading state ──────────────────────────────────────────────────────────
  isLoading = signal(true);

  // ── Timeline derived from activeProgress signal ────────────────────────────
  timelineStages = computed<DashboardTimelineStage[]>(
    () => this.activeProgress()?.timelineStages ?? []
  );

  constructor(
    private router:           Router,
    private dashboardService: DashboardService,
    private auth:             AuthService,
  ) {}
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

        this.userName.set(
          data.userName
        );

        this.totalBookings.set(
          data.summary.totalBookings
        );

        this.completedServices.set(
          data.summary.completedServices
        );

        this.inProgress.set(
          data.summary.inProgress
        );

        this.readyForDelivery.set(
          data.summary.readyForDelivery
        );

        this.recentBookings.set(
          data.recentBookings
        );

        this.activeProgress.set(
          data.activeProgress
        );

        this.upcomingAppointment.set(
          data.upcomingAppointment
        );

        this.isLoading.set(false);

      },
      error: (err) => {

        console.error(
          'Dashboard data load failed:',
          err
        );

        this.isLoading.set(false);

      }
    });

}

  goToTracking(): void {
    this.router.navigate(['/service-tracking']);
  }
}
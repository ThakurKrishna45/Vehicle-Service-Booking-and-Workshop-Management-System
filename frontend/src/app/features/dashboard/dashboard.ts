
import { Router, RouterLink } from '@angular/router';
import { DashboardCard } from '../../shared/components/dashboard-card/dashboard-card';
import { Navbar } from '../../shared/components/navbar/navbar';
import { AuthService } from '../../core/services/auth.service';
import { Component, OnInit,Inject }   from '@angular/core';
import { CommonModule }          from '@angular/common';
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
  imports:     [CommonModule, DashboardCard, Navbar],
  templateUrl: './dashboard.html',
  styleUrl:    './dashboard.css',
})
export class Dashboard implements OnInit {

  // ── Summary card counts ────────────────────────────────────────────────────
  totalBookings     = 0;
  completedServices = 0;
  inProgress        = 0;
  readyForDelivery  = 0;

  // ── Hero section ───────────────────────────────────────────────────────────
  userName = 'Customer';

  // ── Recent bookings table ──────────────────────────────────────────────────
  recentBookings: RecentBookingRow[] = [];

  // ── Current service progress card ─────────────────────────────────────────
  activeProgress: ActiveServiceProgress | null = null;

  // ── Upcoming appointment card ──────────────────────────────────────────────
  upcomingAppointment: UpcomingAppointment | null = null;

  // ── Loading state ──────────────────────────────────────────────────────────
  isLoading = true;

  constructor(
    private router:           Router,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    // Read the logged-in user's ID from localStorage.
    // Member 1 (Auth module) stores it there after login.
    // If absent during development, userId will be null and all data is shown.
    const userId = localStorage.getItem('userId');

    this.dashboardService.getDashboardPageData(userId).subscribe({
      next: (data: DashboardPageData) => {
        this.userName          = data.userName;
        this.totalBookings     = data.summary.totalBookings;
        this.completedServices = data.summary.completedServices;
        this.inProgress        = data.summary.inProgress;
        this.readyForDelivery  = data.summary.readyForDelivery;
        this.recentBookings    = data.recentBookings;
        this.activeProgress    = data.activeProgress;
        this.upcomingAppointment = data.upcomingAppointment;
        this.isLoading         = false;
      },
      error: (err) => {
        console.error('Dashboard data load failed:', err);
        this.isLoading = false;
      },
    });
  }

  // ── Template helpers ───────────────────────────────────────────────────────

  /** Returns the timeline stages for the active progress card. */
  get timelineStages(): DashboardTimelineStage[] {
    return this.activeProgress?.timelineStages ?? [];
  }

  /** Navigates to the Service Tracking page. */
  goToTracking(): void {
    this.router.navigate(['/service-tracking']);
  }
}
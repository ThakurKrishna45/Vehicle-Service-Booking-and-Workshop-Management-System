import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { User }            from '../models/user';
import { Booking }         from '../models/booking';
import { Vehicle }         from '../models/vehicle';
import { ServicePackage }  from '../models/service-package';
import { ServiceTracking } from '../models/service-tracking';

// ─── Local interfaces ────────────────────────────────────────────────────────

/** Counts used by the Customer Dashboard summary cards. */
export interface DashboardSummary {
  totalBookings:    number;
  completedServices: number;
  inProgress:       number;
  readyForDelivery: number;
}

/** One enriched row for the Recent Bookings table. */
export interface RecentBookingRow {
  bookingId: string;
  vehicle:   string;   // resolved brand + model
  service:   string;   // resolved service package name
  status:    string;
}

/** A single stage entry for the inline dashboard timeline. */
export interface DashboardTimelineStage {
  label:     string;
  status:    'completed' | 'active' | 'pending';
  timestamp: string;
}

/** Data for the Current Service Progress card. */
export interface ActiveServiceProgress {
  bookingId:         string;
  vehicleName:       string;
  registrationNumber: string;
  serviceName:       string;
  currentStage:      string;
  estimatedDelivery: string;
  daysRemaining:     number;
  timelineStages:    DashboardTimelineStage[];
}

/** Data for the Upcoming Appointment card. */
export interface UpcomingAppointment {
  vehicleName:        string;
  serviceName:        string;
  registrationNumber: string;
  bookingDate:        string;
  slot:               string;
  workshopName:       string;
  status:             string;
}

/** Full composed payload returned by getDashboardPageData(). */
export interface DashboardPageData {
  userName:           string;
  summary:            DashboardSummary;
  recentBookings:     RecentBookingRow[];
  activeProgress:     ActiveServiceProgress | null;
  upcomingAppointment: UpcomingAppointment | null;
}

// ─── Stage order ─────────────────────────────────────────────────────────────

const STAGE_ORDER = [
  'Received',
  'Inspection',
  'Repair',
  'Quality Check',
  'Ready For Delivery',
] as const;

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly base = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ── Raw endpoints ──────────────────────────────────────────────────────────

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/users`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}/users/${id}`);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/bookings`);
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.base}/bookings/${id}`);
  }

  getBookingsByUserId(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/bookings?userId=${userId}`);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.base}/vehicles`);
  }

  getServicePackages(): Observable<ServicePackage[]> {
    return this.http.get<ServicePackage[]>(`${this.base}/servicePackages`);
  }

  getServiceTracking(): Observable<ServiceTracking[]> {
    return this.http.get<ServiceTracking[]>(`${this.base}/serviceTracking`);
  }

  // ── Legacy summary (kept for backward-compat) ─────────────────────────────

  getDashboardSummary(): Observable<DashboardSummary> {
    return forkJoin({
      bookings: this.getBookings(),
      tracking: this.getServiceTracking(),
    }).pipe(
      map(({ bookings, tracking }) => this.buildSummary(bookings, tracking))
    );
  }

  // ── Composed page-data method ─────────────────────────────────────────────

  /**
   * Returns everything the Dashboard component needs in a single call.
   *
   * Pass the logged-in userId so that bookings are scoped to that customer.
   * If userId is null/undefined the method returns data for all users
   * (useful during development before auth is wired up).
   */
  getDashboardPageData(userId: string | null): Observable<DashboardPageData> {
    return forkJoin({
      users:           this.getUsers(),
      bookings:        this.getBookings(),
      vehicles:        this.getVehicles(),
      servicePackages: this.getServicePackages(),
      tracking:        this.getServiceTracking(),
    }).pipe(
      map(({ users, bookings, vehicles, servicePackages, tracking }) => {

        // ── lookup maps ────────────────────────────────────────────────────
        const vehicleMap  = new Map(vehicles.map(v  => [String(v.id),  v]));
        const packageMap  = new Map(servicePackages.map(p => [String(p.id), p]));
        const userMap     = new Map(users.map(u => [String(u.id), u]));

        // ── filter bookings to current user (if known) ─────────────────────
        const userBookings = userId
          ? bookings.filter(b => String(b.userId) === String(userId))
          : bookings;

        // ── user display name ──────────────────────────────────────────────
        const currentUser = userId ? userMap.get(String(userId)) : null;
        const userName = currentUser?.name ?? 'Customer';

        // ── summary cards ──────────────────────────────────────────────────
        const userTracking = userId
          ? tracking.filter(t => String(t.userId) === String(userId))
          : tracking;

        const summary = this.buildSummary(userBookings, userTracking);

        // ── recent bookings table (last 5, newest first) ───────────────────
        const sorted = [...userBookings].sort(
          (a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        );

        const recentBookings: RecentBookingRow[] = sorted.slice(0, 5).map(b => {
          const veh = vehicleMap.get(String(b.vehicleId));
          const pkg = packageMap.get(String(b.serviceId));
          return {
            bookingId: String(b.id),
            vehicle:   veh  ? `${veh.brand} ${veh.model}` : `Vehicle #${b.vehicleId}`,
            service:   pkg  ? pkg.name : `Service #${b.serviceId}`,
            status:    b.status,
          };
        });

        // ── active service progress card ───────────────────────────────────
        // Pick the most recent "In Progress" tracking record for this user.
        const inProgressTracking = userTracking.find(
          t => t.currentStage !== 'Ready For Delivery'
        ) ?? userTracking[0] ?? null;

        let activeProgress: ActiveServiceProgress | null = null;

        if (inProgressTracking) {
          const booking = userBookings.find(
            b => String(b.id) === String(inProgressTracking.bookingId)
          );
          const veh = vehicleMap.get(String(inProgressTracking.vehicleId));
          const pkg = booking ? packageMap.get(String(booking.serviceId)) : null;

          activeProgress = {
            bookingId:          String(inProgressTracking.bookingId),
            vehicleName:        veh ? `${veh.brand} ${veh.model}` : 'Unknown Vehicle',
            registrationNumber: veh ? veh.vehicleNumber : '—',
            serviceName:        pkg ? pkg.name : 'Unknown Service',
            currentStage:       inProgressTracking.currentStage,
            estimatedDelivery:  this.formatDate(inProgressTracking.estimatedDelivery),
            daysRemaining:      inProgressTracking.daysRemaining,
            timelineStages:     this.buildDashboardTimeline(inProgressTracking.currentStage),
          };
        }

        // ── upcoming appointment ───────────────────────────────────────────
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = userBookings
          .filter(b => {
            const bd = new Date(b.bookingDate);
            return bd >= today && b.status === 'Requested';
          })
          .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())[0]
          ?? null;

        let upcomingAppointment: UpcomingAppointment | null = null;

        if (upcoming) {
          const veh = vehicleMap.get(String(upcoming.vehicleId));
          const pkg = packageMap.get(String(upcoming.serviceId));
          // Workshop name from any matching tracking record, or default
          const trackRec = tracking.find(t => String(t.bookingId) === String(upcoming.id));

          upcomingAppointment = {
            vehicleName:        veh ? `${veh.brand} ${veh.model}` : 'Unknown Vehicle',
            serviceName:        pkg ? pkg.name : 'Unknown Service',
            registrationNumber: veh ? veh.vehicleNumber : '—',
            bookingDate:        this.formatDate(upcoming.bookingDate),
            slot:               upcoming.slot,
            workshopName:       trackRec?.workshopName ?? 'Sprint Auto Care',
            status:             upcoming.status,
          };
        }

        return { userName, summary, recentBookings, activeProgress, upcomingAppointment };
      })
    );
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private buildSummary(
    bookings: Booking[],
    tracking: ServiceTracking[]
  ): DashboardSummary {
    return {
      totalBookings:     bookings.length,
      completedServices: tracking.filter(t => t.currentStage === 'Ready For Delivery').length,
      inProgress:        bookings.filter(b => b.status === 'In Progress').length,
      readyForDelivery:  bookings.filter(b => b.status === 'Ready For Delivery').length,
    };
  }

  /**
   * Builds the five dashboard timeline stages with derived status,
   * based only on the currentStage string (no serviceTimelines call needed
   * for the lightweight dashboard view).
   */
  private buildDashboardTimeline(currentStage: string): DashboardTimelineStage[] {
    const currentIndex = STAGE_ORDER.indexOf(currentStage as typeof STAGE_ORDER[number]);

    return STAGE_ORDER.map((stage, index) => {
      let status: DashboardTimelineStage['status'];
      if (index < currentIndex)       status = 'completed';
      else if (index === currentIndex) status = 'active';
      else                             status = 'pending';

      return { label: stage, status, timestamp: '' };
    });
  }

  /** Formats an ISO date string to a human-readable form like "15 June 2026". */
  private formatDate(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
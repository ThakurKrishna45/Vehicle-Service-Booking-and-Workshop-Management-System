import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { User }            from '../models/user';
import { Booking }         from '../models/booking';
import { Vehicle }         from '../models/vehicle';
import { ServicePackage }  from '../models/service-package';
import { ServiceTracking } from '../models/service-tracking';

// ─── Exported interfaces (used by dashboard.ts) ───────────────────────────────

export interface DashboardSummary {
  totalBookings:     number;
  completedServices: number;
  inProgress:        number;
  readyForDelivery:  number;
}

export interface RecentBookingRow {
  bookingId: string;
  vehicle:   string;
  service:   string;
  status:    string;
}

export interface DashboardTimelineStage {
  label:     string;
  status:    'completed' | 'active' | 'pending';
  timestamp: string;
}

export interface ActiveServiceProgress {
  bookingId:          string;
  vehicleName:        string;
  registrationNumber: string;
  serviceName:        string;
  currentStage:       string;
  estimatedDelivery:  string;
  daysRemaining:      number;
  timelineStages:     DashboardTimelineStage[];
}

export interface UpcomingAppointment {
  vehicleName:        string;
  serviceName:        string;
  registrationNumber: string;
  bookingDate:        string;
  slot:               string;
  workshopName:       string;
  status:             string;
}

export interface DashboardPageData {
  userName:            string;
  summary:             DashboardSummary;
  recentBookings:      RecentBookingRow[];
  activeProgress:      ActiveServiceProgress | null;
  upcomingAppointment: UpcomingAppointment | null;
}

// ─── Stage order ──────────────────────────────────────────────────────────────

const STAGE_ORDER = [
  'Received',
  'Inspection',
  'Repair',
  'Quality Check',
  'Ready For Delivery',
] as const;

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly base = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ── Raw endpoints ──────────────────────────────────────────────────────────

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/users`);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/bookings`);
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

  // ── Composed page-data ────────────────────────────────────────────────────

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
        // Always compare as strings — db.json stores all IDs as strings.
        const vehicleMap = new Map(vehicles.map(v => [String(v.id), v]));
        const packageMap = new Map(servicePackages.map(p => [String(p.id), p]));
        const userMap    = new Map(users.map(u => [String(u.id), u]));

        // ── filter to current user's bookings ──────────────────────────────
        const userBookings = userId
          ? bookings.filter(b => String(b.userId) === String(userId))
          : bookings;

        const userTracking = userId
          ? tracking.filter(t => String(t.userId) === String(userId))
          : tracking;

        // ── display name ───────────────────────────────────────────────────
        const currentUser = userId ? userMap.get(String(userId)) : null;
        const userName    = currentUser?.name ?? 'Customer';

        // ── summary ────────────────────────────────────────────────────────
        // Count booking statuses directly from bookings (not tracking) so
        // the numbers are always correct even when serviceTracking is empty.
        const summary: DashboardSummary = {
          totalBookings:     userBookings.length,
          completedServices: userBookings.filter(b =>
            b.status === 'Completed' || b.status === 'Ready For Delivery'
          ).length,
          inProgress: userBookings.filter(b =>
            b.status === 'Inspection' ||
            b.status === 'Repair'     ||
            b.status === 'In Progress'
          ).length,
          readyForDelivery: userBookings.filter(b =>
            b.status === 'Ready For Delivery'
          ).length,
        };

        // ── recent bookings table (last 5, newest first) ───────────────────
        const sorted = [...userBookings].sort(
          (a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        );

        const recentBookings: RecentBookingRow[] = sorted.slice(0, 5).map(b => {
          const veh = vehicleMap.get(String(b.vehicleId));
          const pkg = packageMap.get(String(b.serviceId));
          return {
            bookingId: String(b.id),
            vehicle:   veh ? `${veh.brand} ${veh.model}` : `Vehicle #${b.vehicleId}`,
            service:   pkg ? pkg.name : `Service #${b.serviceId}`,
            status:    b.status,
          };
        });

        // ── active service progress ────────────────────────────────────────
        // Find a serviceTracking record for this user that isn't complete.
        const inProgressRecord = userTracking.find(
          t => t.currentStage !== 'Ready For Delivery'
        ) ?? null;

        let activeProgress: ActiveServiceProgress | null = null;

        if (inProgressRecord) {
          const booking = userBookings.find(
            b => String(b.id) === String(inProgressRecord.bookingId)
          );
          const veh = vehicleMap.get(String(inProgressRecord.vehicleId));
          const pkg = booking ? packageMap.get(String(booking.serviceId)) : null;

          activeProgress = {
            bookingId:          String(inProgressRecord.bookingId),
            vehicleName:        veh ? `${veh.brand} ${veh.model}` : 'Unknown Vehicle',
            registrationNumber: veh ? veh.vehicleNumber : '—',
            serviceName:        pkg ? pkg.name : 'Unknown Service',
            currentStage:       inProgressRecord.currentStage,
            estimatedDelivery:  this.formatDate(inProgressRecord.estimatedDelivery),
            daysRemaining:      inProgressRecord.daysRemaining,
            timelineStages:     this.buildTimeline(inProgressRecord.currentStage),
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
          .sort(
            (a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
          )[0] ?? null;

        let upcomingAppointment: UpcomingAppointment | null = null;

        if (upcoming) {
          const veh      = vehicleMap.get(String(upcoming.vehicleId));
          const pkg      = packageMap.get(String(upcoming.serviceId));
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

  private buildTimeline(currentStage: string): DashboardTimelineStage[] {
    const currentIndex = STAGE_ORDER.indexOf(currentStage as typeof STAGE_ORDER[number]);

    return STAGE_ORDER.map((stage, index) => {
      let status: DashboardTimelineStage['status'];
      if      (index < currentIndex)  status = 'completed';
      else if (index === currentIndex) status = 'active';
      else                             status = 'pending';

      return { label: stage, status, timestamp: '' };
    });
  }

  private formatDate(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, of } from 'rxjs';

import { ServiceTracking } from '../models/service-tracking';
import { ServiceHistory }  from '../models/service-history';
import { Technician }      from '../models/technician';
import { Booking }         from '../models/booking';
import { Vehicle }         from '../models/vehicle';
import { ServicePackage }  from '../models/service-package';

// ─── Local interfaces ────────────────────────────────────────────────────────

/** Matches the serviceTimelines collection in db.json exactly. */
export interface ServiceTimeline {
  id:        string;
  bookingId: string;
  stage:     string;
  updatedAt: string | null;
}

/**
 * The five ordered stages every booking passes through.
 * Used to derive status (completed / active / pending) for UI rendering.
 */
export const TIMELINE_STAGES = [
  'Received',
  'Inspection',
  'Repair',
  'Quality Check',
  'Ready For Delivery',
] as const;

export type TimelineStage = typeof TIMELINE_STAGES[number];

/** A single stage enriched with a derived status — ready for the template. */
export interface EnrichedStage {
  stage:     TimelineStage;
  updatedAt: string | null;
  status:    'completed' | 'active' | 'pending';
}

/** Full tracking record joined with its timeline stages and technician info. */
export interface TrackingDetail {
  tracking:   ServiceTracking;
  technician: Technician | null;
  stages:     EnrichedStage[];
}

/** One row in the Recent Service Updates table. */
export interface ServiceUpdateRow {
  date:   string;
  time:   string;
  update: string;
  type:   'received' | 'completed' | 'progress' | 'pending';
}

/** Full composed payload returned by getTrackingPageData(). */
export interface TrackingPageData {
  bookingId:          string;
  vehicleName:        string;
  registrationNumber: string;
  serviceName:        string;
  currentStage:       string;
  estimatedDelivery:  string;
  daysRemaining:      number;
  stages:             EnrichedStage[];        // for <app-service-timeline>
  serviceUpdates:     ServiceUpdateRow[];     // for the updates table
}

// ─── Stage-label → update message map ────────────────────────────────────────

const STAGE_UPDATE_LABELS: Record<string, string> = {
  'Received':           'Vehicle received at workshop',
  'Inspection':         'Inspection completed',
  'Repair':             'Repair work started by technician',
  'Quality Check':      'Quality check in progress',
  'Ready For Delivery': 'Vehicle is ready for delivery',
};

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ServiceTrackingService {

  private readonly base = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ── Raw endpoints ──────────────────────────────────────────────────────────

  getAllTracking(): Observable<ServiceTracking[]> {
    return this.http.get<ServiceTracking[]>(`${this.base}/serviceTracking`);
  }

  getTrackingByBookingId(bookingId: string): Observable<ServiceTracking | null> {
    return this.http
      .get<ServiceTracking[]>(`${this.base}/serviceTracking?bookingId=${bookingId}`)
      .pipe(map(results => results[0] ?? null));
  }

  getTrackingByUserId(userId: string): Observable<ServiceTracking[]> {
    return this.http.get<ServiceTracking[]>(
      `${this.base}/serviceTracking?userId=${userId}`
    );
  }

  getTimelines(): Observable<ServiceTimeline[]> {
    return this.http.get<ServiceTimeline[]>(`${this.base}/serviceTimelines`);
  }

  getTimelineByBookingId(bookingId: string): Observable<ServiceTimeline[]> {
    return this.http
      .get<ServiceTimeline[]>(`${this.base}/serviceTimelines?bookingId=${bookingId}`)
      .pipe(
        map(stages =>
          [...stages].sort(
            (a, b) =>
              TIMELINE_STAGES.indexOf(a.stage as TimelineStage) -
              TIMELINE_STAGES.indexOf(b.stage as TimelineStage)
          )
        )
      );
  }

  getServiceHistories(): Observable<ServiceHistory[]> {
    return this.http.get<ServiceHistory[]>(`${this.base}/serviceHistories`);
  }

  getServiceHistoryByVehicleId(vehicleId: string): Observable<ServiceHistory[]> {
    return this.http
      .get<ServiceHistory[]>(`${this.base}/serviceHistories?vehicleId=${vehicleId}`)
      .pipe(
        map(records =>
          [...records].sort(
            (a, b) =>
              new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
          )
        )
      );
  }

  getTechnicians(): Observable<Technician[]> {
    return this.http.get<Technician[]>(`${this.base}/technicians`);
  }

  getTechnicianById(id: string): Observable<Technician> {
    return this.http.get<Technician>(`${this.base}/technicians/${id}`);
  }

  // ── Composed page-data method ─────────────────────────────────────────────

  /**
   * Returns everything the Service Tracking page needs in a single composed call.
   *
   * Strategy:
   *  1. forkJoin all required collections in parallel.
   *  2. Resolve vehicleName, serviceName, and timeline stages in-memory.
   *  3. Build the serviceUpdates list from the timeline records (only
   *     stages that have a non-null updatedAt get a row, sorted newest first).
   *
   * @param bookingId  The booking to show tracking for.
   *                   If null, falls back to the first active tracking record.
   * @param userId     Optional — used to filter to the logged-in user's data.
   */
  getTrackingPageData(
    bookingId: string | null,
    userId: string | null = null
  ): Observable<TrackingPageData | null> {

    return forkJoin({
      allTracking:     this.getAllTracking(),
      allTimelines:    this.getTimelines(),
      vehicles:        this.http.get<Vehicle[]>(`${this.base}/vehicles`),
      servicePackages: this.http.get<ServicePackage[]>(`${this.base}/servicePackages`),
      bookings:        this.http.get<Booking[]>(`${this.base}/bookings`),
    }).pipe(
      map(({ allTracking, allTimelines, vehicles, servicePackages, bookings }) => {

        // ── lookup maps ────────────────────────────────────────────────────
        const vehicleMap  = new Map(vehicles.map(v  => [String(v.id),  v]));
        const packageMap  = new Map(servicePackages.map(p => [String(p.id), p]));
        const bookingMap  = new Map(bookings.map(b => [String(b.id), b]));

        // ── pick the tracking record ───────────────────────────────────────
        let tracking: ServiceTracking | null = null;

        if (bookingId) {
          tracking = allTracking.find(
            t => String(t.bookingId) === String(bookingId)
          ) ?? null;
        } else if (userId) {
          // First active (non-delivered) tracking record for the user
          tracking = allTracking.find(
            t => String(t.userId) === String(userId)
               && t.currentStage !== 'Ready For Delivery'
          ) ?? allTracking.find(t => String(t.userId) === String(userId)) ?? null;
        } else {
          // Fallback: first record in the collection
          tracking = allTracking[0] ?? null;
        }

        if (!tracking) return null;

        // ── resolve names ──────────────────────────────────────────────────
        const vehicle = vehicleMap.get(String(tracking.vehicleId));
        const booking = bookingMap.get(String(tracking.bookingId));
        const pkg     = booking ? packageMap.get(String(booking.serviceId)) : null;

        const vehicleName        = vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Unknown Vehicle';
        const registrationNumber = vehicle ? vehicle.vehicleNumber : '—';
        const serviceName        = pkg     ? pkg.name : 'Unknown Service';

        // ── filter & sort timeline for this booking ────────────────────────
        const bookingTimelines = allTimelines
          .filter(t => String(t.bookingId) === String(tracking!.bookingId))
          .sort(
            (a, b) =>
              TIMELINE_STAGES.indexOf(a.stage as TimelineStage) -
              TIMELINE_STAGES.indexOf(b.stage as TimelineStage)
          );

        // ── enrich stages ──────────────────────────────────────────────────
        const stages = this.enrichStages(bookingTimelines, tracking.currentStage);

        // ── build update rows from completed timeline entries ──────────────
        const serviceUpdates: ServiceUpdateRow[] = bookingTimelines
          .filter(t => t.updatedAt !== null)
          .sort(
            (a, b) =>
              new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
          )
          .map(t => {
            const dt   = new Date(t.updatedAt!);
            const date = dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            const time = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
            return {
              date,
              time,
              update: STAGE_UPDATE_LABELS[t.stage] ?? t.stage,
              type:   this.stageToUpdateType(t.stage),
            };
          });

        return {
          bookingId:          String(tracking.bookingId),
          vehicleName,
          registrationNumber,
          serviceName,
          currentStage:       tracking.currentStage,
          estimatedDelivery:  this.formatDate(tracking.estimatedDelivery),
          daysRemaining:      tracking.daysRemaining,
          stages,
          serviceUpdates,
        };
      })
    );
  }

  // ── Legacy composed methods (kept for backward-compat) ────────────────────

  getTrackingDetail(bookingId: string): Observable<TrackingDetail> {
    return forkJoin({
      trackingList: this.getTrackingByBookingId(bookingId),
      timelines:    this.getTimelineByBookingId(bookingId),
    }).pipe(
      map(({ trackingList, timelines }) => ({
        tracking:   trackingList!,
        technician: null as Technician | null,
        stages:     trackingList
          ? this.enrichStages(timelines, trackingList.currentStage)
          : [],
      }))
    );
  }

  getTrackingDetailWithTechnician(bookingId: string): Observable<TrackingDetail> {
    return this.getTrackingByBookingId(bookingId).pipe(
      switchMap(tracking => {
        if (!tracking) {
          return of({ tracking: null as unknown as ServiceTracking, technician: null, stages: [] });
        }
        return forkJoin({
          timelines:  this.getTimelineByBookingId(bookingId),
          technician: this.getTechnicianById(tracking.technicianId),
        }).pipe(
          map(({ timelines, technician }) => ({
            tracking,
            technician,
            stages: this.enrichStages(timelines, tracking.currentStage),
          }))
        );
      })
    );
  }

  // ── Public helpers ─────────────────────────────────────────────────────────

  /**
   * Takes a flat list of ServiceTimeline entries and the currentStage string,
   * returns an array of EnrichedStage objects in canonical order.
   *
   * Rules:
   *  - stage === currentStage                    → 'active'
   *  - entry with non-null updatedAt             → 'completed'
   *  - everything else                           → 'pending'
   */
  enrichStages(
    timelines: ServiceTimeline[],
    currentStage: string
  ): EnrichedStage[] {
    const timelineMap = new Map(timelines.map(t => [t.stage, t]));

    return TIMELINE_STAGES.map(stage => {
      const entry = timelineMap.get(stage);

      let status: EnrichedStage['status'];

      if (stage === currentStage) {
        status = 'active';
      } else if (entry?.updatedAt != null) {
        status = 'completed';
      } else {
        status = 'pending';
      }

      return {
        stage,
        updatedAt: entry?.updatedAt ?? null,
        status,
      };
    });
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private stageToUpdateType(
    stage: string
  ): ServiceUpdateRow['type'] {
    switch (stage) {
      case 'Received':           return 'received';
      case 'Ready For Delivery': return 'completed';
      case 'Quality Check':
      case 'Repair':
      case 'Inspection':         return 'progress';
      default:                   return 'pending';
    }
  }

  private formatDate(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
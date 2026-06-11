import { Component, OnInit }      from '@angular/core';
import { CommonModule }             from '@angular/common';
import { ActivatedRoute, Router }   from '@angular/router';

import { ServiceTimeline, ServiceStage } from '../../shared/components/service-timeline/service-timeline';
import { Navbar }                        from '../../shared/components/navbar/navbar';
import {
  ServiceTrackingService,
  TrackingPageData,
  ServiceUpdateRow,
  EnrichedStage,
} from '../../core/services/service-tracking.service';

@Component({
  selector:    'app-service-tracking',
  standalone:  true,
  imports:     [CommonModule, ServiceTimeline, Navbar],
  templateUrl: './service-tracking.html',
  styleUrl:    './service-tracking.css',
})
export class ServiceTracking implements OnInit {

  // ── Vehicle Details Card ───────────────────────────────────────────────────
  bookingId          = '';
  vehicle            = '';
  registrationNumber = '';
  service            = '';
  estimatedDelivery  = '';
  daysRemaining      = 0;
  currentStage       = '';

  // ── Timeline (passed to <app-service-timeline>) ────────────────────────────
  stages: ServiceStage[] = [];

  // ── Recent Service Updates table ───────────────────────────────────────────
  serviceUpdates: ServiceUpdateRow[] = [];

  // ── Loading state ──────────────────────────────────────────────────────────
  isLoading = true;

  constructor(
    private router:                 Router,
    private route:                  ActivatedRoute,
    private serviceTrackingService: ServiceTrackingService,
  ) {}

  ngOnInit(): void {
    // Allow a specific booking to be passed as a query-param:
    //   /service-tracking?bookingId=101
    // If absent, falls back to the logged-in user's first active tracking record.
    const bookingId = this.route.snapshot.queryParamMap.get('bookingId');
    const userId    = localStorage.getItem('userId');

    this.serviceTrackingService
      .getTrackingPageData(bookingId, userId)
      .subscribe({
        next: (data: TrackingPageData | null) => {
          if (data) {
            this.bookingId          = data.bookingId;
            this.vehicle            = data.vehicleName;
            this.registrationNumber = data.registrationNumber;
            this.service            = data.serviceName;
            this.currentStage       = data.currentStage;
            this.estimatedDelivery  = data.estimatedDelivery;
            this.daysRemaining      = data.daysRemaining;
            this.serviceUpdates     = data.serviceUpdates;

            // Map EnrichedStage → ServiceStage expected by <app-service-timeline>
            this.stages = this.mapToServiceStages(data.stages);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Service tracking data load failed:', err);
          this.isLoading = false;
        },
      });
  }

  // ── Template helpers ───────────────────────────────────────────────────────

  /** Maps EnrichedStage[] to the ServiceStage[] format the timeline component expects. */
  private mapToServiceStages(enriched: EnrichedStage[]): ServiceStage[] {
    return enriched.map(e => ({
      label:     e.stage,
      status:    e.status,
      timestamp: e.updatedAt ? this.formatTimestamp(e.updatedAt) : '',
    }));
  }

  /**
   * Formats an ISO datetime string into "10 Jun, 09:30 AM" style
   * to match the original hardcoded format in the template.
   */
  private formatTimestamp(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const time = d.toLocaleTimeString('en-IN', {
      hour:   '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase();
    return `${date}, ${time}`;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
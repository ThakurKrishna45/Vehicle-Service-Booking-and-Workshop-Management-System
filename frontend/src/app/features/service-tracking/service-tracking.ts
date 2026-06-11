import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceTimeline, ServiceStage } from '../../shared/components/service-timeline/service-timeline';
import { Navbar } from "../../shared/components/navbar/navbar";

export interface ServiceUpdate {
  date: string;
  time: string;
  update: string;
  type: 'received' | 'completed' | 'progress' | 'pending';
}

@Component({
  selector: 'app-service-tracking',
  standalone: true,
  imports: [CommonModule, ServiceTimeline, Navbar],
  templateUrl: './service-tracking.html',
  styleUrl: './service-tracking.css'
})
export class ServiceTracking {

  constructor(private router: Router) {}

  bookingId = 'BK-101';
  vehicle = 'Honda City';
  registrationNumber = 'KA01AB1234';
  service = 'Premium Service';
  estimatedDelivery = '15 June 2026';
  daysRemaining = 2;
  currentStage = 'Repair';

  // Passed directly into <app-service-timeline [stages]="stages">
  stages: ServiceStage[] = [
    { label: 'Received',           status: 'completed', timestamp: '10 Jun, 09:30 AM' },
    { label: 'Inspection',         status: 'completed', timestamp: '10 Jun, 11:00 AM' },
    { label: 'Repair',             status: 'active',    timestamp: '11 Jun, 02:00 PM' },
    { label: 'Quality Check',      status: 'pending',   timestamp: '' },
    { label: 'Ready For Delivery', status: 'pending',   timestamp: '' },
  ];

  serviceUpdates: ServiceUpdate[] = [
    { date: '11 Jun', time: '02:00 PM', update: 'Repair work started by technician',                  type: 'progress'  },
    { date: '10 Jun', time: '11:00 AM', update: 'Inspection complete — minor brake pad wear noted',   type: 'completed' },
    { date: '10 Jun', time: '09:30 AM', update: 'Vehicle received at workshop',                       type: 'received'  },
  ];

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

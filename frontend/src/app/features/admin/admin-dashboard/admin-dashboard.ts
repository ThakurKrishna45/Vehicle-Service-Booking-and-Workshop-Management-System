import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { StatusFormatPipe } from '../../../shared/pipes/status-format-pipe';

import * as DashboardActions from '../../../store/admin-dashboard-filter/dashboard.actions';
import { selectDashboardStats } from '../../../store/admin-dashboard-filter/dashboard.selectors';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatusFormatPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  adminName = 'Admin';

  // NgRx Store Data
  stats$!: Observable<any[]>;

  constructor(
    private store: Store
  ) {}

  ngOnInit(): void {

    this.store.dispatch(
      DashboardActions.loadDashboardStats()
    );

    this.stats$ = this.store.select(
      selectDashboardStats
    );
  }

  technicians = [
    {
      name: 'Rahul Sharma',
      specialization: 'Engine',
      status: 'Available'
    },
    {
      name: 'Priya Singh',
      specialization: 'Electrical',
      status: 'Busy'
    },
    {
      name: 'Amit Kumar',
      specialization: 'Body Work',
      status: 'Available'
    }
  ];

  recentBookings = [
    {
      id: 101,
      customer: 'Parth Saxena',
      vehicle: 'Honda City',
      service: 'Premium Service',
      status: 'IN_PROGRESS'
    },
    {
      id: 102,
      customer: 'Rohit Sharma',
      vehicle: 'Hyundai Creta',
      service: 'Basic Service',
      status: 'COMPLETED'
    },
    {
      id: 103,
      customer: 'Virat Kohli',
      vehicle: 'Kia Seltos',
      service: 'Engine Repair',
      status: 'CONFIRMED'
    }
  ];

  complaints = [
    {
      id: 1,
      subject: 'Delayed Delivery',
      status: 'OPEN'
    },
    {
      id: 2,
      subject: 'Brake Issue',
      status: 'IN_REVIEW'
    }
  ];

}
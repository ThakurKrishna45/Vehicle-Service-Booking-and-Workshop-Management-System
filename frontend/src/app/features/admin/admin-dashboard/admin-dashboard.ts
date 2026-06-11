import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { StatusFormatPipe } from '../../../shared/pipes/status-format-pipe';

import * as DashboardActions from '../../../store/admin-dashboard-filter/dashboard.actions';
import { selectDashboardStats } from '../../../store/admin-dashboard-filter/dashboard.selectors';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatusFormatPipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  adminName = 'Admin';

  stats$!: Observable<any[]>;

  constructor(
    private store: Store,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.store.dispatch(
      DashboardActions.loadDashboardStats()
    );

    this.stats$ = this.store.select(
      selectDashboardStats
    );

  }

  logout(): void {

    this.auth.logout();
    this.router.navigate(['/login']);

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
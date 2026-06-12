import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { InvoiceList }      from './features/invoice/invoice-list/invoice-list';
import { InvoiceDetails }   from './features/invoice/invoice-details/invoice-details';
import { ComplaintForm }    from './features/complaint/complaint-form/complaint-form';
import { ComplaintList }    from './features/complaint/complaint-list/complaint-list';
import { ManageInvoices }   from './features/admin/manage-invoices/manage-invoices';
import { ManageComplaints } from './features/admin/manage-complaints/manage-complaints';
import { ManageStatus }     from './features/admin/manage-status/manage-status';
import { AdminDashboard }   from './features/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [

  // ── Auth ──────────────────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },

  // ── Profile (Member 2) ────────────────────────────────────────────────────
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/customer/profile/profile').then(m => m.Profile)
  },

  // ── Vehicles (Member 2) ───────────────────────────────────────────────────
  // IMPORTANT: specific child paths must come BEFORE the list route.
  // Angular matches top-to-bottom; if 'vehicles' is first, 'vehicles/add'
  // is never reached.
  {
    path: 'vehicles/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/vehicle/add-vehicle/add-vehicle').then(m => m.AddVehicle)
  },
  {
    path: 'vehicles/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/vehicle/edit-vehicle/edit-vehicle').then(m => m.EditVehicle)
  },
  {
    path: 'vehicles',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/vehicle/vehicle-list/vehicle-list').then(m => m.VehicleList)
  },

  // ── Service Catalog (Member 3) ────────────────────────────────────────────
  {
    path: 'services',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/service-catalog/service-list/service-list').then(
        m => m.ServiceListComponent
      )
  },
  {
    path: 'services/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/service-catalog/service-details/service-details').then(
        m => m.ServiceDetailsComponent
      )
  },

  // ── Booking (Member 3) ────────────────────────────────────────────────────
  {
    path: 'booking',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/booking/create-booking/create-booking').then(
        m => m.CreateBookingComponent
      )
  },
  {
    path: 'bookings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/booking/booking-history/booking-history').then(
        m => m.BookingHistoryComponent
      )
  },

  // ── Service Tracking (Member 4) ───────────────────────────────────────────
  {
    path: 'service-tracking',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/service-tracking/service-tracking').then(
        m => m.ServiceTracking
      )
  },

  // ── Invoices / Payments (Member 5) ────────────────────────────────────────
  {
    path: 'invoices',
    component: InvoiceList,
    canActivate: [authGuard]
  },
  {
    path: 'invoice-details/:id',
    component: InvoiceDetails,
    canActivate: [authGuard]
  },

  // ── Complaints (Member 5) ─────────────────────────────────────────────────
  {
    path: 'complaints/new',
    component: ComplaintForm,
    canActivate: [authGuard]
  },
  {
    path: 'my-complaints',
    component: ComplaintList,
    canActivate: [authGuard]
  },

  // ── Admin (Member 5) ──────────────────────────────────────────────────────
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard]
  },
  {
    path: 'admin/invoices',
    component: ManageInvoices,
    canActivate: [authGuard]
  },
  {
    path: 'admin/complaints',
    component: ManageComplaints,
    canActivate: [authGuard]
  },
  {
    path: 'admin/status',
    component: ManageStatus,
    canActivate: [authGuard]
  },

  // ── Stub redirects for routes owned by other members ─────────────────────
  { path: 'admin/users',    redirectTo: 'dashboard'        },
  { path: 'admin/services', redirectTo: 'services'         },
  { path: 'admin/bookings', redirectTo: 'bookings'         },
  { path: 'admin/tracking', redirectTo: 'service-tracking' },

  // ── Fallback ──────────────────────────────────────────────────────────────
  { path: '',   pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
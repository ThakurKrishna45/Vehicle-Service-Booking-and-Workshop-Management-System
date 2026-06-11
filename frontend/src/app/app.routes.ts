import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { InvoiceList } from './features/invoice/invoice-list/invoice-list';
import { InvoiceDetails } from './features/invoice/invoice-details/invoice-details';


import { ComplaintForm } from './features/complaint/complaint-form/complaint-form';
import { ComplaintList } from './features/complaint/complaint-list/complaint-list';


import { ManageInvoices } from './features/admin/manage-invoices/manage-invoices';
import { ManageComplaints } from './features/admin/manage-complaints/manage-complaints';
import { ManageStatus } from './features/admin/manage-status/manage-status';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'service-tracking',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/service-tracking/service-tracking').then(
        m => m.ServiceTracking
      )
  },

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
  {
    path: 'invoices',
    component: InvoiceList,
    canActivate: [authGuard]
  },

{
  path: 'invoice-details/:id',
  component: InvoiceDetails
},

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

  // Future Integration Routes
  // (Implemented by Other Members)

  {
    path: 'admin/users',
    redirectTo: 'dashboard'
  },

  {
    path: 'admin/services',
    redirectTo: 'services'
  },

  {
    path: 'admin/bookings',
    redirectTo: 'booking-history'
  },

  {
    path: 'admin/tracking',
    redirectTo: 'tracking'
  },


  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];


  // {
  //   path: '',
  //   redirectTo: 'admin',
  //   pathMatch: 'full'
  // },

  

  // Notifications
//   {
//     path: 'notifications',
//     component: NotificationListComponent,
//     canActivate: [authGuard]
//   },

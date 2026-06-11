import { Routes } from '@angular/router';

// import { authGuard } from './core/guards/auth.guard';

// Authentication
// import { LoginComponent } from './features/auth/login/login.component';
// import { RegisterComponent } from './features/auth/register/register.component';

// Dashboards
// import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';

// Profile & Vehicle
// import { ProfileComponent } from './features/customer/profile/profile.component';
// import { VehicleListComponent } from './features/vehicle/vehicle-list/vehicle-list.component';
// import { AddVehicleComponent } from './features/vehicle/add-vehicle/add-vehicle.component';

// Service Catalog
// import { ServiceListComponent } from './features/service-catalog/service-list/service-list.component';
// import { ServiceDetailsComponent } from './features/service-catalog/service-details/service-details.component';

// Booking
// import { CreateBookingComponent } from './features/booking/create-booking/create-booking.component';
// import { BookingHistoryComponent } from './features/booking/booking-history/booking-history.component';

// Service Tracking
// import { ServiceTrackingComponent } from './features/service-tracking/service-tracking/service-tracking.component';

// Invoice
import { InvoiceList } from './features/invoice/invoice-list/invoice-list';
import { InvoiceDetails } from './features/invoice/invoice-details/invoice-details';

// Complaint
import { ComplaintForm } from './features/complaint/complaint-form/complaint-form';
import { ComplaintList } from './features/complaint/complaint-list/complaint-list';

// Notifications
// import { NotificationListComponent } from './features/notification/notification-list/notification-list.component';

// Admin Modules
import { ManageInvoices } from './features/admin/manage-invoices/manage-invoices';
import { ManageComplaints } from './features/admin/manage-complaints/manage-complaints';
import { ManageStatus } from './features/admin/manage-status/manage-status';

export const routes: Routes = [

  // Default Route
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  },

  // Authentication
//   {
//     path: 'login',
//     component: LoginComponent
//   },

//   {
//     path: 'register',
//     component: RegisterComponent
//   },

  // Customer Dashboard
//   {
//     path: 'dashboard',
//     component: DashboardComponent,
//     canActivate: [authGuard]
//   },

  // Customer Profile
//   {
//     path: 'profile',
//     component: ProfileComponent,
//     canActivate: [authGuard]
//   },

  // Vehicle Management
//   {
//     path: 'vehicles',
//     component: VehicleListComponent,
//     canActivate: [authGuard]
//   },

//   {
//     path: 'add-vehicle',
//     component: AddVehicleComponent,
//     canActivate: [authGuard]
//   },

  // Service Catalog
//   {
//     path: 'services',
//     component: ServiceListComponent,
//     canActivate: [authGuard]
//   },

//   {
//     path: 'service-details/:id',
//     component: ServiceDetailsComponent,
//     canActivate: [authGuard]
//   },

  // Booking
//   {
//     path: 'create-booking',
//     component: CreateBookingComponent,
//     canActivate: [authGuard]
//   },

//   {
//     path: 'booking-history',
//     component: BookingHistoryComponent,
//     canActivate: [authGuard]
//   },

  // Service Tracking
//   {
//     path: 'tracking',
//     component: ServiceTrackingComponent,
//     canActivate: [authGuard]
//   },

  // Invoice
  {
    path: 'invoices',
    component: InvoiceList,
    // canActivate: [authGuard]
  },

  {
    path: 'invoice-details/:id',
    component: InvoiceDetails,
    // canActivate: [authGuard]
  },

  // Complaint
  {
    path: 'complaints/new',
    component: ComplaintForm,
    // canActivate: [authGuard]
  },

  {
    path: 'my-complaints',
    component: ComplaintList,
    // canActivate: [authGuard]
  },

  // Notifications
//   {
//     path: 'notifications',
//     component: NotificationListComponent,
//     canActivate: [authGuard]
//   },

  // =====================
  // ADMIN MODULE
  // =====================

  {
    path: 'admin',
    component: AdminDashboard,
    // canActivate: [authGuard]
  },

  {
    path: 'admin/invoices',
    component: ManageInvoices,
    // canActivate: [authGuard]
  },

  {
    path: 'admin/complaints',
    component: ManageComplaints,
    // canActivate: [authGuard]
  },

  {
    path: 'admin/status',
    component: ManageStatus,
    // canActivate: [authGuard]
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

  // Wildcard Route
  {
    path: '**',
    redirectTo: 'login'
  }

];
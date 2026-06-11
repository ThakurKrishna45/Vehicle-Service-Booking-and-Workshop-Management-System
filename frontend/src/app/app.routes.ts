import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
  path: 'profile',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/customer/profile/profile').then(
      m => m.Profile
    )
  },

  {
  path: 'vehicles',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/vehicle/vehicle-list/vehicle-list').then(
      m => m.VehicleList
    )
},
{
  path: 'vehicles/add',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/vehicle/add-vehicle/add-vehicle').then(
      m => m.AddVehicle
    )
},

{
  path: 'vehicles/edit/:id',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/vehicle/edit-vehicle/edit-vehicle').then(
      m => m.EditVehicle
    )
},
{
  path: 'profile',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/customer/profile/profile').then(
      m => m.Profile
    )
},

  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
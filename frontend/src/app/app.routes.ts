import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard)
  },
  {
    path: 'service-tracking',
    canActivate: [authGuard],
    loadComponent: () => import('./features/service-tracking/service-tracking').then((m) => m.ServiceTracking)
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];

export const routes: Routes = [

  {
    path: 'services',
    loadComponent: () =>
      import('./features/service-catalog/service-list/service-list')
      .then(m => m.ServiceListComponent)
  },

  {
    path: 'services/:id',
    loadComponent: () =>
      import('./features/service-catalog/service-details/service-details')
      .then(m => m.ServiceDetailsComponent)
  },

{
  path: 'booking',
  loadComponent: () =>
    import('./features/booking/create-booking/create-booking')
      .then(m => m.CreateBookingComponent)
},
  {
    path: 'bookings',
    loadComponent: () =>
      import('./features/booking/booking-history/booking-history')
      .then(m => m.BookingHistoryComponent)
  }

];
import { Routes } from '@angular/router';

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
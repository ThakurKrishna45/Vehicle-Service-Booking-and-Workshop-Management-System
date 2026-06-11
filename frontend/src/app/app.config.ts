import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
// import { provideEffects } from '@ngrx/effects';

import { dashboardReducer } from './store/admin-dashboard-filter/dashboard.reducer';
// import { DashboardEffects } from './store/admin-dashboard-filter/dashboard.effects';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      dashboard: dashboardReducer
    }),

    // provideEffects([
    //   DashboardEffects
    // ])
  ]
};
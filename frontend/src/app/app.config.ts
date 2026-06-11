import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  provideStore
} from '@ngrx/store';

import { routes } from './app.routes';

import {
  filterReducer
} from './store/service-filter/service-filter.reducer';

export const appConfig: ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes)

    provideRouter(routes),

    provideHttpClient(),

    provideStore({

      filters: filterReducer

    })

  ]

};
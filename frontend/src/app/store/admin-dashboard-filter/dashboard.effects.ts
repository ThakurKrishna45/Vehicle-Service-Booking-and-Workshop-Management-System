import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DashboardActions from './dashboard.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class DashboardEffects {

  loadStats$ = createEffect(() =>
    this.actions$.pipe(

      ofType(DashboardActions.loadDashboardStats),

      map(() =>
        DashboardActions.loadDashboardStatsSuccess({

          stats: [

            {
              title: 'Total Users',
              value: 154,
              icon: '👥'
            },

            {
              title: 'Vehicles',
              value: 231,
              icon: '🚗'
            },

            {
              title: 'Bookings',
              value: 89,
              icon: '📅'
            },

            {
              title: 'Revenue',
              value: '₹4.8L',
              icon: '💰'
            }

          ]

        })
      )

    )
  , { dispatch: true });

  constructor(
    private actions$: Actions
  ) {}

}
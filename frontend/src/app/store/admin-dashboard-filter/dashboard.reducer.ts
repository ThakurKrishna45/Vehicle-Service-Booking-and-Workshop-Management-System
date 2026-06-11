import { createReducer, on } from '@ngrx/store';
import * as DashboardActions from '../admin-dashboard-filter/dashboard.actions';

export interface DashboardState {
  stats: any[];
}

export const initialState: DashboardState = {
  stats: []
};

export const dashboardReducer = createReducer(

  initialState,

  on(
    DashboardActions.loadDashboardStatsSuccess,
    (state, { stats }) => ({
      ...state,
      stats
    })
  )

);
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from '../admin-dashboard-filter/dashboard.reducer';

export const selectDashboardState =
  createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardStats =
  createSelector(
    selectDashboardState,
    state => state.stats
  );
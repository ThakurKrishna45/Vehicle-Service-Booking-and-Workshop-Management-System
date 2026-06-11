import { createAction, props } from '@ngrx/store';

export const loadDashboardStats = createAction(
  '[Dashboard] Load Stats'
);

export const loadDashboardStatsSuccess = createAction(
  '[Dashboard] Load Stats Success',
  props<{ stats: any[] }>()
);
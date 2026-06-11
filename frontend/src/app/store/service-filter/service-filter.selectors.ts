import {
 createFeatureSelector,
 createSelector
}
from '@ngrx/store';

export const selectFilterState =
createFeatureSelector<any>(
 'filters'
);

export const selectSearchText =
createSelector(

 selectFilterState,

 state => state.searchText

);

export const selectCategory =
createSelector(

 selectFilterState,

 state => state.category

);
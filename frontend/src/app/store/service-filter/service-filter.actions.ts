import {
 createAction,
 props
}
from '@ngrx/store';

export const setSearchText =
createAction(

 '[Filter] Search',

 props<{
   searchText:string
 }>()

);

export const setCategory =
createAction(

 '[Filter] Category',

 props<{
   category:string
 }>()

);
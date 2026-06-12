import {
 createReducer,
 on
}
from '@ngrx/store';

import * as FilterActions
from './service-filter.actions';

import {
 initialState
}
from './service-filter.state';

export const filterReducer =
createReducer(

 initialState,

 on(
  FilterActions.setSearchText,

  (state,action)=>({

   ...state,

   searchText:
   action.searchText

  })
 ),

 on(
  FilterActions.setCategory,

  (state,action)=>({

   ...state,

   category:
   action.category

  })
 )

);
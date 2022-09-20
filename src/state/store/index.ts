import { configureStore,createSlice } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import {reducer, INITIAL_STATE} from '../reducers/sentencesReducer';


export const store = configureStore({
    reducer,
    preloadedState: INITIAL_STATE
    
  });

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { configureStore } from '@reduxjs/toolkit'
import {apiReducer} from './ApiSlice';

export const store = configureStore({
  reducer: {tokenApi: apiReducer}
})

import { createSlice } from '@reduxjs/toolkit'

export const apiSlice = createSlice({
  name: 'tokenApi',
  initialState: {
    token: null,
    tasks: []
  },
  reducers: {
    storeToken: (state, action) => {
      state.token = action.payload;
    },
    storeTasks: (state, action) => {
      state.tasks = action.payload;
    }
  }
})

export const { storeToken, storeTasks } = apiSlice.actions

export const apiReducer = apiSlice.reducer;

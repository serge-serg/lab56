import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './filterSlice'

const store = configureStore({
  reducer: {
    filter: filterReducer
  },
  // devTools: import.meta.env.MODE !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
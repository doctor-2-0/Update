// store.ts
import { configureStore } from "@reduxjs/toolkit";
import findDoctorReducer from "../../../features/HomeSlices/findDoctorSlice";

export const store = configureStore({
  reducer: {
    findDoctor: findDoctorReducer,
  },
});

// Types for store and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

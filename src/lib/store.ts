import { configureStore } from "@reduxjs/toolkit";
import formReducer from "../features/formSlice";
import userLocationReducer from "../features/userLocationSlice";
import userReducer from "../features/userSlice";
import doctorReducer from "../features/doctorSlice";
import contactFormReducer from "../features/contactFormSlice";
import authReducer from "../features/authSlice";
import sessionReducer from "../features/sessionSlice";
import appointmentsReducer from "../features/appointmentSlice";
import findDoctorReducer from "../features/HomeSlices/findDoctorSlice";
import servicesReducer from "../features/HomeSlices/servicesSlice";
import testimonialsReducer from "../features/HomeSlices/testimonialsSlice";
import selectedDoctorReducer from "../features/HomeSlices/selectedDoctorSlice";
import selectedServiceReducer from "../features/HomeSlices/selectedServiceSlice";
import doctorsSlice from "../features/HomeSlices/doctorsSlice";
import mapReducer from "../features/HomeSlices/mapSlice";
import userProfileReducer from "../features/userProfileSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    form: formReducer,
    users: userReducer,
    doctor: doctorReducer,
    contactForm: contactFormReducer,
    userLocation: userLocationReducer,
    Auth: authReducer,
    session: sessionReducer,
    appointments: appointmentsReducer,
    findDoctor: findDoctorReducer,
    services: servicesReducer,
    testimonials: testimonialsReducer,
    selectedDoctor: selectedDoctorReducer,
    selectedService: selectedServiceReducer,
    doctors: doctorsSlice,
    map: mapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserLocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  selectedDoctorLocation: {
    latitude: number | null;
    longitude: number | null;
  };
  searchedLocation: {
    latitude: number | null;
    longitude: number | null;
  };
}

const initialState: UserLocationState = {
  latitude: null,
  longitude: null,
  error: null,
  loading: false,
  selectedDoctorLocation: {
    latitude: null,
    longitude: null,
  },
  searchedLocation: {
    latitude: null,
    longitude: null,
  },
};

const userLocationSlice = createSlice({
  name: 'userLocation',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSelectedDoctorLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.selectedDoctorLocation = action.payload;
    },
    clearSelectedDoctorLocation: (state) => {
      state.selectedDoctorLocation = {
        latitude: null,
        longitude: null,
      };
    },
    setSearchedLocation: (state, action: PayloadAction<{ latitude: number; longitude: number } | null>) => {
      state.searchedLocation = action.payload || { latitude: null, longitude: null };
    },
    clearSearchedLocation: (state) => {
      state.searchedLocation = {
        latitude: null,
        longitude: null,
      };
    },
  },
});

export const {
  setLocation,
  setError,
  setLoading,
  setSelectedDoctorLocation,
  clearSelectedDoctorLocation,
  setSearchedLocation,
  clearSearchedLocation,
} = userLocationSlice.actions;

export default userLocationSlice.reducer;
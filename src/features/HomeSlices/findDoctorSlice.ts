import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FindDoctorState {
  name: string;
  speciality: string;
  available: boolean;
  nearMe: boolean;
  perimeter: number;
}

const initialState: FindDoctorState = {
  name: '',
  speciality: '',
  available: false,
  nearMe: false,
  perimeter: 15,
};

const findDoctorSlice = createSlice({
  name: 'findDoctor',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setSpeciality: (state, action: PayloadAction<string>) => {
      state.speciality = action.payload;
    },
    setAvailable: (state, action: PayloadAction<boolean>) => {
      state.available = action.payload;
    },
    setNearMe: (state, action: PayloadAction<boolean>) => {
      state.nearMe = action.payload;
    },
    setPerimeter: (state, action: PayloadAction<number>) => {
      state.perimeter = action.payload;
    },
  },
});

export const { setName, setSpeciality, setAvailable, setNearMe, setPerimeter } = findDoctorSlice.actions;
export default findDoctorSlice.reducer;
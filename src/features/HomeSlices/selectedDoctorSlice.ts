import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface SelectedDoctor {
  UserID: number;
  FirstName: string;
  LastName: string;
  Speciality: string;
  Bio: string;
  imageUrl: string;
  LocationLatitude: number;
  LocationLongitude: number;
  Email: any;
}



const initialState: SelectedDoctor = {
  UserID: 0,
  FirstName: '',
  LastName: '',
  Speciality: '',
  Bio: '',
  imageUrl: '',
  LocationLatitude: 0,
  LocationLongitude: 0,
  Email: '',
};

const selectedDoctorSlice = createSlice({
  name: 'selectedDoctor',
  initialState,
  reducers: {
    setSelectedDoctor: (state, action: PayloadAction<SelectedDoctor>) => {
      return action.payload;
    },
    clearSelectedDoctor: () => initialState,
  },
});

export const { setSelectedDoctor, clearSelectedDoctor } = selectedDoctorSlice.actions;
export default selectedDoctorSlice.reducer;
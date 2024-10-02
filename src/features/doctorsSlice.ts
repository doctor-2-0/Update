import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Doctor {
  id: number;
  name: string;
  speciality: string;
  image: string;
}

interface DoctorsState {
  doctors: Doctor[];
}

const initialState: DoctorsState = {
  doctors: [
    {
      id: 1,
      name: 'Dr. John Doe',
      speciality: 'Cardiologist',
      image: '/path-to-doctor-image.jpg',
    },
    
  ],
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    
  },
});

export default doctorsSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface ServicesState {
  services: Service[];
}

const initialState: ServicesState = {
  services: [
    {
      id: 1,
      title: 'General Consultation',
      description: 'Comprehensive health check-ups and consultations.',
      image: '/path-to-general-consultation-image.jpg',
    },
    // Add more services here
  ],
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    // Add reducers if needed
  },
});

export default servicesSlice.reducer;
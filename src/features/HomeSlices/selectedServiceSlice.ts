import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const initialState: Service = {
    id: '',
    title: '',
    description: '',
    imageUrl: '',
  };

const selectedServiceSlice = createSlice({
  name: 'selectedService',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<Service>) => action.payload,
    clearSelectedService: () => initialState,
  },
});

export const { setSelectedService, clearSelectedService } = selectedServiceSlice.actions;
export default selectedServiceSlice.reducer;
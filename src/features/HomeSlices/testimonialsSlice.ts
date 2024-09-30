import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Testimonial {
  id: number;
  name: string;
  content: string;
  image: string;
}

interface TestimonialsState {
  testimonials: Testimonial[];
}

const initialState: TestimonialsState = {
  testimonials: [
    {
      id: 1,
      name: 'Jane Smith',
      content: 'Great experience with DocConnect. Highly recommended!',
      image: '/path-to-testimonial-image.jpg',
    },
    // Add more testimonials here
  ],
};

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    // Add reducers if needed
  },
});

export default testimonialsSlice.reducer;
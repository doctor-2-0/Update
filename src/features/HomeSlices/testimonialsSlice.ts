import { createSlice } from "@reduxjs/toolkit";

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
      name: "Jane Smith",
      content: "Great experience with DocConnect. Highly recommended!",
      image: "/path-to-testimonial-image.jpg",
    },
  ],
};

const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
});

export default testimonialsSlice.reducer;

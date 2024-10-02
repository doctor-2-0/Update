import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  topic: string;
  message: string;
  acceptTerms: boolean;
}

const initialState: ContactFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  topic: "",
  message: "",
  acceptTerms: false,
};

const contactFormSlice = createSlice({
  name: "contactForm",
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<Partial<ContactFormState>>) => {
      return { ...state, ...action.payload };
    },
    resetForm: () => initialState,
  },
});

export const { updateField, resetForm } = contactFormSlice.actions;
export default contactFormSlice.reducer;

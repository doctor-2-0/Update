import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  firstName: string;
  Username: string;
  password: string;
  confirmPassword: string;
  userType: string;
}

const initialState: FormState = {
  firstName: "",
  Username: "",
  password: "",
  confirmPassword: "",
  userType: "",
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setEmailOrUsername: (state, action: PayloadAction<string>) => {
      state.Username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const {
  setFirstName,
  setEmailOrUsername,
  setPassword,
  setConfirmPassword,
  setUserType,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;

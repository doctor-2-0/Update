import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

interface UpdateStatusPayload {
  id: number;
  status: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  disease: string;
  patientAppointments: Array<{
    id: number;
    appointmentDate: string;
    Status: string;
  }>;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<User[]>("/patient/getUsers");
      console.log("response.data /patient/getUsers ", response.data);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateStatus = createAsyncThunk(
  "appointments/updateStatus",
  async (payload: UpdateStatusPayload, { rejectWithValue }) => {
    try {
      const response = await axios.put("/patient/updateStatus", payload);
      return response.data.appointment;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const updatedAppointment = action.payload;
        const userIndex = state.users.findIndex((user) =>
          user.patientAppointments.some(
            (app) => app.id === updatedAppointment.id
          )
        );
        if (userIndex !== -1) {
          const appointmentIndex = state.users[
            userIndex
          ].patientAppointments.findIndex(
            (app) => app.id === updatedAppointment.id
          );
          if (appointmentIndex !== -1) {
            state.users[userIndex].patientAppointments[appointmentIndex] =
              updatedAppointment;
          }
        }
      });
  },
});

export default userSlice.reducer;
